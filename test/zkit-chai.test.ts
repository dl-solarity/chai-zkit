import { expect } from "chai";
import path from "path";
import { CircuitZKit } from "@solarity/zkit";

import { useFixtureProject } from "./helpers";

import "../src";
import { Signal } from "../src/types";

describe("zkitChaiMatchers", () => {
  function getArtifactsFullPath(circuitDirSourceName: string): string {
    return path.join(process.cwd(), "zkit", "artifacts", circuitDirSourceName);
  }

  function getVerifiersDirFullPath(): string {
    return path.join(process.cwd(), "contracts", "verifiers");
  }

  let matrix: CircuitZKit;

  useFixtureProject("simple-circuits");

  beforeEach(() => {
    const circuitName = "Matrix";
    const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
    const verifierDirPath = getVerifiersDirFullPath();

    matrix = new CircuitZKit({ circuitName, circuitArtifactsPath, verifierDirPath });
  });

  describe("witness", () => {
    let a: Signal;
    let b: Signal;
    let c: Signal;
    let d: Signal;
    let e: Signal;

    beforeEach(() => {
      a = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      b = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      c = 1;
      d = [
        [2, 5, 0],
        [17, 26, 0],
        [0, 0, 0],
      ];
      e = [
        [1, 4, 0],
        [16, 25, 0],
        [0, 0, 0],
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
        await expect(expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ d })).to.be.rejectedWith(
          "Expected 1 outputs, but got 2",
        );
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
