import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractReceipt, ContractTransaction } from "ethers";
import { deployments, ethers } from "hardhat";
import { Whitelist, CryptoDevs, CryptoDevToken } from "../typechain";
import { getParsedBalance } from "./utils/CryptoDevs";
import { CryptoDevsUtils } from "./utils/index";

describe("Crypto Dev Token", function () {
  let whitelistContract: Whitelist,
    cryptoDevsContract: CryptoDevs,
    cryptoDevTokenContract: CryptoDevToken,
    deployer: SignerWithAddress,
    alice: SignerWithAddress;

  beforeEach(async () => {
    [deployer, alice] = await ethers.getSigners();

    await deployments.fixture(["main"]);

    whitelistContract = await ethers.getContract("Whitelist");
    cryptoDevsContract = await ethers.getContract("CryptoDevs");
    cryptoDevTokenContract = await ethers.getContract("CryptoDevToken");
  });

  describe("State variables", function () {
    it("Should have a token price of 0.001 ETH", async () => {
      expect(
        ethers.utils.formatEther(await cryptoDevTokenContract.tokenPrice())
      ).to.equal("0.001");
    });
    it("Should have 10 tokens to be sent by NFT", async () => {
      expect(
        ethers.utils.formatEther(await cryptoDevTokenContract.tokensPerNFT())
      ).to.equal("10.0");
    });
    it("Should have a max total supply of 10000 tokens", async () => {
      expect(
        ethers.utils.formatEther(await cryptoDevTokenContract.maxTotalSupply())
      ).to.equal("10000.0");
    });
  });

  describe("Special functions", function () {
    it("Should be able to receive ETH when contract receives a transaction", async () => {
      expect(await getParsedBalance(cryptoDevTokenContract)).to.equal("0.0");

      // Receive function running here
      await deployer.sendTransaction({
        to: cryptoDevTokenContract.address,
        value: ethers.utils.parseEther("1"),
      });

      expect(await getParsedBalance(cryptoDevTokenContract)).to.equal("1.0");
    });

    it("Should be able to receive ETH when contract receives a transaction with msg.data", async () => {
      expect(await getParsedBalance(cryptoDevTokenContract)).to.equal("0.0");

      // Fallback function running here
      await deployer.sendTransaction({
        to: cryptoDevTokenContract.address,
        value: ethers.utils.parseEther("1"),
        data: ethers.utils.solidityPack(["string"], ["This is a test :P"]),
      });

      expect(await getParsedBalance(cryptoDevTokenContract)).to.equal("1.0");
    });
  });

  describe("Minting", function () {
    it("Should be able to mint tokens", async () => {});
    it("Should revert if it was not send enough ETH");
    it("Should revert if mint exceed total supply");
  });

  describe("Claiming", function () {
    it("Should allow NFT holders to claim free tokens");
    it("Should revert if user does not owns at least 1 NFT");
    it("Should revert if user has claimed all tokens");
  });

  describe("Withdraw", function () {
    it("Should allow contract withdraw");
    it("Should revert if withdrawer is not the contract owner");
  });
});
