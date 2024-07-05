import { Inputs, InputLike } from "@solarity/zkit";

declare global {
  module Chai {
    interface Assertion {
      inputs(inputs: Inputs): Assertion;

      outputs(outputs: InputLike[]): AsyncAssertion;
    }

    interface AsyncAssertion extends Assertion, Promise<void> {}
  }
}
