import path from "path";

import { resetHardhatContext } from "hardhat/plugins-testing";

export function useFixtureProject(fixtureProjectName: string, networkName = "hardhat") {
  beforeEach("Loading hardhat environment", async function () {
    process.chdir(path.join(__dirname, "fixture-projects", fixtureProjectName));
    process.env.HARDHAT_NETWORK = networkName;

    this.hre = require("hardhat");

    await this.hre.run("compile", { quiet: true });
    await this.hre.run("zkit:compile", { quiet: true });
    await this.hre.run("zkit:verifiers", { quiet: true });
  });

  afterEach("Resetting hardhat", function () {
    resetHardhatContext();
  });
}
