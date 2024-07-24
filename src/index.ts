import chai from "chai";

import chaiAsPromised from "chai-as-promised";

import "./types";
import { zkitChai } from "./zkit-chai";

chai.use(chaiAsPromised);
chai.use(zkitChai);
