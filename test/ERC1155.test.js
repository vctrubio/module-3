const { expect } = require("chai");
const { ethers } = require("hardhat");
const { COLORS } = require("../lib/macros");

describe("ERCFifteen", () => {
  let ercContract, ercInstance;
  const contractName = "ERCFifteen";
  const tokenName = "MyERC1155Token";

  before(async () => {
    try {
      ercContract = await ethers.getContractFactory(contractName);
      ercInstance = await ercContract.deploy(tokenName);
      await ercInstance.deployed();
      console.log(COLORS.GREEN, "Contract deployed at:", ercInstance.address, COLORS.RESET);
    } catch (error) {
      console.error(COLORS.RED, "Error in setup:", error, COLORS.RESET);
      throw error;
    }
  });

  it(`should have the correct name: ${COLORS.CYAN}${tokenName}${COLORS.RESET}`, async () => {
    const name = await ercInstance.name();
    expect(name).to.equal(tokenName);
  });

  it("should be deployed with a valid address", async () => {
    expect(ercInstance.address).to.be.properAddress;
  });
});
