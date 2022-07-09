import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { deployments, ethers } from "hardhat";
import { Whitelist, CryptoDevs } from "../typechain";
import { getParsedBalance } from "./utils/CryptoDevs";
import { CryptoDevsUtils } from "./utils/index";

describe("Whitelist", function () {
  let whitelistContract: Whitelist,
    cryptoDevsContract: CryptoDevs,
    deployer: SignerWithAddress,
    signers: SignerWithAddress[];

  beforeEach(async () => {
    [deployer, ...signers] = await ethers.getSigners();

    await deployments.fixture(["main"]);

    whitelistContract = await ethers.getContract("Whitelist");
    cryptoDevsContract = await ethers.getContract("CryptoDevs");
  });

  describe("State variables", function () {
    it("Should have a token price of 0.01 ETH", async () => {
      expect(
        ethers.utils.formatEther(await cryptoDevsContract.tokenPrice())
      ).to.equal("0.01");
    });
    it("Should have a max token amount of 20", async () => {
      expect((await cryptoDevsContract.maxTokens()).toString()).to.equal("20");
    });
  });

  describe("Special functions", function () {
    it("Should be able to receive ETH when contract receives a transaction", async () => {
      expect(await getParsedBalance(cryptoDevsContract)).to.equal("0.0");

      // Receive function running here
      await deployer.sendTransaction({
        to: cryptoDevsContract.address,
        value: ethers.utils.parseEther("1"),
      });

      expect(await getParsedBalance(cryptoDevsContract)).to.equal("1.0");
    });

    it("Should be able to receive ETH when contract receives a transaction with msg.data", async () => {
      expect(await getParsedBalance(cryptoDevsContract)).to.equal("0.0");

      // Fallback function running here
      await deployer.sendTransaction({
        to: cryptoDevsContract.address,
        value: ethers.utils.parseEther("1"),
        data: ethers.utils.solidityPack(["string"], ["This is a test :P"]),
      });

      expect(await getParsedBalance(cryptoDevsContract)).to.equal("1.0");
    });
  });

  describe("Presale minting", function () {
    it("Should be able to start presale");
    it("Should only allow the owner to start presale");
    it("Should be able to presale mint an NFT");
    it("Should NOT allow presale minting if presale not started");
    it("Should NOT allow presale minting if sender is not whitelisted");
    it("Should NOT allow presale minting if presale finished");
    it("Should NOT allow presale minting if all tokens were minted");
    it("Should NOT allow presale minting if msg.value < token price");
  });

  describe("Minting", function () {
    it("Should be able to mint an NFT");
    it("Should NOT allow minting if presale not started");
    it("Should NOT allow minting if presale is running");
    it("Should NOT allow minting if all tokens were minted");
    it("Should NOT allow minting if msg.value < token price");
  });

  describe("Pausable", function () {
    it("Should be able to pause the contract");
    it("Should be able to unpause the contract");
    it("Should only allow the owner to pause/unpause the contract");
    it("Should NOT allow presale minting if contract is paused");
    it("Should NOT allow minting if contract is paused");
  });

  describe("Owner", function () {
    it("Should be able to withdraw contract funds");
    it("Should only allow owner to withdraw contract funds");
  });
});
