import { expect } from "chai";

import * as fs from "fs";
import path from "path";

import { NumberLike, CircuitZKit } from "@solarity/zkit";

import { useFixtureProject } from "./helpers";

import "../src";

import { Matrix, NoInputs } from "./fixture-projects/complex-circuits/generated-types/zkit";

describe("chai-zkit", () => {
  function getArtifactsFullPath(circuitDirSourceName: string): string {
    return path.join(process.cwd(), "zkit", "artifacts", "circuits", circuitDirSourceName);
  }

  function getVerifiersDirFullPath(): string {
    return path.join(process.cwd(), "contracts", "verifiers");
  }

  let baseMatrix: CircuitZKit;
  let matrix: Matrix;

  useFixtureProject("complex-circuits");

  beforeEach(() => {
    const circuitName = "Matrix";
    const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
    const verifierDirPath = getVerifiersDirFullPath();

    baseMatrix = new CircuitZKit({ circuitName, circuitArtifactsPath, verifierDirPath });
    matrix = new Matrix({ circuitName, circuitArtifactsPath, verifierDirPath });
  });

  describe("witness", () => {
    let a: NumberLike[][];
    let b: NumberLike[][];
    let c: NumberLike;
    let d: string[][];
    let e: string[][];
    let f: string;

    beforeEach(() => {
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

    describe("witnessInputs", () => {
      it("should not pass if not called on zkit", async () => {
        /// @ts-ignore
        expect(() => expect(1).to.have.witnessInputs({ d, e })).to.throw(
          "`witnessInputs` is expected to be called on `CircuitZKit`",
        );
      });

      it("should pass if multiple witnessInputs", async () => {
        await expect(matrix)
          .with.witnessInputs({ a, b, c: "1337" })
          .with.witnessInputs({ a, b, c })
          .to.have.witnessOutputs({
            d,
            e: [
              ["1", "4", "0"],
              ["16", "25", "0"],
              ["0", "0", "0"],
            ],
            f: "0x1",
          });
      });
    });

    describe("witnessOutputsStrict", () => {
      it("should not pass if not called on zkit", async () => {
        /// @ts-ignore
        expect(() => expect(1).to.have.witnessOutputsStrict({ d, e })).to.throw(
          "`witnessOutputsStrict` is expected to be called on `CircuitZKit`",
        );
      });

      it("should not pass if called not before witnessInputs", async () => {
        await expect(expect(matrix).to.have.witnessOutputsStrict({ d, e, f })).to.be.rejectedWith(
          "`witnessOutputsStrict` is expected to be called after `witnessInputs`",
        );
      });

      it("should not pass if no inputs", async () => {
        const circuitName = "NoInputs";
        const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
        const verifierDirPath = getVerifiersDirFullPath();

        const noInputs = new NoInputs({ circuitName, circuitArtifactsPath, verifierDirPath });

        await expect(
          expect(noInputs)
            .with.witnessInputs({} as any)
            .to.have.witnessOutputsStrict({ c: "1337" }),
        ).to.be.rejectedWith("Circuit must have at least one input to extract outputs");
      });

      it("should not pass if outputs are incorrect for given inputs", async () => {
        e = d;

        await expect(
          expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputsStrict({ d, e, f }),
        ).to.be.rejectedWith(
          `Expected output "e" to be "[[2,5,0],[17,26,0],[0,0,0]]", but got "[[1,4,0],[16,25,0],[0,0,0]]"`,
        );
      });

      it("should not pass if not the same amount of outputs", async () => {
        await expect(
          expect(matrix)
            .with.witnessInputs({ a, b, c })
            .to.have.witnessOutputsStrict({ d } as unknown as any),
        ).to.be.rejectedWith("Expected 1 outputs, but got 3");
      });

      it("should not pass if negated but outputs are correct", async () => {
        await expect(
          expect(matrix).with.witnessInputs({ a, b, c }).to.not.have.witnessOutputsStrict({ d, e, f }),
        ).to.be.rejectedWith(`Expected output "d" NOT to be "[[2,5,0],[17,26,0],[0,0,0]]", but it is"`);
      });

      it("should pass if outputs are correct for given inputs", async () => {
        await expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputsStrict({ d, e, f });
      });

      it("should pass for base CircuitZKit object", async () => {
        await expect(baseMatrix)
          .with.witnessInputs({ a, b, c })
          .to.have.witnessOutputsStrict([
            "2",
            "0x5",
            "0",
            "17",
            "26",
            "0",
            "0",
            "0",
            "0",
            "1",
            "4",
            "0",
            "16",
            "25",
            "0",
            "0",
            "0",
            "0",
            "1",
          ]);
      });
    });

    describe("witnessOutputs", () => {
      it("should not pass if not called on zkit", async () => {
        /// @ts-ignore
        expect(() => expect(1).to.have.witnessOutputs({ d, e })).to.throw(
          "`witnessOutputs` is expected to be called on `CircuitZKit`",
        );
      });

      it("should not pass if called not before witnessInputs", async () => {
        await expect(expect(matrix).to.have.witnessOutputs({ d, e })).to.be.rejectedWith(
          "`witnessOutputs` is expected to be called after `witnessInputs`",
        );
      });

      it("should not pass if no inputs", async () => {
        const circuitName = "NoInputs";
        const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
        const verifierDirPath = getVerifiersDirFullPath();

        const noInputs = new NoInputs({ circuitName, circuitArtifactsPath, verifierDirPath });

        await expect(
          expect(noInputs)
            .with.witnessInputs({} as any)
            .to.have.witnessOutputs({ c: "1337" }),
        ).to.be.rejectedWith("Circuit must have at least one input to extract outputs");
      });

      it("should not pass if outputs are incorrect for given inputs", async () => {
        e = d;

        await expect(expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ e })).to.be.rejectedWith(
          `Expected output "e" to be "[[2,5,0],[17,26,0],[0,0,0]]", but got "[[1,4,0],[16,25,0],[0,0,0]]"`,
        );
      });

      it("should not pass if negated but outputs are correct", async () => {
        await expect(
          expect(matrix).with.witnessInputs({ a, b, c }).to.not.have.witnessOutputs({ d }),
        ).to.be.rejectedWith(`Expected output "d" NOT to be "[[2,5,0],[17,26,0],[0,0,0]]", but it is"`);
      });

      it("should not pass if sym file is missing input signals", async () => {
        const circuitArtifactsPath = getArtifactsFullPath(`${matrix.getCircuitName()}.circom`);
        const symFile = path.join(circuitArtifactsPath, `${matrix.getCircuitName()}.sym`);

        fs.rmSync(symFile);
        fs.writeFileSync(symFile, "");

        await expect(
          expect(matrix).with.witnessInputs({ a, b, c }).to.not.have.witnessOutputs({ d }),
        ).to.be.rejectedWith("Sym file is missing input signals");
      });

      it("should pass if outputs are correct for given inputs", async () => {
        await expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ d, e });
      });

      it("should pass if outputs are correct for given inputs and not all outputs passed", async () => {
        await expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ d });
      });

      it("should pass for base CircuitZKit object", async () => {
        await expect(baseMatrix)
          .with.witnessInputs({ a, b, c })
          .to.have.witnessOutputs([
            "2",
            "0x5",
            "0",
            "17",
            "26",
            "0",
            "0",
            "0",
            "0",
            "1",
            "4",
            "0",
            "16",
            "25",
            "0",
            "0",
            "0",
            "0",
            "1",
          ]);
      });
    });
  });
});
