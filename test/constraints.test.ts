import fs from "fs";
import path from "path";
import { expect } from "chai";

import { useFixtureProject } from "./helpers";

import "../src";

import { Matrix } from "./fixture-projects/complex-circuits/generated-types/zkit";
import { getConstraintsNumber } from "../src/utils";

describe("constraints", () => {
  let matrix: Matrix;

  function getArtifactsFullPath(circuitDirSourceName: string): string {
    return path.join(process.cwd(), "zkit", "artifacts", "circuits", circuitDirSourceName);
  }

  function getVerifiersDirFullPath(): string {
    return path.join(process.cwd(), "contracts", "verifiers");
  }

  useFixtureProject("complex-circuits");

  beforeEach(() => {
    const circuitName = "Matrix";
    const circuitArtifactsPath = getArtifactsFullPath(`${circuitName}.circom`);
    const verifierDirPath = getVerifiersDirFullPath();

    matrix = new Matrix({ circuitName, circuitArtifactsPath, verifierDirPath });
  });

  describe("above", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.above(6);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.above(36);
    });
  });

  describe("gt", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.gt(6);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.gt(36);
    });
  });

  describe("greaterThan", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.greaterThan(6);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.greaterThan(36);
    });
  });

  describe("below", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.below(37);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.below(6);
    });
  });

  describe("lt", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.lt(37);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.lt(6);
    });
  });

  describe("lessThan", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.lessThan(37);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.lessThan(6);
    });
  });

  describe("most", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.most(36);
      await expect(matrix).constraints.lessThanOrEqual(36);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.most(7);
    });
  });

  describe("lte", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.lte(36);
      await expect(matrix).constraints.lessThanOrEqual(36);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.lte(35);
    });
  });

  describe("lessThanOrEqual", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.lessThanOrEqual(36);
      await expect(matrix).constraints.lessThanOrEqual(38);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.lessThanOrEqual(7);
    });
  });

  describe("within", () => {
    it("should pass with circuitZKit obj", async () => {
      await expect(matrix).constraints.within(30, 37);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      await expect(matrix).constraints.not.within(10, 12);
      await expect(matrix).constraints.not.within(37, 40);
    });
  });

  describe("getConstraintsNumber", () => {
    it("should get exception if pass invalid r1cs file path", async () => {
      const r1csFilePath: string = matrix.getArtifactsFilePath("r1cs");

      const r1csFileContent = fs.readFileSync(r1csFilePath);

      fs.rmSync(r1csFilePath);
      fs.writeFileSync(r1csFilePath, "");

      await expect(getConstraintsNumber(r1csFilePath, "groth16")).to.be.rejectedWith(`Invalid File format`);

      fs.writeFileSync(r1csFilePath, r1csFileContent);
    });
  });
});
