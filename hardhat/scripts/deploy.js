import hh from "hardhat";
import { deployee } from "../../src/config.deploy.js";
import fs from 'fs';
import { ethers } from "ethers"; // Import ethers
import { sign } from "crypto";

async function writeResultToFile(result) {
  const outputFile = `./src/config.${deployee.contractName}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
}

function verify() {
  if (!deployee) {
    throw new Error('deployee is not defined in ./src/config.deploy.js');
  }
  if (!deployee.network) {
    throw new Error('deployee.network is not defined');
  }
  if (!deployee.contractName) {
    throw new Error('deployee.contractName is not defined');
  }
}

async function main() {
  try {
    verify();

    const [signer] = await hh.ethers.getSigners(); // Get the signer
    const contractFactory = await hh.ethers.getContractFactory(deployee.contractName, signer); // Use the signer
    const contractInstance = await contractFactory.deploy();
    await contractInstance.waitForDeployment();
    
    const address = await contractInstance.getAddress();
    const abi = contractFactory.interface.format('json');
    return {
      network: {
        name: deployee.network.name,
        chainId: deployee.network.chainId,
        url: deployee.network.url,
        address: address,
      },
      contract: {
        name: deployee.contractName,
        owner: signer.address,
        abi: abi,
        // bytecode: contractFactory.bytecode, // Uncomment if needed
      }
    };
  } catch (error) {
    console.error('Error in deployment script:', error.message);
    process.exit(1);
  }
}

main()
  .then((result) => {
    writeResultToFile(result);
    process.exit(0);
  })
  .catch((error) => {
    process.exit(1);
  });