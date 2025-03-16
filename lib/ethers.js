const { ethers } = require("hardhat");
// Using ethers v5 syntax

async function deployContract(contractName, ...args) {
    const [deployer] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory(contractName, deployer);
    const contract = await ContractFactory.deploy(...args);
    await contract.deployed();
    console.log(`--deployContractDEBUG--\nContract: ${contractName} \ndeployed to: ${contract.address} \nby deployer: ${deployer.address}`);
    return contract;
}

// Get a Web3 provider for browser environments
async function getWeb3Provider() {
    if (typeof window !== 'undefined' && window.ethereum) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const signer = provider.getSigner();
            return { provider, signer };
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            throw error;
        }
    } else {
        throw new Error("Browser ethereum provider not available");
    }
}

module.exports = {
    deployContract,
    getWeb3Provider
};