import { HardhatUserConfig } from "hardhat/config";

import config from "../hardhat.config";

const defaultConfig: HardhatUserConfig = {
  ...config,
  zkit: {
    setupSettings: {
      contributionSettings: {
        provingSystem: ["plonk"],
        contributions: 2,
      },
    },
  },
};

export default defaultConfig;
