import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import { deployments, ethers } from "hardhat";
import { Whitelist, CryptoDevs, CryptoDevToken } from "../typechain";
import { getParsedBalance } from "./utils/CryptoDevs";
import { CryptoDevsUtils } from "./utils/index";

describe("Crypto Dev Token", function () {
  let whitelistContract: Whitelist,
    cryptoDevsContract: CryptoDevs,
    cryptoDevTokenContract: CryptoDevToken,
    deployer: SignerWithAddress,
    alice: SignerWithAddress,
    signers: SignerWithAddress[];

  beforeEach(async () => {
    [deployer, alice, ...signers] = await ethers.getSigners();

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

      await deployer.sendTransaction({
        to: cryptoDevTokenContract.address,
        value: ethers.utils.parseEther("1"),
      });

      expect(await getParsedBalance(cryptoDevTokenContract)).to.equal("1.0");
    });

    it("Should be able to receive ETH when contract receives a transaction with msg.data", async () => {
      expect(await getParsedBalance(cryptoDevTokenContract)).to.equal("0.0");

      await deployer.sendTransaction({
        to: cryptoDevTokenContract.address,
        value: ethers.utils.parseEther("1"),
        data: ethers.utils.solidityPack(["string"], ["This is a test :P"]),
      });

      expect(await getParsedBalance(cryptoDevTokenContract)).to.equal("1.0");
    });
  });

  describe("Minting", function () {
    it("Should be able to mint tokens", async () => {
      const tokenPrice: BigNumber = await cryptoDevTokenContract.tokenPrice();
      const tokensToMint: BigNumber = BigNumber.from(10);
      const tokensPrice: BigNumber = tokenPrice.mul(tokensToMint);

      await expect(() =>
        cryptoDevTokenContract.connect(alice).mint(tokensToMint, {
          value: tokensPrice,
        })
      ).to.changeTokenBalance(
        cryptoDevTokenContract,
        alice,
        ethers.utils.parseEther(tokensToMint.toString())
      );
    });

    it("Should revert if user did not send enough ETH", async () => {
      const tokensToMint: BigNumber = BigNumber.from(10);
      await expect(
        cryptoDevTokenContract.mint(tokensToMint)
      ).to.be.revertedWith("InsufficientFunds");
    });

    it("Should revert if mint exceed max total supply", async () => {
      const maxTotalSupply: number = 10000;
      const tokensToBuyForSigner: number = maxTotalSupply / 10; // Fake signers doesn't have enough ether to buy all tokens at once
      const tokenPriceInEth: number = 0.001;
      const ethToSend = ethers.utils.parseEther(
        (tokensToBuyForSigner * tokenPriceInEth).toString()
      );

      for (let i = 0; i < 10; i++) {
        await cryptoDevTokenContract
          .connect(signers[i])
          .mint(tokensToBuyForSigner, {
            value: ethToSend,
          });
      }

      await expect(
        cryptoDevTokenContract.connect(alice).mint(tokensToBuyForSigner, {
          value: ethToSend,
        })
      ).to.be.revertedWith("TotalSupplyExceeded");
    });
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
