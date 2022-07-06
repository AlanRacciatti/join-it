import { DeployFunction, Deployment } from "hardhat-deploy/types";

import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "hardhat-deploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const whitelistContract: Deployment = await deployments.get("Whitelist");

  const BASE_URI = "https://go-api-rock.herokuapp.com/api/v1";
  const CONTRACT_ADDRESS = whitelistContract.address;

  const args = [BASE_URI, CONTRACT_ADDRESS];

  await deploy("CryptoDevs", {
    from: deployer,
    args,
    log: true,
  });

  if (network.name === "rinkeby") {
    const deployedContract: Deployment = await deployments.get("CryptoDevs");

    if (process.env.ETHERSCAN_API_KEY) {
      log("----------------------------------------------");
      log("CONTRACT VERIFICATION");
      log(
        `npx hardhat verify --network ${network.name} ${deployedContract.address} ${args[0]} ${args[1]}`
      );
      log("----------------------------------------------");
    }
  }
};

module.exports = func;
module.exports.tags = ["all", "main"];
