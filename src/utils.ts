import * as fs from "fs";

import { CircuitZKit, Signal, Signals } from "@solarity/zkit";

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

export function stringifySignal(signal: Signal): string {
  return JSON.stringify(signal, (_, v) => (typeof v === "bigint" ? v.toString() : v)).replaceAll(`"`, "");
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
