import { expect } from "chai";
import path from "path";

import { useFixtureProject } from "./helpers";

import "../src";

import { Matrix } from "./fixture-projects/complex-circuits/generated-types/zkit";

describe("zkitChaiMatchers", () => {
  function getArtifactsFullPath(circuitDirSourceName: string): string {
    return path.join(process.cwd(), "zkit", "artifacts", "circuits", circuitDirSourceName);
  }

  function getVerifiersDirFullPath(): string {
    return path.join(process.cwd(), "contracts", "verifiers");
  }

  let matrix: Matrix;

  useFixtureProject("complex-circuits");

  beforeEach(() => {
    const circuitName = "Matrix";
    const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
    const verifierDirPath = getVerifiersDirFullPath();

    matrix = new Matrix({ circuitName, circuitArtifactsPath, verifierDirPath });
  });

  describe("witness", () => {
    let a: string[][];
    let b: string[][];
    let c: string;
    let d: string[][];
    let e: string[][];

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
    });

    describe("witnessInputs", () => {
      it("should not pass if not called on zkit", async () => {
        expect(() => expect(1).to.have.witnessInputs({ d, e })).to.throw(
          "`witnessInputs` is expected to be called on `CircuitZKit`",
        );
      });
    });

    describe("witnessOutputs", () => {
      it("should not pass if not called on zkit", async () => {
        expect(() => expect(1).to.have.witnessOutputs({ d, e })).to.throw(
          "`witnessOutputs` is expected to be called on `CircuitZKit`",
        );
      });

      it("should not pass if called not before witnessInputs", async () => {
        await expect(expect(matrix).to.have.witnessOutputs({ d, e })).to.be.rejectedWith(
          "`witnessOutputs` is expected to be called after `witnessInputs`",
        );
      });

      it("should not pass if outputs are incorrect for given inputs", async () => {
        e = d;

        await expect(
          expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ d, e }),
        ).to.be.rejectedWith(
          `Expected output "e" to be "[[2,5,0],[17,26,0],[0,0,0]]", but got "[[1,4,0],[16,25,0],[0,0,0]]"`,
        );
      });

      it("should not pass if not the same amount of outputs", async () => {
        await expect(
          expect(matrix)
            .with.witnessInputs({ a, b, c })
            .to.have.witnessOutputs({ d } as unknown as any),
        ).to.be.rejectedWith("Expected 1 outputs, but got 2");
      });

      it("should not pass if negated but outputs are correct", async () => {
        await expect(
          expect(matrix).with.witnessInputs({ a, b, c }).to.not.have.witnessOutputs({ d, e }),
        ).to.be.rejectedWith(`Expected output "d" NOT to be "[[2,5,0],[17,26,0],[0,0,0]]", but it is"`);
      });

      it("should pass if outputs are correct for given inputs", async () => {
        await expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ d, e });
      });
    });
  });
});
