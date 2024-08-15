import { getConstraintsNumber, isCircuitZKit } from "../utils";

export function constraints(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  chai.Assertion.addProperty("constraints", function (this: any) {
    utils.flag(this, "constraints", true);

    return this;
  });

  chai.Assertion.overwriteMethod("above", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.above(num);
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("gt", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.gt(num);
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("greaterThan", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.greaterThan(num);
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("below", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.below(num);
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("lt", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.lt(num);
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("lessThan", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.lessThan(num);
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("most", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.most(num);
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("lte", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.lte(num);
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("lessThanOrEqual", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.lessThanOrEqual(num);
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("within", function (_super) {
    return function (this: any, start: number, finish: number) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const newAssertation = new chai.Assertion(getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs")));

        utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

        newAssertation.to.within(start, finish);
      } else {
        _super.apply(this, arguments);
      }
    };
  });
}
