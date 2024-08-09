/* Autogenerated file. Do not edit manually. */
// @ts-nocheck
/* tslint:disable */
/* eslint-disable */

import { CircuitZKit, CircuitZKitConfig, Groth16Proof, NumberLike, NumericString, PublicSignals } from "@solarity/zkit";

import { normalizePublicSignals, denormalizePublicSignals } from "../utils";

export type PrivateNoInputs = {};

export type PublicNoInputs = {
  c: NumberLike;
};

export type ProofNoInputs = {
  proof: Groth16Proof;
  publicSignals: PublicNoInputs;
};

export type Calldata = [
  [NumericString, NumericString],
  [[NumericString, NumericString], [NumericString, NumericString]],
  [NumericString, NumericString],
  [NumericString],
];

export class NoInputs extends CircuitZKit {
  constructor(config: CircuitZKitConfig) {
    super(config);
  }

  public async generateProof(inputs: PrivateNoInputs): Promise<ProofNoInputs> {
    const proof = await super.generateProof(inputs as any);

    return {
      proof: proof.proof,
      publicSignals: this._normalizePublicSignals(proof.publicSignals),
    };
  }

  public async calculateWitness(inputs: PrivateNoInputs): Promise<bigint[]> {
    return super.calculateWitness(inputs as any);
  }

  public async verifyProof(proof: ProofNoInputs): Promise<boolean> {
    return super.verifyProof({
      proof: proof.proof,
      publicSignals: this._denormalizePublicSignals(proof.publicSignals),
    });
  }

  public async generateCalldata(proof: ProofNoInputs): Promise<Calldata> {
    return super.generateCalldata({
      proof: proof.proof,
      publicSignals: this._denormalizePublicSignals(proof.publicSignals),
    });
  }

  public getSignalNames(): string[] {
    return ["c"];
  }

  public getSignalDimensions(name: string): number[] {
    switch (name) {
      case "c":
        return [];
      default:
        throw new Error(`Unknown signal name: ${name}`);
    }
  }

  private _normalizePublicSignals(publicSignals: PublicSignals): PublicNoInputs {
    return normalizePublicSignals(publicSignals, this.getSignalNames(), this.getSignalDimensions);
  }

  private _denormalizePublicSignals(publicSignals: PublicNoInputs): PublicSignals {
    return denormalizePublicSignals(publicSignals, this.getSignalNames());
  }
}

export default NoInputs;
