import { witness, proof, constraints } from "./core";

export function chaiZkit(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  witness(chai, utils);
  proof(chai, utils);
  constraints(chai, utils);
}
