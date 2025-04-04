/* Autogenerated file. Do not edit manually. */
// @ts-nocheck
/* tslint:disable */
/* eslint-disable */

import {
  CircuitZKit,
  CircuitZKitConfig,
  Groth16Proof,
  PlonkProof,
  Groth16ProofPoints,
  PlonkProofPoints,
  NumberLike,
  NumericString,
  PublicSignals,
  Groth16Implementer,
  PlonkImplementer,
} from "@solarity/zkit";

import { normalizePublicSignals, denormalizePublicSignals } from "../helpers";

export type PrivateMatrixGroth16 = {
  a: NumberLike[][];
  b: NumberLike[][];
  c: NumberLike;
};

export type PublicMatrixGroth16 = {
  d: NumberLike[][];
  e: NumberLike[][];
  f: NumberLike;
  a: NumberLike[][];
};

export type ProofMatrixGroth16 = {
  proof: Groth16Proof;
  publicSignals: PublicMatrixGroth16;
};

export type CalldataMatrixGroth16 = {
  proofPoints: Groth16ProofPoints;
  publicSignals: [
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
  ];
};

export class Matrix extends CircuitZKit<"groth16"> {
  constructor(config: CircuitZKitConfig) {
    super(config, new Groth16Implementer());
  }

  public async generateProof(inputs: PrivateMatrixGroth16): Promise<ProofMatrixGroth16> {
    const proof = await super.generateProof(inputs as any);

    return {
      proof: proof.proof,
      publicSignals: this._normalizePublicSignals(proof.publicSignals),
    };
  }

  public async calculateWitness(inputs: PrivateMatrixGroth16): Promise<bigint[]> {
    return super.calculateWitness(inputs as any);
  }

  public async verifyProof(proof: ProofMatrixGroth16): Promise<boolean> {
    return super.verifyProof({
      proof: proof.proof,
      publicSignals: this._denormalizePublicSignals(proof.publicSignals),
    });
  }

  public async generateCalldata(proof: ProofMatrixGroth16): Promise<CalldataMatrixGroth16> {
    return super.generateCalldata({
      proof: proof.proof,
      publicSignals: this._denormalizePublicSignals(proof.publicSignals),
    });
  }

  public getSignalNames(): string[] {
    return ["d", "e", "f", "a"];
  }

  public getSignalDimensions(name: string): number[] {
    switch (name) {
      case "d":
        return [3, 3];
      case "e":
        return [3, 3];
      case "f":
        return [];
      case "a":
        return [3, 3];
      default:
        throw new Error(`Unknown signal name: ${name}`);
    }
  }

  private _normalizePublicSignals(publicSignals: PublicSignals): PublicMatrixGroth16 {
    return normalizePublicSignals(publicSignals, this.getSignalNames(), this.getSignalDimensions);
  }

  private _denormalizePublicSignals(publicSignals: PublicMatrixGroth16): PublicSignals {
    return denormalizePublicSignals(publicSignals, this.getSignalNames());
  }
}

export default Matrix;
