import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { CryptoDevs, Whitelist } from "../../typechain";

export const getParsedBalance = async (
  contract: Contract | SignerWithAddress
): Promise<string> => {
  const balance: BigNumber = await contract.provider!.getBalance(
    contract.address
  );
  const parsedBalance: string = ethers.utils.formatEther(balance);

  return parsedBalance;
};

export const startAndEndPresale = async (cryptoDevsContract: CryptoDevs) => {
  const presaleTime: number = 60 * 5;

  await cryptoDevsContract.startPresale();
  await ethers.provider.send("evm_increaseTime", [presaleTime]);
};

export const mintNft = async (
  cryptoDevsContract: CryptoDevs,
  signer: SignerWithAddress
) => {
  await cryptoDevsContract.connect(signer).mint({
    value: ethers.utils.parseEther("0.01"),
  });
};
