import * as snarkjs from "snarkjs";

import { CircuitZKit, NumberLike, ProvingSystemType, Signals, writeWitnessFile } from "@solarity/zkit";

import {
  STRICT_PROPERTY,
  WITNESS_INPUTS_METHOD,
  WITNESS_OUTPUTS_METHOD,
  WITNESS_PASS_CONSTRAINTS_METHOD,
} from "../constants";
import { checkCircuitZKit, loadOutputs, outputSignalsCompare } from "../utils";

export function witness(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  chai.Assertion.addProperty(STRICT_PROPERTY, function (this: any) {
    utils.flag(this, "strict", true);

    return this;
  });

  chai.Assertion.addMethod(
    WITNESS_INPUTS_METHOD,
    function (this: any, inputs: Signals, witnessOverrides?: Record<string, bigint>) {
      const obj = utils.flag(this, "object");

      checkCircuitZKit(obj, WITNESS_INPUTS_METHOD);

      const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
        const witness = await obj.calculateWitness(inputs, witnessOverrides);

        utils.flag(this, "inputs", inputs);
        utils.flag(this, "witness", witness);
      });

      this.then = promise.then.bind(promise);
      this.catch = promise.catch.bind(promise);

      return this;
    },
  );

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

  chai.Assertion.addMethod(WITNESS_PASS_CONSTRAINTS_METHOD, function (this: any) {
    const obj = utils.flag(this, "object");

    checkCircuitZKit(obj, WITNESS_PASS_CONSTRAINTS_METHOD);

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      const witness = utils.flag(this, "witness");

      if (!witness) {
        throw new Error("`passConstraints` is expected to be called after `witnessInputs`");
      }

      const r1csFile = obj.mustGetArtifactsFilePath("r1cs");
      const witnessFile = obj.getTemporaryWitnessPath();

      await writeWitnessFile(witnessFile, witness);

      const constraintsPassed = await snarkjs.wtns.check(r1csFile, witnessFile, {
        info: () => {},
        warn: () => {},
      });

      this.assert(
        constraintsPassed,
        "Expected witness to pass constraints, but it doesn't",
        "Expected witness NOT to pass constraints, but it does",
      );
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });
}
