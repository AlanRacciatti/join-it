import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Whitelist, CryptoDevs } from "../typechain";

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
    it("Should have a token price of 0.01 ETH");
    it("Should have a max token amount of 20");
  });

  describe("Special functions", function () {
    it("Should be able to receive ETH when contract receives a transaction");
    it(
      "Should be able to receive ETH when contract receives a transaction with msg.data"
    );
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
