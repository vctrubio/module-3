const { expect } = require("chai");
const { ethers } = require("hardhat");
const { COLORS } = require("../lib/macros");

// v5 pattern, as appose to v6...
describe("Initial", function () {
  before(async function () {

  });

  it("hellomundo", async function () {
    expect(1).to.equal(1);
  });
});

describe("Testie", () => {
    let theContract, theInstance, theValue;
  
    const ContractName = "Testie";
    theValue = 45;
  
    before(async () => {
      try {
        theContract = await ethers.getContractFactory(ContractName);
        theInstance = await theContract.deploy(theValue);
        await theInstance.deployed();
        console.log(COLORS.GREEN, "Contract confirmed deployed at:", theInstance.address, COLORS.RESET);
      } catch (error) {
        console.error(COLORS.RED, "Error in setup:", error, COLORS.RESET);
        throw error;
      }
    });
  
    it(`should have the correct value passed as the constructor: ${COLORS.CYAN}${theValue}${COLORS.RESET}`, async () => {
      const value = await theInstance.value();
      expect(value).to.equal(BigInt(theValue));
    });
  });