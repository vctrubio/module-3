/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // Match the Solidity version used in the contract
  paths: {
    sources: "./hardhat/contracts", // Store Solidity contracts here
    artifacts: "./hardhat/artifacts", // Compiled contract artifacts
    cache: "./hardhat/cache", // Cache directory
    deploy: "./hardhat/deploy", // Deployment scripts
    tests: "./hardhat/test", // Store tests inside the hardhat folder
  },
  defaultNetwork: "hardhat",
};
