import { witness } from "./witness";
import { proof } from "./proof";

export function chaiZkit(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  witness(chai, utils);
  proof(chai, utils);
}
