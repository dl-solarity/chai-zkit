import { CircuitZKit, NumberLike, Signals } from "@solarity/zkit";

import { outputSignalsCompare } from "./utils";

export function proof(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  chai.Assertion.addMethod("generateProof", function (this: any, inputs: Signals) {
    const obj = utils.flag(this, "object");

    if (!(obj instanceof CircuitZKit)) {
      throw new Error("`generateProof` is expected to be called on `CircuitZKit`");
    }

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      const proof = await obj.generateProof(inputs);

      utils.flag(this, "inputs", inputs);
      utils.flag(this, "generatedProof", proof);
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });

  chai.Assertion.addMethod("publicSignals", function (this: any, pubSignals: Signals | NumberLike[]) {
    const obj = utils.flag(this, "object");
    const isStrict = utils.flag(this, "strict");

    if (!(obj instanceof CircuitZKit)) {
      throw new Error("`publicSignals` is expected to be called on `CircuitZKit`");
    }

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      const generatedProof = utils.flag(this, "generatedProof");

      if (!generatedProof) {
        throw new Error("`publicSignals` is expected to be called after `generateProof`");
      }

      outputSignalsCompare(this, generatedProof.publicSignals, pubSignals, isStrict);
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });

  chai.Assertion.addMethod("verifyProof", function (this: any, proof: any) {
    const obj = utils.flag(this, "object");

    if (!(obj instanceof CircuitZKit)) {
      throw new Error("`verifyProof` is expected to be called on `CircuitZKit`");
    }

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      this.assert(
        await obj.verifyProof(proof),
        "Expected proof verification result to be true, but it isn't",
        "Expected proof verification result NOT to be true, but it is",
      );
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });
}
