import { CircuitZKit } from "@solarity/zkit";

import { Signal } from "./types";
import { loadWitness, loadOutputs } from "./utils";

export function witness(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  chai.Assertion.addMethod("witnessInputs", function (this: any, inputs: Record<string, Signal>) {
    const obj = utils.flag(this, "object");

    if (!(obj instanceof CircuitZKit)) {
      throw new Error("`witnessInputs` is expected to be called on `CircuitZKit`");
    }

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      const witness = await loadWitness(obj as CircuitZKit, inputs);

      utils.flag(this, "inputs", inputs);
      utils.flag(this, "witness", witness);
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });

  chai.Assertion.addMethod("witnessOutputs", function (this: any, outputs: Record<string, Signal>) {
    const obj = utils.flag(this, "object");
    const negated = utils.flag(this, "negate");

    if (!(obj instanceof CircuitZKit)) {
      throw new Error("`witnessOutputs` is expected to be called on `CircuitZKit`");
    }

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      const witness = utils.flag(this, "witness");
      const inputs = utils.flag(this, "inputs");

      if (!witness || !inputs) {
        throw new Error("`witnessInputs` is expected to be called after `witnessOutputs`");
      }

      const actual = loadOutputs(obj as CircuitZKit, witness, inputs);

      this.assert(
        Object.keys(actual).length === Object.keys(outputs).length,
        "Expected to have the same number of outputs",
      );

      for (const output of Object.keys(outputs)) {
        this.assert(
          deepCompareSignals(actual[output], outputs[output]),
          `Expected output ${output} to be ${outputs[output]}, but got ${actual[output]})}`,
        );
      }

      if (negated) {
        this.assert(false, "Expected outputs to not match");
      }
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });
}

function deepCompareSignals(lhs: Signal, rhs: Signal): boolean {
  if (Array.isArray(lhs) !== Array.isArray(rhs)) {
    return false;
  }

  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    if (lhs.length !== rhs.length) {
      return false;
    }

    for (let i = 0; i < lhs.length; i++) {
      if (!deepCompareSignals(lhs[i], rhs[i])) {
        return false;
      }
    }
  }

  return lhs.toString() === rhs.toString();
}
