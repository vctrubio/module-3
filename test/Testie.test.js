const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testie", () => {
  let theContract, theInstance, theValue;

  const ContractName = "Testie";
  theValue = 45;
  before(async () => {
    theContract = await ethers.getContractFactory(ContractName);
    theInstance = await theContract.deploy(theValue);
    await theInstance.deployed();
  });

  it("should have the correct .value, passed as the constructor", async () => {
    expect(await theInstance.value()).to.equal(theValue);
  });
});
