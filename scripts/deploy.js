const {ethers} = require("hardhat");

async function main() {
  console.log("Deploying ERC1155 contract...");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
