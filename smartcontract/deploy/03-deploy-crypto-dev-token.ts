import { DeployFunction, Deployment } from "hardhat-deploy/types";

import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "hardhat-deploy";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const cryptoDevsContact: Deployment = await deployments.get("CryptoDevs");

  const CRYPTO_DEVS_ADDRESS = cryptoDevsContact.address;

  const args = [CRYPTO_DEVS_ADDRESS];

  await deploy("CryptoDevToken", {
    from: deployer,
    args,
    log: true,
  });

  const deployedContract: Deployment = await deployments.get("CryptoDevToken");
  const parsedArgs = args.join(" ");

  if (network.name === "rinkeby") {
    if (process.env.ETHERSCAN_API_KEY) {
      log("----------------------------------------------");
      log("CONTRACT VERIFICATION");
      log(
        `npx hardhat verify --network ${network.name} ${deployedContract.address} ${parsedArgs}`
      );
      log("----------------------------------------------");
    }
  }
};

module.exports = func;
module.exports.tags = ["all", "main"];
