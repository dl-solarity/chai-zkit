import { expect } from "chai";
import path from "path";

import { NumberLike, CircuitZKit, Groth16Implementer } from "@solarity/zkit";

import { useFixtureProject } from "./helpers";

import "../src";

import { Matrix as MatrixGroth16 } from "./fixture-projects/complex-circuits/generated-types/zkit";
import { Matrix as MatrixPlonk } from "./fixture-projects/plonk-circuits/generated-types/zkit";

describe("proof", () => {
  const a: NumberLike[][] = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];
  const b: NumberLike[][] = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];
  const c: NumberLike = "1";
  const d: NumberLike[][] = [
    ["2", "5", "0"],
    ["17", "26", "0"],
    ["0", "0", "0"],
  ];
  const e: NumberLike[][] = [
    ["1", "4", "0"],
    ["16", "25", "0"],
    ["0", "0", "0"],
  ];

  function getArtifactsFullPath(circuitDirSourceName: string): string {
    return path.join(process.cwd(), "zkit", "artifacts", "circuits", circuitDirSourceName);
  }

  function getVerifiersDirFullPath(): string {
    return path.join(process.cwd(), "contracts", "verifiers");
  }

  describe("groth16", () => {
    let baseMatrix: CircuitZKit<"groth16">;
    let matrix: MatrixGroth16;

    useFixtureProject("complex-circuits");

    beforeEach(() => {
      const circuitName = "Matrix";
      const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
      const verifierDirPath = getVerifiersDirFullPath();

      baseMatrix = new CircuitZKit({ circuitName, circuitArtifactsPath, verifierDirPath }, new Groth16Implementer());
      matrix = new MatrixGroth16({ circuitName, circuitArtifactsPath, verifierDirPath });
    });

    describe("generateProof", () => {
      it("should not pass if not called on zkit", async () => {
        /// @ts-ignore
        expect(() => expect(1).to.generateProof({ d, e })).to.throw(
          "'generateProof' is expected to be called on 'CircuitZKit'",
        );
      });

      it("should not pass if pass invalid inputs", async () => {
        await expect(expect(matrix).to.generateProof({ a, b } as any)).to.be.rejectedWith(
          "Expected proof generation to be successful, but it isn't",
        );
      });

      it("should not pass if pass valid inputs with negation", async () => {
        await expect(expect(matrix).to.not.generateProof({ a, b, c })).to.be.rejectedWith(
          "Expected proof generation NOT to be successful, but it is",
        );
      });

      it("should correctly generate proof", async () => {
        await expect(matrix).to.generateProof({ a, b, c });
      });

      it("should correctly generate proof with witness overrides", async () => {
        await expect(matrix).to.generateProof({ a, b, c }, { "main.f": 10n });
      });

      it("should pass with invalid inputs and negation", async () => {
        await expect(matrix).to.not.generateProof({ a, b } as any);
      });

      it("should pass if multiple generate proof", async () => {
        await expect(matrix).to.generateProof({ a, b, c }).and.generateProof({ a, b, c });
      });
    });

    describe("useSolidityVerifier", () => {
      it("should not pass if not called on zkit", async () => {
        /// @ts-ignore
        expect(() => expect(1).to.useSolidityVerifier({ a: 1 })).to.throw(
          "'useSolidityVerifier' is expected to be called on 'CircuitZKit'",
        );
      });
    });

    describe("verifyProof", () => {
      it("should not pass if not called on zkit", async () => {
        /// @ts-ignore
        expect(() => expect(1).to.have.verifyProof({ a })).to.throw(
          "'verifyProof' is expected to be called on 'CircuitZKit'",
        );
      });

      it("should not pass if pass invalid proof without negation", async () => {
        const proof = await matrix.generateProof({ a, b, c });

        proof.publicSignals.f = "30";

        await expect(expect(matrix).to.verifyProof(proof)).to.be.rejectedWith(
          "Expected proof verification result to be true, but it isn't",
        );
      });

      it("should not pass if pass invalid proof (with witness overrides) without negation", async () => {
        const proof = await matrix.generateProof({ a, b, c }, { "main.f": 10n });

        await expect(expect(matrix).to.verifyProof(proof)).to.be.rejectedWith(
          "Expected proof verification result to be true, but it isn't",
        );
      });

      it("should not pass if pass valid proof with negation", async () => {
        const proof = await matrix.generateProof({ a, b, c });

        await expect(expect(matrix).to.not.verifyProof(proof)).to.be.rejectedWith(
          "Expected proof verification result NOT to be true, but it is",
        );
      });

      it("should not pass if pass valid proof with solidity contract verifier with negation", async function () {
        const matrixVerifier = await this.hre.ethers.deployContract("MatrixGroth16Verifier");
        const proof = await matrix.generateProof({ a, b, c });

        await expect(
          expect(matrix).to.useSolidityVerifier(matrixVerifier).and.not.verifyProof(proof),
        ).to.be.rejectedWith("Expected proof verification result NOT to be true, but it is");
      });

      it("should not pass if pass invalid proof with solidity contract verifier without negation", async function () {
        const matrixVerifier = await this.hre.ethers.deployContract("MatrixGroth16Verifier");
        const proof = await matrix.generateProof({ a, b, c });

        proof.publicSignals.f = "30";

        await expect(expect(matrix).to.useSolidityVerifier(matrixVerifier).and.verifyProof(proof)).to.be.rejectedWith(
          "Expected proof verification result to be true, but it isn't",
        );
      });

      it("should correctly verify proof without negation", async () => {
        const proof = await matrix.generateProof({ a, b, c });

        await expect(matrix).to.verifyProof(proof);
      });

      it("should correctly verify proof with solidity contract verifier", async function () {
        const matrixVerifier = await this.hre.ethers.deployContract("MatrixGroth16Verifier");
        const proof = await matrix.generateProof({ a, b, c });

        await expect(matrix).to.useSolidityVerifier(matrixVerifier).and.verifyProof(proof);
      });

      it("should correctly verify proof several times", async () => {
        const proof = await matrix.generateProof({ a, b, c });
        const proof2 = await matrix.generateProof({ a, b, c });

        await expect(matrix).to.verifyProof(proof).and.verifyProof(proof2);
      });

      it("should correctly verify proof with negation", async () => {
        const proof = await matrix.generateProof({ a, b, c });

        proof.publicSignals.f = "30";

        await expect(matrix).to.not.verifyProof(proof);
      });

      it("should correctly verify proof with solidity contract verifier and negation", async function () {
        const matrixVerifier = await this.hre.ethers.deployContract("MatrixGroth16Verifier");
        const proof = await matrix.generateProof({ a, b, c });

        proof.publicSignals.f = "30";

        await expect(matrix).to.useSolidityVerifier(matrixVerifier).and.not.verifyProof(proof);
      });
    });
  });

  describe("plonk", () => {
    useFixtureProject("plonk-circuits");

    let matrix: MatrixPlonk;

    beforeEach(() => {
      const circuitName = "Matrix";
      const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
      const verifierDirPath = getVerifiersDirFullPath();

      matrix = new MatrixPlonk({ circuitName, circuitArtifactsPath, verifierDirPath });
    });

    describe("generateProof", () => {
      it("should correctly generate proof", async () => {
        await expect(matrix).to.generateProof({ a, b, c });
      });

      it("should pass with invalid inputs and negation", async () => {
        await expect(matrix).to.not.generateProof({ a, b } as any);
      });
    });

    describe("verifyProof", () => {
      it("should not pass if pass invalid proof without negation", async () => {
        const proof = await matrix.generateProof({ a, b, c });

        proof.publicSignals.f = "30";

        await expect(expect(matrix).to.verifyProof(proof)).to.be.rejectedWith(
          "Expected proof verification result to be true, but it isn't",
        );
      });

      it("should correctly verify proof without negation", async () => {
        const proof = await matrix.generateProof({ a, b, c });

        await expect(matrix).to.verifyProof(proof);
      });

      it("should correctly verify proof with solidity contract verifier", async function () {
        const matrixVerifier = await this.hre.ethers.deployContract("MatrixPlonkVerifier");
        const proof = await matrix.generateProof({ a, b, c });

        await expect(matrix).to.useSolidityVerifier(matrixVerifier).and.verifyProof(proof);
      });
    });
  });
});
