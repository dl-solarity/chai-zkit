// @ts-expect-error
import { wasm as wasm_tester } from "circom_tester";
import * as fs from "fs";
import path from "path";
import * as snarkjs from "snarkjs";

import { CircuitZKit } from "@solarity/zkit";

import { Signal } from "./types";

export async function loadWitness(zkit: CircuitZKit, inputs: Record<string, Signal>): Promise<bigint[]> {
  const wasmFile = zkit.mustGetArtifactsFilePath("wasm");
  const wtnsFile = path.join(wasmFile, "..", `${zkit.getCircuitName()}.wtns`);

  await snarkjs.wtns.calculate(inputs, wasmFile, wtnsFile);

  const witness = (await snarkjs.wtns.exportJson(wtnsFile)) as bigint[];

  fs.rmSync(wtnsFile);

  return witness;
}

export function loadOutputs(
  zkit: CircuitZKit,
  witness: bigint[],
  inputs: Record<string, Signal>,
): Record<string, Signal> {
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

function loadSym(zkit: CircuitZKit): Map<string, number> {
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

function parseOutputSignals(
  witness: bigint[],
  signals: string[],
  signalToIndex: Map<string, number>,
): Record<string, Signal> {
  let outputSignals: Record<string, Signal> = {};

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
  if (signals[0].length === 1 && signals[0].indexOf("[") === -1) {
    return witness[signalToIndex.get(signals[0])!];
  }

  const dimensions = signals[signals.length - 1]
    .split("[")
    .slice(1)
    .map((e) => parseInt(e.slice(0, -1)));

  let it = 0;

  function buildSignalRecursively(dimension: number): Signal {
    let signal: Signal = [];

    if (dimension === dimensions.length - 1) {
      for (let i = 0; i <= dimensions[dimension]; i++) {
        signal.push(witness[signalToIndex.get(signals[it++])!]);
      }

      return signal;
    }

    for (let i = 0; i <= dimensions[dimension]; i++) {
      signal.push(buildSignalRecursively(dimension + 1));
    }

    return signal;
  }

  return buildSignalRecursively(0);
}

function countSignalDimensions(signal: Signal): number {
  if (!Array.isArray(signal)) {
    return 0;
  }

  return countSignalDimensions(signal[0]) + 1;
}
