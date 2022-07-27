import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { CryptoDevsUtils } from ".";
import { CryptoDevs, CryptoDevsDAO } from "../../typechain";

export const createAndExecuteProposal = async (
  daoContract: CryptoDevsDAO,
  signer: SignerWithAddress,
  tokenId: number
): Promise<void> => {
  const yayVote = 0;
  const fiveMinutes = 1000 * 60 * 5;

  await daoContract.connect(signer).createProposal(tokenId);
  await daoContract
    .connect(signer)
    .voteOnProposal(
      (await daoContract.numProposals()).sub(BigNumber.from(1)),
      yayVote
    );

  await network.provider.send("evm_increaseTime", [fiveMinutes]);

  await signer.sendTransaction({
    to: daoContract.address,
    value: ethers.utils.parseEther("0.1"),
  });

  await daoContract
    .connect(signer)
    .executeProposal((await daoContract.numProposals()).sub(BigNumber.from(1)));
};
