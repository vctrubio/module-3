const { expect } = require("chai");
const { ethers } = require("hardhat");
const { COLORS } = require("../lib/macros");
const { deployContract } = require("../lib/ethers");

// v5 pattern, as appose to v6...
describe("Initial", function () {
  let testieInstance;
  const initialValue = 42;

  before(async function () {
    try {
      // Use the deployContract helper function
      testieInstance = await deployContract("Testie", initialValue);
      console.log(COLORS.GREEN, "Test contract deployed successfully using helper function", COLORS.RESET);
    } catch (error) {
      console.error(COLORS.RED, "Failed to deploy contract:", error, COLORS.RESET);
      throw error;
    }
  });

  it("should deploy the contract successfully", async function () {
    expect(testieInstance.address).to.be.a('string');
    expect(testieInstance.address).to.match(/0x[0-9a-fA-F]{40}/);
  });

  it("should initialize with the correct value", async function () {
    const value = await testieInstance.value();
    expect(value).to.equal(BigInt(initialValue));
    console.log(COLORS.CYAN, `Contract value verified: ${value}`, COLORS.RESET);
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