import { expect } from "chai";

import path from "path";

import { NumberLike, CircuitZKit, Signals } from "@solarity/zkit";

import { useFixtureProject } from "./helpers";

import "../src";

import { Matrix } from "./fixture-projects/complex-circuits/generated-types/zkit";
import { flattenSignals } from "../src/utils";

describe("proof", () => {
  let a: NumberLike[][];
  let b: NumberLike[][];
  let c: NumberLike;
  let d: NumberLike[][];
  let e: NumberLike[][];
  let f: NumberLike;

  let baseMatrix: CircuitZKit;
  let matrix: Matrix;

  function getArtifactsFullPath(circuitDirSourceName: string): string {
    return path.join(process.cwd(), "zkit", "artifacts", "circuits", circuitDirSourceName);
  }

  function getVerifiersDirFullPath(): string {
    return path.join(process.cwd(), "contracts", "verifiers");
  }

  function getSignalsArr(signals: Signals): string[] {
    return flattenSignals(signals).map((val: NumberLike) => val.toString());
  }

  useFixtureProject("complex-circuits");

  beforeEach(() => {
    const circuitName = "Matrix";
    const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
    const verifierDirPath = getVerifiersDirFullPath();

    baseMatrix = new CircuitZKit({ circuitName, circuitArtifactsPath, verifierDirPath });
    matrix = new Matrix({ circuitName, circuitArtifactsPath, verifierDirPath });

    a = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
    ];
    b = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
    ];
    c = "1";
    d = [
      ["2", "5", "0"],
      ["17", "26", "0"],
      ["0", "0", "0"],
    ];
    e = [
      ["1", "4", "0"],
      ["16", "25", "0"],
      ["0", "0", "0"],
    ];
    f = "1";
  });

  describe("generateProof", () => {
    it("should not pass if not called on zkit", async () => {
      /// @ts-ignore
      expect(() => expect(1).to.generateProof({ d, e })).to.throw(
        "`generateProof` is expected to be called on `CircuitZKit`",
      );
    });

    it("should correctly generate proof", async () => {
      await expect(matrix).to.generateProof({ a, b, c });
    });

    it("should pass if multiple generate proof", async () => {
      await expect(matrix).to.generateProof({ a, b, c }).and.generateProof({ a, b, c });
    });
  });

  describe("publicSignals", () => {
    it("should not pass if not called on zkit", async () => {
      /// @ts-ignore
      expect(() => expect(1).to.have.publicSignals({ d, e })).to.throw(
        "`publicSignals` is expected to be called on `CircuitZKit`",
      );
    });

    it("should not pass if called not after witnessInputs", async () => {
      await expect(expect(matrix).to.have.publicSignals({ d, e })).to.be.rejectedWith(
        "`publicSignals` is expected to be called after `generateProof`",
      );
    });

    it("should not pass if public signals are incorrect for given inputs", async () => {
      e = d;

      await expect(expect(matrix).to.generateProof({ a, b, c }).and.have.publicSignals({ e })).to.be.rejectedWith(
        `Expected output signal "e" to be "[[2,5,0],[17,26,0],[0,0,0]]", but got "[[1,4,0],[16,25,0],[0,0,0]]"`,
      );
    });

    it("should not pass if negated but public signals are correct", async () => {
      await expect(expect(matrix).to.generateProof({ a, b, c }).and.not.have.publicSignals({ d })).to.be.rejectedWith(
        `Expected output signal "d" NOT to be "[[2,5,0],[17,26,0],[0,0,0]]", but it is"`,
      );
    });

    it("should not pass if not the same amount of public signals and strict", async () => {
      await expect(
        expect(matrix).to.generateProof({ a, b, c }).and.have.strict.publicSignals({ d }),
      ).to.be.rejectedWith("Expected 4 output signals, but got 1");
    });

    it("should not pass if pass public signal arr with invalid length", async () => {
      await expect(
        expect(matrix)
          .to.generateProof({ a, b, c })
          .and.have.publicSignals({ d: [["123"]] }),
      ).to.be.rejectedWith(`Expected output signal "d" to be "[[123]]", but got "[[2,5,0],[17,26,0],[0,0,0]]"`);
    });

    it("should not pass if not the same amount of public signals and strict and base CircuitZKit object", async () => {
      const wrongPublicSignals: string[] = ["2", "0x5", "0", "17", "26", "0"];

      await expect(
        expect(baseMatrix).to.generateProof({ a, b, c }).and.have.strict.publicSignals(wrongPublicSignals),
      ).to.be.rejectedWith(`Expected 28 output signals, but got ${wrongPublicSignals.length}`);
    });

    it("should not pass for base CircuitZKit object and expected public signals arr length bigger than actual", async () => {
      const wrongOutputs: string[] = getSignalsArr({ d, e, f, a, c });

      await expect(
        expect(baseMatrix).to.generateProof({ a, b, c }).and.have.publicSignals(wrongOutputs),
      ).to.be.rejectedWith(`Expected 28 output signals, but got ${wrongOutputs.length}`);
    });

    it("should pass if public signals are correct for given inputs", async () => {
      await expect(matrix).to.generateProof({ a, b, c }).and.have.strict.publicSignals({ a, d, e, f });
    });

    it("should pass if public signals are correct for given inputs and not all public signals passed", async () => {
      await expect(matrix).to.generateProof({ a, b, c }).and.have.publicSignals({ d });
    });

    it("should pass for base CircuitZKit object and strict", async () => {
      await expect(baseMatrix)
        .to.generateProof({ a, b, c })
        .and.have.strict.publicSignals(getSignalsArr({ d, e, f, a }));
    });

    it("should pass for base CircuitZKit object and not all public signals passed", async () => {
      await expect(baseMatrix).to.generateProof({ a, b, c }).and.have.publicSignals(getSignalsArr({ d, e }));
    });
  });

  describe("verifyProof", () => {
    it("should not pass if not called on zkit", async () => {
      /// @ts-ignore
      expect(() => expect(1).to.have.verifyProof({ a })).to.throw(
        "`verifyProof` is expected to be called on `CircuitZKit`",
      );
    });

    it("should not pass if pass invalid proof without negation", async () => {
      const proof = await matrix.generateProof({ a, b, c });

      proof.publicSignals.f = "30";

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

    it("should correctly verify proof without negation", async () => {
      const proof = await matrix.generateProof({ a, b, c });

      await expect(matrix).to.verifyProof(proof);
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
  });
});
