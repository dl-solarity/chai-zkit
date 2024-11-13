import { getConstraintsNumber, isCircuitZKit } from "../utils";

export function constraints(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  chai.Assertion.addProperty("constraints", function (this: any) {
    utils.flag(this, "constraints", true);

    return this;
  });

  const methods = ["above", "gt", "greaterThan", "below", "lt", "lessThan", "most", "lte", "lessThanOrEqual", "within"];

  methods.forEach((method) => {
    chai.Assertion.overwriteMethod(method, function (_super) {
      return function (this: any, ...args: [number | Date, number?]) {
        return handleAssertion(chai, utils, this, _super, method, ...args);
      };
    });
  });
}

function handleAssertion(
  chai: Chai.ChaiStatic,
  utils: Chai.ChaiUtils,
  context: any,
  _super: any,
  method: string,
  ...args: [number | Date, number?]
) {
  const obj = utils.flag(context, "object");

  if (isCircuitZKit(obj) && utils.flag(context, "constraints")) {
    const promise = (context.then === undefined ? Promise.resolve() : context).then(async () => {
      const newAssertion = new chai.Assertion(
        await getConstraintsNumber(obj.mustGetArtifactsFilePath("r1cs"), obj.getProvingSystemType()),
      );

      utils.flag(newAssertion, "negate", utils.flag(context, "negate"));

      (newAssertion.to as any)[method](...args);
    });

    context.then = promise.then.bind(promise);
    context.catch = promise.catch.bind(promise);

    return context;
  }

  return _super.apply(context, args);
}
