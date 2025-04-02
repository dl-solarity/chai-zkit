import { Signals } from "@solarity/zkit";

import { GENERATE_PROOF_METHOD, USE_SOLIDITY_VERIFIER_METHOD, VERIFY_PROOF_METHOD } from "../constants";
import { checkCircuitZKit } from "../utils";

export function proof(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  chai.Assertion.addMethod(GENERATE_PROOF_METHOD, function (this: any, inputs: Signals) {
    const obj = utils.flag(this, "object");

    checkCircuitZKit(obj, GENERATE_PROOF_METHOD);

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      let isGenerated = true;

      try {
        const proof = await obj.generateProof(inputs);

        utils.flag(this, "generatedProof", proof);
      } catch (e) {
        isGenerated = false;
      }

      this.assert(
        isGenerated,
        "Expected proof generation to be successful, but it isn't",
        "Expected proof generation NOT to be successful, but it is",
      );
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });

  chai.Assertion.addMethod(USE_SOLIDITY_VERIFIER_METHOD, function (this: any, verifierContract: any) {
    const obj = utils.flag(this, "object");

    checkCircuitZKit(obj, USE_SOLIDITY_VERIFIER_METHOD);

    utils.flag(this, "solidityVerifier", verifierContract);

    return this;
  });

  chai.Assertion.addMethod(VERIFY_PROOF_METHOD, function (this: any, proof: any) {
    const obj = utils.flag(this, "object");

    checkCircuitZKit(obj, VERIFY_PROOF_METHOD);

    const promise = (this.then === undefined ? Promise.resolve() : this).then(async () => {
      let verificationResult: boolean;
      const solidityVerifier = utils.flag(this, "solidityVerifier");

      if (solidityVerifier) {
        const calldata = await obj.generateCalldata(proof);

        const proofPointsValuesArr = Object.values(calldata.proofPoints);

        verificationResult = await solidityVerifier.verifyProof(...proofPointsValuesArr, calldata.publicSignals);
      } else {
        verificationResult = await obj.verifyProof(proof);
      }

      this.assert(
        verificationResult,
        "Expected proof verification result to be true, but it isn't",
        "Expected proof verification result NOT to be true, but it is",
      );
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);

    return this;
  });
}
