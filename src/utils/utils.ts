import * as fs from "fs";

import { CircuitZKit, NumberLike, Signal, Signals } from "@solarity/zkit";

export function loadOutputs(zkit: CircuitZKit, witness: bigint[], inputs: Signals): Signals {
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

export function getConstraintsNumber(r1csFilePath: string): number {
  const r1csDescriptor = fs.openSync(r1csFilePath, "r");

  const readBytes = (position: number, length: number): bigint => {
    const buffer = Buffer.alloc(length);

    fs.readSync(r1csDescriptor, buffer, { length, position });

    return BigInt(`0x${buffer.reverse().toString("hex")}`);
  };

  /// @dev https://github.com/iden3/r1csfile/blob/d82959da1f88fbd06db0407051fde94afbf8824a/doc/r1cs_bin_format.md#format-of-the-file
  const numberOfSections = readBytes(8, 4);
  let sectionStart = 12;

  for (let i = 0; i < numberOfSections; ++i) {
    const sectionType = Number(readBytes(sectionStart, 4));
    const sectionSize = Number(readBytes(sectionStart + 4, 8));

    /// @dev Reading header section
    if (sectionType == 1) {
      const totalConstraintsOffset = 4 + 8 + 4 + 32 + 4 + 4 + 4 + 4 + 8;

      return Number(readBytes(sectionStart + totalConstraintsOffset, 4));
    }

    sectionStart += 4 + 8 + sectionSize;
  }

  throw new Error(`Header section in ${r1csFilePath} file is not found.`);
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
