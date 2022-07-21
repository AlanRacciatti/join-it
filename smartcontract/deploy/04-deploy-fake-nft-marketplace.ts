import { DeployFunction, Deployment } from "hardhat-deploy/types";

import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "hardhat-deploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("FakeNFTMarketplace", {
    from: deployer,
    log: true,
  });

  const deployedContract: Deployment = await deployments.get(
    "FakeNFTMarketplace"
  );

  if (network.name === "rinkeby") {
    if (process.env.ETHERSCAN_API_KEY) {
      log("----------------------------------------------");
      log("CONTRACT VERIFICATION");
      log(
        `npx hardhat verify --network ${network.name} ${deployedContract.address}`
      );
      log("----------------------------------------------");
    }
  }
};

module.exports = func;
module.exports.tags = ["all", "main"];
