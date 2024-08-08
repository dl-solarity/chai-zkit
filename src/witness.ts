import { CircuitZKit, NumberLike, Signals } from "@solarity/zkit";

import { compareSignals, flattenSignals, loadOutputs, stringifySignal } from "./utils";

export function witness(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  chai.Assertion.addProperty("strict", function (this: any) {
    utils.flag(this, "strict", true);

    return this;
  });

  chai.Assertion.addMethod("witnessInputs", function (this: any, inputs: Signals) {
    const obj = utils.flag(this, "object");

    if (!(obj instanceof CircuitZKit)) {
      throw new Error("`witnessInputs` is expected to be called on `CircuitZKit`");
    }

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      const witness = await (obj as CircuitZKit).calculateWitness(inputs);

      utils.flag(this, "inputs", inputs);
      utils.flag(this, "witness", witness);
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });

  chai.Assertion.addChainableMethod;

  chai.Assertion.addMethod("witnessOutputs", function (this: any, outputs: Signals | NumberLike[]) {
    const obj = utils.flag(this, "object");
    const isStrict = utils.flag(this, "strict");

    if (!(obj instanceof CircuitZKit)) {
      throw new Error("`witnessOutputs` is expected to be called on `CircuitZKit`");
    }

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      const witness = utils.flag(this, "witness");
      const inputs = utils.flag(this, "inputs");

      if (!witness) {
        throw new Error("`witnessOutputs` is expected to be called after `witnessInputs`");
      }

      if (Object.keys(inputs).length === 0) {
        throw new Error("Circuit must have at least one input to extract outputs");
      }

      const actual = loadOutputs(obj as CircuitZKit, witness, inputs);

      witnessOutputsCompare(this, actual, outputs, isStrict);
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });
}

function witnessOutputsCompare(
  instance: any,
  actualOutputs: Signals,
  expectedOutputs: Signals | NumberLike[],
  isStrict?: boolean,
) {
  if (Array.isArray(expectedOutputs)) {
    const actualOutputsArr: NumberLike[] = flattenSignals(actualOutputs);

    if (isStrict && actualOutputsArr.length !== expectedOutputs.length) {
      throw new Error(`Expected ${actualOutputsArr.length} outputs, but got ${expectedOutputs.length}`);
    }

    expectedOutputs.forEach((output: NumberLike, index: number) => {
      instance.assert(
        BigInt(output) === BigInt(actualOutputsArr[index]),
        `Expected output with index "${index}" to be "${output}", but got "${actualOutputsArr[index]}"`,
        `Expected output "${output}" NOT to be "${output}", but it is"`,
      );
    });
  } else {
    if (isStrict && Object.keys(actualOutputs).length !== Object.keys(expectedOutputs).length) {
      throw new Error(
        `Expected ${Object.keys(expectedOutputs).length} outputs, but got ${Object.keys(actualOutputs).length}`,
      );
    }

    for (const output of Object.keys(expectedOutputs)) {
      instance.assert(
        compareSignals(actualOutputs[output], expectedOutputs[output]),
        `Expected output "${output}" to be "${stringifySignal(expectedOutputs[output])}", but got "${stringifySignal(actualOutputs[output])}"`,
        `Expected output "${output}" NOT to be "${stringifySignal(expectedOutputs[output])}", but it is"`,
      );
    }
  }
}
