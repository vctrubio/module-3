/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  paths: {
    sources: "./hardhat/contracts", // Store Solidity contracts here
    artifacts: "./hardhat/artifacts", // Compiled contract artifacts
    cache: "./hardhat/cache", // Cache directory
    tests: "./hardhat/test", // Store tests inside the hardhat folder
  },
};
