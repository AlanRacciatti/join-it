import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { CryptoDevs, CryptoDevsDAO } from "../typechain";
import { deployments, ethers } from "hardhat";
import { getParsedBalance } from "./utils/CryptoDevs";
import { CryptoDevsDaoUtils, CryptoDevsUtils } from "./utils";
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";

describe("Crypto Devs DAO", function () {
  let cryptoDevsContract: CryptoDevs,
    cryptoDevsDaoContract: CryptoDevsDAO,
    deployer: SignerWithAddress,
    alice: SignerWithAddress;

  enum Votes {
    yay = 0,
    nay = 1,
  }

  beforeEach(async () => {
    [deployer, alice] = await ethers.getSigners();

    await deployments.fixture(["main"]);

    cryptoDevsContract = await ethers.getContract("CryptoDevs");
    cryptoDevsDaoContract = await ethers.getContract("CryptoDevsDAO");
  });

  describe("Special functions", function () {
    it("Should be able to receive ETH when contract receives a transaction", async () => {
      expect(await getParsedBalance(cryptoDevsDaoContract)).to.equal("0.0");

      // Receive function running here
      await deployer.sendTransaction({
        to: cryptoDevsDaoContract.address,
        value: ethers.utils.parseEther("1"),
      });

      expect(await getParsedBalance(cryptoDevsDaoContract)).to.equal("1.0");
    });

    it("Should be able to receive ETH when contract receives a transaction with msg.data", async () => {
      expect(await getParsedBalance(cryptoDevsDaoContract)).to.equal("0.0");

      // Fallback function running here
      await deployer.sendTransaction({
        to: cryptoDevsDaoContract.address,
        value: ethers.utils.parseEther("1"),
        data: ethers.utils.solidityPack(["string"], ["This is a test :P"]),
      });

      expect(await getParsedBalance(cryptoDevsDaoContract)).to.equal("1.0");
    });
  });

  describe("Proposal creation", function () {
    it("Should be able to create a proposal", async () => {
      const tokenId: number = 3;
      const proposalTokenIdIndex: number = 0;
      const proposalIndex: number = 0;

      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);
      await CryptoDevsUtils.mintNft(cryptoDevsContract, alice);

      await cryptoDevsDaoContract.connect(alice).createProposal(tokenId);

      const proposal = await cryptoDevsDaoContract.proposals(proposalIndex);
      expect(proposal[proposalTokenIdIndex]).to.equal(tokenId);
    });

    it("Should NOT allow non-nft-holders to create a proposal", async () => {
      const tokenId: number = 3;

      await expect(
        cryptoDevsDaoContract.connect(alice).createProposal(tokenId)
      ).to.be.revertedWith("NotDaoMember");
    });

    it("Should revert if token to buy is not available", async () => {
      const tokenId: number = 3;

      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);
      await CryptoDevsUtils.mintNft(cryptoDevsContract, alice);

      await CryptoDevsDaoUtils.createAndExecuteProposal(
        cryptoDevsContract,
        cryptoDevsDaoContract,
        alice,
        tokenId
      );
    });
  });

  describe("Proposal voting", function () {
    it("Should allow to vote a proposal by his index", async () => {
      const tokenId: number = 3;
      const proposalIndex: number = 0;
      const yayVotesIndex: number = 2;

      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);
      await CryptoDevsUtils.mintNft(cryptoDevsContract, alice);

      await cryptoDevsDaoContract.connect(alice).createProposal(tokenId);
      await cryptoDevsDaoContract
        .connect(alice)
        .voteOnProposal(proposalIndex, Votes.yay);

      const proposal = await cryptoDevsDaoContract.proposals(proposalIndex);
      expect(proposal[yayVotesIndex]).to.equal(1);
    });
    it("Should NOT allow non-nft-holders to vote for a proposal");
    it("Should NOT allow to vote for a proposal that is not active");
    it("Should sum one vote by each nft");
    it("Should revert if user already voted with all his nft");
    it("Should allow to vote again if user has a new nft");
  });

  describe("Proposal execution", function () {
    it(
      "Should allow to finish the proposal and purchase the nft if dao agreed"
    );
    it("Should NOT allow non-nft-holders to execute a proposal");
    it("Should NOT allow to execute a proposal that is active");
    it("Should revert execution if contract can't afford the NFT");
  });

  describe("Withdraw", function () {
    it("Should only allow owner to withdraw contract ETH");
  });
});
