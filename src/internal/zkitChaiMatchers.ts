import { supportProofs } from "./proofs";

export function zkitChaiMatchers(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  supportProofs(chai.Assertion, utils);
}
