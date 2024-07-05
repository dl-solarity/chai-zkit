import { CircuitZKit, Inputs, InputLike } from "@solarity/zkit";

export function supportProofs(Assertion: Chai.AssertionStatic, utils: Chai.ChaiUtils): void {
  Assertion.addMethod("inputs", function (inputs: Inputs) {
    new Assertion(this._obj).to.be.instanceof(CircuitZKit);

    utils.flag(this, "inputs", inputs);
  });

  Assertion.addMethod("outputs", async function (outputs: InputLike[]): Promise<void> {
    new Assertion(this._obj).to.be.instanceof(CircuitZKit);

    const zkit = this._obj as CircuitZKit;
    const inputs = utils.flag(this, "inputs") as Inputs;

    const proof = await zkit.generateProof(inputs);

    console.log(proof);
  });
}
