import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { CryptoDevsDAO } from "../typechain";
import { deployments, ethers } from "hardhat";
import { getParsedBalance } from "./utils/CryptoDevs";

describe.only("Crypto Devs DAO", function () {
  let cryptoDevsDaoContract: CryptoDevsDAO,
    deployer: SignerWithAddress,
    alice: SignerWithAddress;

  beforeEach(async () => {
    [deployer, alice] = await ethers.getSigners();

    await deployments.fixture(["main"]);

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

    describe("Proposal creation", function () {
      it("Should be able to create a proposal");
      it("Should NOT allow non-nft-holders to create a proposal");
      it("Should revert if token to buy is not available");
    });

    describe("Proposal voting", function () {
      it("Should allow to vote a proposal by his index");
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
});
