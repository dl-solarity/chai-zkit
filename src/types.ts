export type ExtractInputs<T> = T extends { generateProof(inputs: infer P): Promise<any> } ? P : never;
export type ExtractOutputs<T> = Omit<ExtractPublicSignals<T>, keyof ExtractInputs<T>>;

type ExtractPublicSignals<T> = T extends { verifyProof(proof: { publicSignals: infer P }): Promise<boolean> }
  ? P
  : never;
type ExtractProofType<T> = T extends { verifyProof(proof: infer P): Promise<boolean> } ? P : never;

type Circuit = {
  generateProof(inputs: any): Promise<any>;
  verifyProof(proof: any): Promise<boolean>;
};

declare global {
  module Chai {
    interface ChaiStatic {
      expect: ExpectStatic;
    }

    interface ExpectStatic {
      <T>(val: T, message?: string): Assertion<T>;
    }

    interface Witness<T = any> {
      witnessInputs(inputs: T extends Circuit ? ExtractInputs<T> : never): AsyncAssertion<T>;
      witnessOutputs(outputs: T extends Circuit ? Partial<ExtractOutputs<T>> : never): AsyncAssertion<T>;
    }

    interface Proof<T = any> {
      generateProof(inputs: T extends Circuit ? ExtractInputs<T> : never): AsyncAssertion<T>;
      publicSignals(pubSignals: T extends Circuit ? Partial<ExtractPublicSignals<T>> : never): AsyncAssertion<T>;
      verifyProof(proof: T extends Circuit ? ExtractProofType<T> : never): AsyncAssertion<T>;
    }

    interface AsyncAssertion<T = any> extends Promise<void>, Witness<T>, Proof<T> {
      not: AsyncAssertion<T>;
      strict: AsyncAssertion<T>;
      to: AsyncAssertion<T>;
      be: AsyncAssertion<T>;
      been: AsyncAssertion<T>;
      is: AsyncAssertion<T>;
      that: AsyncAssertion<T>;
      which: AsyncAssertion<T>;
      and: AsyncAssertion<T>;
      has: AsyncAssertion<T>;
      have: AsyncAssertion<T>;
      with: AsyncAssertion<T>;
      at: AsyncAssertion<T>;
      of: AsyncAssertion<T>;
      same: AsyncAssertion<T>;
      but: AsyncAssertion<T>;
      does: AsyncAssertion<T>;
    }

    interface Assertion<T = any> extends Witness<T>, Proof<T> {
      to: Assertion<T>;
      be: Assertion<T>;
      been: Assertion<T>;
      is: Assertion<T>;
      that: Assertion<T>;
      which: Assertion<T>;
      and: Assertion<T>;
      has: Assertion<T>;
      have: Assertion<T>;
      with: Assertion<T>;
      at: Assertion<T>;
      of: Assertion<T>;
      same: Assertion<T>;
      but: Assertion<T>;
      does: Assertion<T>;
    }
  }
}
