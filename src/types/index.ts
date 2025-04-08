export type ExtractInputs<T> = T extends { generateProof(inputs: infer P): Promise<any> } ? P : never;
export type ExtractOutputs<T> = Omit<ExtractPublicSignals<T>, keyof ExtractInputs<T>>;

export type ExtractWitnessOverridesType<T> = T extends {
  generateProof(inputs: any, witnessOverrides?: infer P): Promise<any>;
}
  ? P
  : never;

type ExtractPublicSignals<T> = T extends { verifyProof(proof: { publicSignals: infer P }): Promise<boolean> }
  ? P
  : never;
type ExtractProofType<T> = T extends { verifyProof(proof: infer P): Promise<boolean> } ? P : never;

type Circuit = {
  generateProof(inputs: any, witnessOverrides?: any): Promise<any>;
  verifyProof(proof: any): Promise<boolean>;
};

type Inputs<T> = T extends Circuit ? ExtractInputs<T> : never;
type Outputs<T> = T extends Circuit ? Partial<ExtractOutputs<T>> : never;
type WitnessOverrides<T> = T extends Circuit ? ExtractWitnessOverridesType<T> : never;
type Proof<T> = T extends Circuit ? ExtractProofType<T> : never;

declare global {
  module Chai {
    interface ChaiStatic {
      expect: ExpectStatic;
    }

    interface ExpectStatic {
      <T>(val: T, message?: string): Assertion<T>;
    }

    interface AsyncAssertion<T = any> extends Promise<void> {
      not: AsyncAssertion<T>;
      strict: AsyncAssertion<T>;
      constraints: AsyncAssertion<T>;
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

      witnessInputs(inputs: Inputs<T>, witnessOverrides?: WitnessOverrides<T>): AsyncAssertion<T>;
      witnessOutputs(outputs: Outputs<T>): AsyncAssertion<T>;
      passConstraints(): AsyncAssertion<T>;

      generateProof(inputs: Inputs<T>, witnessOverrides?: WitnessOverrides<T>): AsyncAssertion<T>;
      verifyProof(proof: Proof<T>): AsyncAssertion<T>;
      useSolidityVerifier(verifierContract: any): AsyncAssertion<T>;
    }

    interface Assertion<T = any> {
      constraints: Assertion<T>;
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

      witnessInputs(inputs: Inputs<T>, witnessOverrides?: WitnessOverrides<T>): AsyncAssertion<T>;
      witnessOutputs(outputs: Outputs<T>): AsyncAssertion<T>;
      passConstraints(): AsyncAssertion<T>;

      generateProof(inputs: Inputs<T>, witnessOverrides?: WitnessOverrides<T>): AsyncAssertion<T>;
      verifyProof(proof: Proof<T>): AsyncAssertion<T>;
      useSolidityVerifier(verifierContract: any): AsyncAssertion<T>;
    }
  }
}
