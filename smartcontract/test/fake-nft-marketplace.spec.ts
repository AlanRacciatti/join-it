import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractReceipt, ContractTransaction } from "ethers";
import { FakeNFTMarketplace } from "../typechain";
import { deployments, ethers } from "hardhat";
import { getParsedBalance } from "./utils/CryptoDevs";
import { CryptoDevsUtils } from "./utils/index";

describe("Fake NFT Marketplace", function () {
  let fakeNftMarketplace: FakeNFTMarketplace,
    deployer: SignerWithAddress,
    alice: SignerWithAddress;

  beforeEach(async () => {
    [deployer, alice] = await ethers.getSigners();

    await deployments.fixture(["main"]);

    fakeNftMarketplace = await ethers.getContract("FakeNFTMarketplace");
  });

  it("Should have a NFT price of 0.01 ETH", async () => {
    expect(
      ethers.utils.formatEther(await fakeNftMarketplace.getPrice())
    ).to.equal("0.1");
  });

  it("Should be able to purchase NFT's", async () => {
    const tokenId: number = 1;

    await fakeNftMarketplace.purchase(tokenId, {
      value: ethers.utils.parseEther("0.1"),
    });

    expect(await fakeNftMarketplace.tokens(tokenId)).to.equal(deployer.address);
  });

  it("Should revert when purchasing a NFT if user didn't send enough ETH", async () => {
    const tokenId: number = 1;

    await expect(fakeNftMarketplace.purchase(tokenId)).to.be.revertedWith(
      "This NFT costs 0.1 ether"
    );
  });

  it("Should return true if NFT is available and false if it is not", async () => {
    const tokenId: number = 1;
    const randomId: number = 3;

    await fakeNftMarketplace.purchase(tokenId, {
      value: ethers.utils.parseEther("0.1"),
    });

    expect(await fakeNftMarketplace.available(tokenId)).to.equal(false);
    expect(await fakeNftMarketplace.available(randomId)).to.equal(true);
  });
});
