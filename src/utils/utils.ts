import * as fs from "fs";
import * as snarkjs from "snarkjs";

import { CircuitZKit, NumberLike, Signal, Signals, ProvingSystemType } from "@solarity/zkit";

import { BN128_CURVE_NAME } from "../constants";
import { LinearCombination, R1CSConstraint } from "../types/utils";

export function loadOutputs(zkit: CircuitZKit<ProvingSystemType>, witness: bigint[], inputs: Signals): Signals {
  const signalToIndex = loadSym(zkit);
  const signals = Array.from(signalToIndex.keys());

  const minInputIndex = Math.min(
    ...Object.keys(inputs)
      .map((signal) => {
        const dimensions = countSignalDimensions(inputs[signal]);
        const indexes = "[0]".repeat(dimensions);

        return `main.${signal}${indexes}`;
      })
      .map((signal) => signals.indexOf(signal)),
  );

  if (minInputIndex === -1) {
    throw new Error("Sym file is missing input signals");
  }

  return parseOutputSignals(witness, signals.slice(0, minInputIndex), signalToIndex);
}

export function flattenSignals(signals: Signals): NumberLike[] {
  let flattenSignalsArr: NumberLike[] = [];

  for (const output of Object.keys(signals)) {
    flattenSignalsArr.push(...flattenSignal(signals[output]));
  }

  return flattenSignalsArr;
}

export function flattenSignal(signal: Signal): NumberLike[] {
  const flatValue = Array.isArray(signal) ? signal.flatMap((signal) => flattenSignal(signal)) : signal;

  return Array.isArray(flatValue) ? flatValue : [flatValue];
}

export function stringifySignal(signal: Signal): string {
  return JSON.stringify(signal, (_, v) => (typeof v === "bigint" ? v.toString() : v)).replaceAll(`"`, "");
}

export async function getConstraintsNumber(r1csFilePath: string, provingSystem: ProvingSystemType): Promise<number> {
  const curve = await (snarkjs as any).curves.getCurveFromName(BN128_CURVE_NAME);

  let constraints: number = 0;

  try {
    switch (provingSystem) {
      case "groth16":
        constraints = await getGroth16ConstraintsNumber(r1csFilePath);
        break;
      case "plonk":
        constraints = await getPlonkConstraintsNumber(r1csFilePath, curve.Fr);
        break;
      default:
        throw new Error(`Unsupported proving system: ${provingSystem}`);
    }
  } finally {
    await curve.terminate();
  }

  return constraints;
}

function loadSym(zkit: CircuitZKit<ProvingSystemType>): Map<string, number> {
  const symFile = zkit.mustGetArtifactsFilePath("sym");
  const signals = new Map<string, number>();

  fs.readFileSync(symFile, { encoding: "utf-8" })
    .trim()
    .split("\n")
    .forEach((line) => {
      const tokens = line.trim().split(",");
      const wtnsIndex = parseInt(tokens[1]);
      const signal = tokens[3];

      signals.set(signal, wtnsIndex);
    });

  return signals;
}

function parseOutputSignals(witness: bigint[], signals: string[], signalToIndex: Map<string, number>): Signals {
  let outputSignals: Signals = {};

  for (let l = 0; l < signals.length; l++) {
    const currentOutput = signals[l].split(".")[1].split("[")[0];

    let r = l + 1;
    while (r < signals.length) {
      const nextOutput = signals[r].split(".")[1].split("[")[0];
      if (currentOutput !== nextOutput) {
        break;
      }

      r++;
    }

    outputSignals[currentOutput] = parseOutputSignal(witness, signals.slice(l, r), signalToIndex);

    l = r - 1;
  }

  return outputSignals;
}

function parseOutputSignal(witness: bigint[], signals: string[], signalToIndex: Map<string, number>): Signal {
  if (signals.length === 1 && signals[0].indexOf("[") === -1) {
    return witness[signalToIndex.get(signals[0])!];
  }

  const dimensions = signals[signals.length - 1]
    .split("[")
    .slice(1)
    .map((e) => parseInt(e.slice(0, -1)));

  let it = 0;

  function buildSignalRecursively(dimension: number): Signal {
    let signal = [];

    if (dimension === dimensions.length - 1) {
      for (let i = 0; i <= dimensions[dimension]; i++) {
        signal.push(witness[signalToIndex.get(signals[it++])!]);
      }

      return signal;
    }

    for (let i = 0; i <= dimensions[dimension]; i++) {
      signal.push(buildSignalRecursively(dimension + 1));
    }

    return signal as Signal;
  }

  return buildSignalRecursively(0);
}

function countSignalDimensions(signal: Signal): number {
  if (!Array.isArray(signal)) {
    return 0;
  }

  return countSignalDimensions(signal[0]) + 1;
}

async function getGroth16ConstraintsNumber(r1csFilePath: string): Promise<number> {
  const r1cs = await snarkjs.r1cs.info(r1csFilePath);

  return r1cs.nConstraints + r1cs.nPubInputs + r1cs.nOutputs;
}

async function getPlonkConstraintsNumber(r1csFilePath: string, Fr: any): Promise<number> {
  const normalize = (lc: LinearCombination) => {
    Object.keys(lc).forEach((key) => {
      if (lc[key] == 0n) delete lc[key];
    });
  };

  const join = (lc1: LinearCombination, k: bigint, lc2: LinearCombination) => {
    const res = { ...lc1 };

    Object.keys(lc2).forEach((s) => {
      res[s] = res[s] ? Fr.add(res[s], Fr.mul(k, lc2[s])) : lc2[s];
    });

    normalize(res);

    return res;
  };

  const reduceCoefs = (linearComb: LinearCombination, maxC: number) => {
    let n = Object.keys(linearComb).filter((s) => s !== "0" && linearComb[s] != 0n).length;

    while (n > maxC) {
      plonkConstraintsCount++;
      n--;
    }
  };

  const addConstraintSum = (lc: LinearCombination) => {
    reduceCoefs(lc, 3);
    plonkConstraintsCount++;
  };

  const getLinearCombinationType = (lc: LinearCombination) => {
    let k = Fr.zero;
    let n = 0;

    Object.keys(lc).forEach((key) => {
      if (lc[key] === 0n) {
        return;
      }

      if (key === "0") {
        k = Fr.add(k, lc[key]);
      } else {
        n++;
      }
    });

    return n > 0 ? n.toString() : k != Fr.zero ? "k" : "0";
  };

  const process = (lcA: LinearCombination, lcB: LinearCombination, lcC: LinearCombination) => {
    const lctA = getLinearCombinationType(lcA);
    const lctB = getLinearCombinationType(lcB);

    if (lctA === "0" || lctB === "0") {
      normalize(lcC);
      addConstraintSum(lcC);
    } else if (lctA === "k") {
      addConstraintSum(join(lcB, lcA[0], lcC));
    } else if (lctB === "k") {
      addConstraintSum(join(lcA, lcB[0], lcC));
    } else {
      [lcA, lcB, lcC].forEach((lc) => reduceCoefs(lc, 1));
      plonkConstraintsCount++;
    }
  };

  const r1cs = await snarkjs.r1cs.info(r1csFilePath);

  let plonkConstraintsCount = r1cs.nOutputs + r1cs.nPubInputs;

  r1cs.constraints.forEach((constraint: R1CSConstraint) => process(...constraint));

  return plonkConstraintsCount;
}
