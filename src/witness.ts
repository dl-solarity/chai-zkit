import { CircuitZKit, NumberLike, Signals } from "@solarity/zkit";

import { loadOutputs, outputSignalsCompare } from "./utils";

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
      const witness = await obj.calculateWitness(inputs);

      utils.flag(this, "inputs", inputs);
      utils.flag(this, "witness", witness);
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });

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

      outputSignalsCompare(this, actual, outputs, isStrict);
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });
}
