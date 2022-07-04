import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Whitelist } from "../typechain";

describe("Whitelist", function () {
  let whitelistContract: Whitelist,
    deployer: SignerWithAddress,
    signers: SignerWithAddress[];

  beforeEach(async () => {
    [deployer, ...signers] = await ethers.getSigners();

    await deployments.fixture(["main"]);

    whitelistContract = await ethers.getContract("Whitelist");
  });

  it("Should successfully whitelist users", async () => {
    await whitelistContract.addAddressToWhitelist();

    expect(
      await whitelistContract.whitelistedAddresses(deployer.address)
    ).to.equal(true);

    expect(await whitelistContract.numAddressesWhitelisted()).to.equal(1);
  });

  it("Should emit an event after whitelisting an user", async () => {
    await expect(whitelistContract.addAddressToWhitelist())
      .to.emit(whitelistContract, "AddressWhitelisted")
      .withArgs(deployer.address);
  });

  it("Should revert if the user is already whitelisted", async () => {
    await whitelistContract.addAddressToWhitelist();

    await expect(whitelistContract.addAddressToWhitelist()).to.be.revertedWith(
      "AlreadyWhitelisted"
    );
  });

  it("Should revert if limit of addresses was reached", async () => {
    const maxWhitelistedAddresses: number = 10;

    for (let i = 0; i < maxWhitelistedAddresses; i++) {
      await whitelistContract.connect(signers[i]).addAddressToWhitelist();
    }

    await expect(whitelistContract.addAddressToWhitelist()).to.be.revertedWith(
      "MaxAddressesWhitelisted"
    );
  });
});
