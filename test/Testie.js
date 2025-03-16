const { expect } = require("chai");
const { ethers } = require("hardhat");

// Console color constants
const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const MAGENTA = "\x1b[35m";
const CYAN = "\x1b[36m";
const WHITE = "\x1b[37m";
const BRIGHT_RED = "\x1b[91m";
const BRIGHT_GREEN = "\x1b[92m";
const BRIGHT_YELLOW = "\x1b[93m";
const BRIGHT_BLUE = "\x1b[94m";

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
        console.log(GREEN, "Contract confirmed deployed at:", theInstance.address, RESET);
      } catch (error) {
        console.error(RED, "Error in setup:", error, RESET);
        throw error;
      }
    });
  
    it(`should have the correct value passed as the constructor: ${CYAN}${theValue}${RESET}`, async () => {
      const value = await theInstance.value();
      expect(value).to.equal(BigInt(theValue));
    });
  });