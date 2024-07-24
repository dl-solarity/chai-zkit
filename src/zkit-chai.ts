import { witness } from "./witness";

export function zkitChai(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  witness(chai, utils);
}
