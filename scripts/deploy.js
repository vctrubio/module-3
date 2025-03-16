import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ERC1155 contract...");
  // const [deployer] = await ethers.getSigners();
  // console.log("Deploying contracts with:", deployer.address);
  //
  // const MyERC1155 = await ethers.getContractFactory("MyERC1155");
  // const contract = await MyERC1155.deploy();
  // await contract.waitForDeployment();
  //
  // console.log("ERC1155 deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
