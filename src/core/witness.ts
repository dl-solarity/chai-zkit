import { CircuitZKit, NumberLike, ProvingSystemType, Signals } from "@solarity/zkit";

import { STRICT_PROPERTY, WITNESS_INPUTS_METHOD, WITNESS_OUTPUTS_METHOD } from "../constants";
import { checkCircuitZKit, loadOutputs, outputSignalsCompare } from "../utils";

export function witness(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  chai.Assertion.addProperty(STRICT_PROPERTY, function (this: any) {
    utils.flag(this, "strict", true);

    return this;
  });

  chai.Assertion.addMethod(WITNESS_INPUTS_METHOD, function (this: any, inputs: Signals) {
    const obj = utils.flag(this, "object");

    checkCircuitZKit(obj, WITNESS_INPUTS_METHOD);

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      const witness = await obj.calculateWitness(inputs);

      utils.flag(this, "inputs", inputs);
      utils.flag(this, "witness", witness);
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });

  chai.Assertion.addMethod(WITNESS_OUTPUTS_METHOD, function (this: any, outputs: Signals | NumberLike[]) {
    const obj = utils.flag(this, "object");
    const isStrict = utils.flag(this, "strict");

    checkCircuitZKit(obj, WITNESS_OUTPUTS_METHOD);

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      const witness = utils.flag(this, "witness");
      const inputs = utils.flag(this, "inputs");

      if (!witness) {
        throw new Error("`witnessOutputs` is expected to be called after `witnessInputs`");
      }

      if (Object.keys(inputs).length === 0) {
        throw new Error("Circuit must have at least one input to extract outputs");
      }

      const actual = loadOutputs(obj as CircuitZKit<ProvingSystemType>, witness, inputs);

      outputSignalsCompare(this, actual, outputs, isStrict);
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });
}
