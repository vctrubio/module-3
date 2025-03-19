import hre from 'hardhat';

async function main() {
  // Debug logs to see what's available
  console.log("Hardhat Runtime Environment (hre) keys:", Object.keys(hre));
  console.log("Is ethers available?", !!hre.ethers);
  // if (hre.ethers) {
  //   console.log("Ethers keys:", Object.keys(hre.ethers));
  // }
  
  // // Ensure Hardhat is initialized
  // await hre.run('compile');

  // // Check if the contract artifact exists
  // const artifacts = await hre.artifacts.readArtifact("HouseUrban");
  // console.log("Contract Artifact:", artifacts);

  // // Log the network we're deploying to
  // console.log(`🚀 Deploying to network: ${hre.network.name}`);

  // // Get the contract factory using hre directly
  // const HouseUrban = await hre.ethers.getContractFactory("HouseUrban");

  // // Deploy the contract
  // const houseUrban = await HouseUrban.deploy();

  // // Wait for the contract to be mined
  // console.log("Deploying contract...");
  // await houseUrban.waitForDeployment();

  // Output the contract address
  // console.log(`Contract deployed to: ${await houseUrban.getAddress()}`);
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed with error:");
    console.error(error);
    process.exit(1);
  });
