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

      if (Object.keys(actual).length !== Object.keys(outputs).length) {
        throw new Error(`Expected ${Object.keys(outputs).length} outputs, but got ${Object.keys(actual).length}`);
      }

      for (const output of Object.keys(outputs)) {
        this.assert(
          jsonStringify(actual[output]) === jsonStringify(outputs[output]),
          `Expected output "${output}" to be "${jsonStringify(outputs[output])}", but got "${jsonStringify(actual[output])}"`,
          `Expected output "${output}" NOT to be "${jsonStringify(outputs[output])}", but it is"`,
        );
      }
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });
}

function jsonStringify(signal: Signal): string {
  const stringSignal = JSON.stringify(signal, (_, v) => (typeof v === "bigint" ? v.toString() : v));

  return stringSignal.replaceAll(`"`, "");
}
