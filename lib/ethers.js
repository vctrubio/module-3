const { ethers } = require("hardhat");

//v5 pattern as appose to v6
// commonJs module.exports
// Deploy a contract and return its instance
async function deployContract(contractName, ...args) {
    const [deployer] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory(contractName, deployer);
    const contract = await ContractFactory.deploy(...args);
    await contract.deployed();
    console.log(`Contract: ${contractName} \ndeployed to: ${contract.address} \nby deployer: ${deployer.address}`);
    return contract;
}

module.exports = {
    deployContract
};