const { ethers } = require("hardhat");
const { deployContract } = require("../lib/ethers");

async function main() {
  try {
    console.log("Deploying contracts...");
    
    // Deploy ERCFifteen contract
    const tokenName = "MyERC1155Token";
    const ercFifteen = await deployContract("ERCFifteen", tokenName);
    
    console.log("\nDeployment completed successfully!");
    console.log(`ERCFifteen deployed at: ${ercFifteen.address}`);
    
    // Display the owner of the contract
    const owner = await ercFifteen.owner();
    console.log(`Contract owner: ${owner}`);
    

    
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
