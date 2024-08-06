import chai from "chai";

import chaiAsPromised from "chai-as-promised";

import "./types";
import { chaiZkit } from "./chai-zkit";

chai.use(chaiAsPromised);
chai.use(chaiZkit);
