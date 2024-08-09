import { NumberLike, Signals, Signal } from "@solarity/zkit";

import { flattenSignals, flattenSignal, stringifySignal } from "./utils";

export function outputSignalsCompare(
  instance: any,
  actualOutputSignals: Signals,
  expectedOutputSignals: Signals | NumberLike[],
  isStrict?: boolean,
) {
  if (Array.isArray(expectedOutputSignals)) {
    const actualOutputsArr: NumberLike[] = flattenSignals(actualOutputSignals);

    if (
      (isStrict && actualOutputsArr.length !== expectedOutputSignals.length) ||
      actualOutputsArr.length < expectedOutputSignals.length
    ) {
      throw new Error(`Expected ${actualOutputsArr.length} output signals, but got ${expectedOutputSignals.length}`);
    }

    expectedOutputSignals.forEach((output: NumberLike, index: number) => {
      instance.assert(
        BigInt(output) === BigInt(actualOutputsArr[index]),
        `Expected output signal with index "${index}" to be "${output}", but got "${actualOutputsArr[index]}"`,
        `Expected output signal "${output}" NOT to be "${output}", but it is"`,
      );
    });
  } else {
    if (isStrict && Object.keys(actualOutputSignals).length !== Object.keys(expectedOutputSignals).length) {
      throw new Error(
        `Expected ${Object.keys(actualOutputSignals).length} output signals, but got ${Object.keys(expectedOutputSignals).length}`,
      );
    }

    for (const output of Object.keys(expectedOutputSignals)) {
      instance.assert(
        compareSignals(actualOutputSignals[output], expectedOutputSignals[output]),
        `Expected output signal "${output}" to be "${stringifySignal(expectedOutputSignals[output])}", but got "${stringifySignal(actualOutputSignals[output])}"`,
        `Expected output signal "${output}" NOT to be "${stringifySignal(expectedOutputSignals[output])}", but it is"`,
      );
    }
  }
}

function compareSignals(actualSignal: Signal, expectedSignal: Signal): boolean {
  const actualSignalValues: NumberLike[] = flattenSignal(actualSignal);
  const expectedSignalValues: NumberLike[] = flattenSignal(expectedSignal);

  if (actualSignalValues.length !== expectedSignalValues.length) {
    return false;
  }

  for (let i = 0; i < actualSignalValues.length; i++) {
    if (BigInt(actualSignalValues[i]) !== BigInt(expectedSignalValues[i])) {
      return false;
    }
  }

  return true;
}
