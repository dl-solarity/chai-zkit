import { expect } from "chai";
import path from "path";
import { CircuitZKit } from "@solarity/zkit";

import { useFixtureProject } from "./helpers";

import "../src";

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
    it.only("should pass if outputs are correct for given inputs", async () => {
      const a = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const b = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const c = 1;

      const d = [
        [2, 5, 0],
        [17, 26, 0],
        [0, 0, 0],
      ];
      const e = [
        [1, 4, 0],
        [16, 25, 0],
        [0, 0, 0],
      ];

      await expect(matrix).with.witnessInputs({ a, b, c }).to.have.witnessOutputs({ d, e });
    });
  });
});
