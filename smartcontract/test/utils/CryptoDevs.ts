import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";

export const getParsedBalance = async (
  contract: Contract | SignerWithAddress
): Promise<string> => {
  const balance: BigNumber = await contract.provider!.getBalance(
    contract.address
  );
  const parsedBalance: string = ethers.utils.formatEther(balance);

  return parsedBalance;
};
