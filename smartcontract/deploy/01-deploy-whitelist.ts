import { DeployFunction, Deployment } from "hardhat-deploy/types";

import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "hardhat-deploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [10];

  await deploy("Whitelist", {
    from: deployer,
    args,
    log: true,
  });

  if (network.name === "rinkeby") {
    const deployedContract: Deployment = await deployments.get("Whitelist");

    if (process.env.ETHERSCAN_API_KEY) {
      log("----------------------------------------------");
      log("CONTRACT VERIFICATION");
      log(
        `npx hardhat verify --network ${network.name} ${deployedContract.address} ${args[0]}`
      );
    }
  }
};

module.exports = func;
module.exports.tags = ["all", "main"];
