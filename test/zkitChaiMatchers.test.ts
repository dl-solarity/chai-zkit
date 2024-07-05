import path from "path";
import { CircuitZKit } from "@solarity/zkit";

import { useFixtureProject } from "./helpers";
import { expect } from "chai";

import "../src";

describe("zkitChaiMatchers", () => {
  function getArtifactsFullPath(circuitDirSourceName: string): string {
    return path.join(process.cwd(), "zkit", "artifacts", circuitDirSourceName);
  }

  function getVerifiersDirFullPath(): string {
    return path.join(process.cwd(), "contracts", "verifiers");
  }

  let multiplier: CircuitZKit;

  useFixtureProject("simple-circuits");

  beforeEach(() => {
    const circuitName = "Multiplier";
    const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
    const verifierDirPath = getVerifiersDirFullPath();

    multiplier = new CircuitZKit({ circuitName, circuitArtifactsPath, verifierDirPath });
  });

  describe("inputs outputs", () => {
    it("should correctly return outputs for given inputs", async () => {
      const a = 10,
        b = 20;

      await expect(multiplier)
        .inputs({ a, b })
        .to.have.outputs([a * b]);
    });
  });
});
