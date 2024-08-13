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
      expect(matrix).constraints.above(6);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.above(10);
    });
  });

  describe("gt", () => {
    it("should pass with circuitZKit obj", async () => {
      expect(matrix).constraints.gt(6);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.gt(10);
    });
  });

  describe("greaterThan", () => {
    it("should pass with circuitZKit obj", async () => {
      expect(matrix).constraints.greaterThan(6);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.greaterThan(10);
    });
  });

  describe("below", () => {
    it("should pass with circuitZKit obj", async () => {
      expect(matrix).constraints.below(10);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.below(6);
    });
  });

  describe("lt", () => {
    it("should pass with circuitZKit obj", async () => {
      expect(matrix).constraints.lt(10);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.lt(6);
    });
  });

  describe("lessThan", () => {
    it("should pass with circuitZKit obj", async () => {
      expect(matrix).constraints.lessThan(10);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.lessThan(6);
    });
  });

  describe("most", () => {
    it("should pass with circuitZKit obj", async () => {
      expect(matrix).constraints.most(8);
      expect(matrix).constraints.lessThanOrEqual(10);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.most(7);
    });
  });

  describe("lte", () => {
    it("should pass with circuitZKit obj", async () => {
      expect(matrix).constraints.lte(8);
      expect(matrix).constraints.lessThanOrEqual(10);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.lte(7);
    });
  });

  describe("lessThanOrEqual", () => {
    it("should pass with circuitZKit obj", async () => {
      expect(matrix).constraints.lessThanOrEqual(8);
      expect(matrix).constraints.lessThanOrEqual(10);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.lessThanOrEqual(7);
    });
  });

  describe("within", () => {
    it("should pass with circuitZKit obj", async () => {
      expect(matrix).constraints.within(7, 10);
    });

    it("should pass with circuitZKit obj and negation", async () => {
      expect(matrix).constraints.not.within(10, 12);
      expect(matrix).constraints.not.within(5, 7);
    });
  });

  describe("getConstraintsNumber", () => {
    it("should get exception if pass invalid r1cs file path", async () => {
      const r1csFilePath: string = matrix.getArtifactsFilePath("r1cs");

      const r1csFileContent = fs.readFileSync(r1csFilePath);

      fs.rmSync(r1csFilePath);
      fs.writeFileSync(r1csFilePath, "");

      expect(function () {
        getConstraintsNumber(r1csFilePath);
      }).to.throw(`Header section in ${r1csFilePath} file is not found.`);

      fs.writeFileSync(r1csFilePath, r1csFileContent);
    });
  });
});
