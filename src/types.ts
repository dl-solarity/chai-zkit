export type NumberLike = number | bigint | `${number}`;
export type Signal = NumberLike | Signal[];

export type ExtractInputs<T> = T extends { generateProof(inputs: infer P): Promise<any> } ? P : never;
export type ExtractOutputs<T> = Omit<ExtractPublicSignals<T>, keyof ExtractInputs<T>>;

type ExtractPublicSignals<T> = T extends { verifyProof(proof: { publicSignals: infer P }): Promise<boolean> }
  ? P
  : never;

type Circuit = {
  createVerifier(): Promise<void>;
};

declare global {
  module Chai {
    interface ChaiStatic {
      expect: ExpectStatic;
    }

    export interface ExpectStatic {
      <T extends Circuit>(val: T, message?: string): Assertion<T>;
    }

    export interface Assertion<T = any> {
      to: Assertion<T>;
      with: Assertion<T>;
      have: Assertion<T>;

      witnessInputs(inputs: T extends Circuit ? ExtractInputs<T> : never): AsyncAssertion<T>;
      witnessOutputs(outputs: T extends Circuit ? ExtractOutputs<T> : never): AsyncAssertion<T>;
    }

    interface AsyncAssertion<T = any> extends Assertion<T>, Promise<void> {}
  }
}
