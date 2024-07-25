export type NumberLike = number | bigint | `${number}`;
export type Signal = NumberLike | Signal[];

declare global {
  module Chai {
    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
      witnessInputs(inputs: Record<string, Signal>): AsyncAssertion;
      witnessOutputs(outputs: Record<string, Signal>): AsyncAssertion;
    }

    interface AsyncAssertion extends Assertion, Promise<void> {}
  }
}
