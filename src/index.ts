import chai from "chai";

import "./types";

import chaiAsPromised from "chai-as-promised";
import { zkitChaiMatchers } from "./internal/zkitChaiMatchers";

chai.use(chaiAsPromised);
chai.use(zkitChaiMatchers);
