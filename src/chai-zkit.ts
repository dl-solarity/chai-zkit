import { witness } from "./witness";

export function chaiZkit(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  witness(chai, utils);
}
