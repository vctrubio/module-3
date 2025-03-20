import hh from "hardhat";
import fs from 'fs';
import { deployee } from "../../config/config.deploy.js";
import { COLORS, configDir } from "../../lib/macros.js";

async function writeResultToFile(result, contractName) {
  const outputFile = `${configDir}/config.${contractName}.json`;

  if (!fs.existsSync(configDir)) {
    console.error(`Directory ${configDir} does not exist`);
    throw new Error(`Directory ${configDir} does not exist`);
  }

  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log('Writing to file complete:', outputFile);
}

function verify() {
  if (!deployee) {
    throw new Error('deployee is not defined in ./src/config.deploy.js');
  }
  if (!deployee.network) {
    throw new Error('deployee.network is not defined');
  }
  if (!deployee.contractNames || !Array.isArray(deployee.contractNames) || deployee.contractNames.length === 0) {
    throw new Error('deployee.contractNames must be a non-empty array');
  }
}

async function deployContract(contractName, signer) {
  try {
    let contractFactory;
    try {
      contractFactory = await hh.ethers.getContractFactory(contractName, signer);
    } catch (error) {
      console.log(`${COLORS.YELLOW}Skipping contract "${contractName}" - Not found in ContractFactory.${COLORS.RESET}`);
      return null;
    }

    const contractInstance = await contractFactory.deploy();
    await contractInstance.waitForDeployment();

    const address = await contractInstance.getAddress();
    const artifact = await hh.artifacts.readArtifact(contractName);
    const abi = artifact.abi;

    return {
      network: {
        name: deployee.network.name,
        chainId: deployee.network.chainId,
        url: deployee.network.url,
      },
      contract: {
        address: address,
        name: contractName,
        owner: signer.address,
        abi: abi,
        // bytecode: contractFactory.bytecode, // Uncomment if needed
      }
    };
  } catch (error) {
    console.error(`${COLORS.RED}Error deploying contract ${contractName}:${COLORS.RESET}`, error.message);
    return null;
  }
}

async function main() {
  try {
    verify();
    const [signer] = await hh.ethers.getSigners();

    const deploymentResults = [];
    const skippedContracts = [];
    let successCount = 0;

    // Loop through each contract name and deploy
    for (const contractName of deployee.contractNames) {
      console.log(`Attempting to deploy contract: ${COLORS.CYAN}${contractName}${COLORS.RESET}`);
      const result = await deployContract(contractName, signer);

      if (result === null) {
        skippedContracts.push(contractName);
        continue; // Skip to the next contract
      }

      deploymentResults.push({ contractName, result });

      // Write individual contract result to file
      await writeResultToFile(result, contractName);
      console.log(`Contract ${contractName} deployed with address: ${COLORS.GREEN}${result.contract.address}${COLORS.RESET}`);
      successCount++;
    }

    console.log("\n=== Deployment Summary ===");
    console.log(`${COLORS.GREEN}Successfully deployed: ${successCount} contract(s)${COLORS.RESET}`);
    if (skippedContracts.length > 0) {
      console.log(`${COLORS.YELLOW}Skipped contracts: ${skippedContracts.join(', ')}${COLORS.RESET}`);
    }

    return {
      deployed: deploymentResults,
      skipped: skippedContracts
    };
  } catch (error) {
    console.error(`${COLORS.RED}Error in deployment script:${COLORS.RESET}`, error.message);
    process.exit(1);
  }
}

main()
  .then((results) => {
    if (results.deployed.length > 0) {
      console.log(`${COLORS.CYAN}Deployment process completed.${COLORS.RESET}`);
    } else {
      console.log(`${COLORS.CYAN}No contracts were deployed.${COLORS.RESET}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error(`${COLORS.RED}Error in deployment script2:${COLORS.RESET}`, error.message);
    process.exit(1);
  });