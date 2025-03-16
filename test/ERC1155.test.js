const { expect } = require("chai");
const { ethers } = require("hardhat");
const { COLORS } = require("../lib/macros");

describe("ERCFifteen", () => {
  let ercContract, ercInstance;
  let deployer, otherAccount;
  const contractName = "ERCFifteen";
  const tokenName = "MyERC1155Token";

  before(async () => {
    try {
      // Get signers (accounts) from Hardhat
      [deployer, otherAccount] = await ethers.getSigners();
      
      // Deploy using the first account as deployer
      ercContract = await ethers.getContractFactory(contractName);
      ercInstance = await ercContract.deploy(tokenName);
      await ercInstance.deployed();
      
      console.log(COLORS.GREEN, "Contract deployed at:", ercInstance.address, COLORS.RESET);
      console.log(COLORS.CYAN, "Deployed by:", deployer.address, COLORS.RESET);
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
  
  it("should set the deployer as the owner", async () => {
    const owner = await ercInstance.owner();
    expect(owner).to.equal(deployer.address);
    console.log(COLORS.CYAN, "Owner is correctly set to deployer:", deployer.address, COLORS.RESET);
  });
  
  it("should allow the owner to transfer ownership", async () => {
    await ercInstance.transferOwnership(otherAccount.address);
    const newOwner = await ercInstance.owner();
    expect(newOwner).to.equal(otherAccount.address);
    console.log(COLORS.CYAN, "Ownership transferred to:", otherAccount.address, COLORS.RESET);
  });
});
