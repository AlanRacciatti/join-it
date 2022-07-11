import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractReceipt, ContractTransaction } from "ethers";
import { deployments, ethers } from "hardhat";
import { Whitelist, CryptoDevs } from "../typechain";
import { getParsedBalance } from "./utils/CryptoDevs";
import { CryptoDevsUtils } from "./utils/index";

describe("Crypto Devs", function () {
  let whitelistContract: Whitelist,
    cryptoDevsContract: CryptoDevs,
    deployer: SignerWithAddress,
    alice: SignerWithAddress;

  beforeEach(async () => {
    [deployer, alice] = await ethers.getSigners();

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
    it("Should be able to start presale", async () => {
      expect(await cryptoDevsContract.presaleStarted()).to.equal(false);

      await cryptoDevsContract.startPresale();

      expect(await cryptoDevsContract.presaleStarted()).to.equal(true);
    });

    it("Should only allow the owner to start presale", async () => {
      await expect(
        cryptoDevsContract.connect(alice).startPresale()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      expect(await cryptoDevsContract.presaleStarted()).to.equal(false);

      await cryptoDevsContract.startPresale();

      expect(await cryptoDevsContract.presaleStarted()).to.equal(true);
    });

    it("Should be able to presale mint an NFT", async () => {
      const expectedTokenId: string = "1";

      await whitelistContract.addAddressToWhitelist();
      await cryptoDevsContract.startPresale();

      const tx: ContractTransaction = await cryptoDevsContract.presaleMint({
        value: ethers.utils.parseEther("0.01"),
      });

      const txReceipt: ContractReceipt = await tx.wait();
      const tokenId: string = txReceipt.events![0].args![2];

      expect(expectedTokenId).to.equal(tokenId);
    });

    it("Should NOT allow presale minting if presale not started", async () => {
      await whitelistContract.addAddressToWhitelist();

      await expect(
        cryptoDevsContract.presaleMint({
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("PresaleNotRunning");
    });

    it("Should NOT allow presale minting if sender is not whitelisted", async () => {
      await cryptoDevsContract.startPresale();

      await expect(
        cryptoDevsContract.presaleMint({
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("NotWhitelisted");
    });

    it("Should NOT allow presale minting if presale finished", async () => {
      const presaleTime: number = 60 * 5; // 5 minutes

      await whitelistContract.addAddressToWhitelist();
      await cryptoDevsContract.startPresale();

      await ethers.provider.send("evm_increaseTime", [presaleTime]);

      await expect(
        cryptoDevsContract.presaleMint({
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("PresaleNotRunning");
    });

    it("Should NOT allow presale minting if all tokens were minted", async () => {
      const maxTokens: number = 20;

      await cryptoDevsContract.startPresale();
      await whitelistContract.addAddressToWhitelist();

      for (let i = 0; i < maxTokens; i++) {
        await cryptoDevsContract.presaleMint({
          value: ethers.utils.parseEther("0.01"),
        });
      }

      await expect(
        cryptoDevsContract.presaleMint({
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("MaxTokensReached");
    });

    it("Should NOT allow presale minting if msg.value < token price", async () => {
      await cryptoDevsContract.startPresale();
      await whitelistContract.addAddressToWhitelist();

      await expect(
        cryptoDevsContract.presaleMint({
          value: ethers.utils.parseEther("0.005"),
        })
      ).to.be.revertedWith("InsufficientFunds");
    });
  });

  describe("Minting", function () {
    it("Should be able to mint an NFT", async () => {
      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);

      await cryptoDevsContract.mint({
        value: ethers.utils.parseEther("0.01"),
      });
    });

    it("Should NOT allow minting if presale not started", async () => {
      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);

      const expectedTokenId: string = "1";

      const tx: ContractTransaction = await cryptoDevsContract.mint({
        value: ethers.utils.parseEther("0.01"),
      });

      const txReceipt: ContractReceipt = await tx.wait();
      const tokenId: string = txReceipt.events![0].args![2];

      expect(expectedTokenId).to.equal(tokenId);
    });

    it("Should NOT allow minting if presale is running", async () => {
      await cryptoDevsContract.startPresale();

      await expect(
        cryptoDevsContract.mint({
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("PresaleRunning");
    });

    it("Should NOT allow minting if all tokens were minted", async () => {
      const maxTokens: number = 20;

      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);

      for (let i = 0; i < maxTokens; i++) {
        await cryptoDevsContract.mint({
          value: ethers.utils.parseEther("0.01"),
        });
      }

      await expect(
        cryptoDevsContract.mint({
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("MaxTokensReached");
    });

    it("Should NOT allow minting if msg.value < token price", async () => {
      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);

      await expect(
        cryptoDevsContract.mint({
          value: ethers.utils.parseEther("0.005"),
        })
      ).to.be.revertedWith("InsufficientFunds");
    });
  });

  describe("Pausable", function () {
    it("Should be able to pause and unpause the contract", async () => {
      expect(await cryptoDevsContract._paused()).to.equal(false);

      await cryptoDevsContract.setPaused(true);
      expect(await cryptoDevsContract._paused()).to.equal(true);

      await cryptoDevsContract.setPaused(false);
      expect(await cryptoDevsContract._paused()).to.equal(false);
    });

    it("Should only allow the owner to pause/unpause the contract", async () => {
      expect(await cryptoDevsContract._paused()).to.equal(false);

      await expect(
        cryptoDevsContract.connect(alice).setPaused(true)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      expect(await cryptoDevsContract._paused()).to.equal(false);
    });

    it("Should NOT allow presale minting if contract is paused", async () => {
      await cryptoDevsContract.startPresale();
      await whitelistContract.addAddressToWhitelist();

      await cryptoDevsContract.setPaused(true);

      await expect(
        cryptoDevsContract.presaleMint({
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("ContractPaused");
    });

    it("Should NOT allow minting if contract is paused", async () => {
      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);

      await cryptoDevsContract.setPaused(true);

      await expect(
        cryptoDevsContract.mint({
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("ContractPaused");
    });
  });

  describe("Owner", function () {
    it("Should be able to withdraw contract funds", async () => {
      const tokenPrice: string = "0.01";
      const tokensToBuy: number = 10;
      const expectedBalance = "0.1";

      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);

      for (let i = 0; i < tokensToBuy; i++) {
        await cryptoDevsContract.mint({
          value: ethers.utils.parseEther(tokenPrice),
        });
      }

      await expect(await cryptoDevsContract.withdraw()).to.changeEtherBalance(
        deployer,
        ethers.utils.parseEther(expectedBalance)
      );
    });

    it("Should only allow owner to withdraw contract funds", async () => {
      const tokenPrice: string = "0.01";
      const tokensToBuy: number = 10;

      await CryptoDevsUtils.startAndEndPresale(cryptoDevsContract);

      for (let i = 0; i < tokensToBuy; i++) {
        await cryptoDevsContract.mint({
          value: ethers.utils.parseEther(tokenPrice),
        });
      }

      await expect(
        cryptoDevsContract.connect(alice).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
