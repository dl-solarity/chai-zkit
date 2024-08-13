import { witness } from "./witness";
import { proof } from "./proof";
import { constraints } from "./constraints";

export function chaiZkit(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  witness(chai, utils);
  proof(chai, utils);
  constraints(chai, utils);
}
