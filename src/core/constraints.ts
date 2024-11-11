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
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const newAssertation = new chai.Assertion(
            await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
          );

          utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

          newAssertation.to.above(num);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("gt", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const newAssertation = new chai.Assertion(
            await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
          );

          utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

          newAssertation.to.gt(num);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("greaterThan", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const newAssertation = new chai.Assertion(
            await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
          );

          utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

          newAssertation.to.greaterThan(num);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("below", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const newAssertation = new chai.Assertion(
            await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
          );

          utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

          newAssertation.to.below(num);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("lt", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const newAssertation = new chai.Assertion(
            await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
          );

          utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

          newAssertation.to.lt(num);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("lessThan", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const newAssertation = new chai.Assertion(
            await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
          );

          utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

          newAssertation.to.lessThan(num);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("most", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const newAssertation = new chai.Assertion(
            await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
          );

          utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

          newAssertation.to.most(num);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("lte", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const newAssertation = new chai.Assertion(
            await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
          );

          utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

          newAssertation.to.lte(num);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("lessThanOrEqual", function (_super) {
    return function (this: any, num: number | Date) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const newAssertation = new chai.Assertion(
            await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
          );

          utils.flag(newAssertation, "negate", utils.flag(this, "negate"));

          newAssertation.to.lessThanOrEqual(num);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });

  chai.Assertion.overwriteMethod("within", function (_super) {
    return function (this: any, start: number, finish: number) {
      const obj = utils.flag(this, "object");

      if (isCircuitZKit(obj) && utils.flag(this, "constraints")) {
        const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
          const constraintsNumber = await getConstraintsNumber(
            obj.mustGetArtifactsFilePath("r1cs"),
            obj.getProvingSystemType(),
          );

          const newAssertion = new chai.Assertion(constraintsNumber);
          utils.flag(newAssertion, "negate", utils.flag(this, "negate"));

          newAssertion.to.within(start, finish);
        });

        this.then = promise.then.bind(promise);
        this.catch = promise.catch.bind(promise);

        return this;
      } else {
        _super.apply(this, arguments);
      }
    };
  });
}
