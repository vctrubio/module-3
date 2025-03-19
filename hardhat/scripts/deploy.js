import fs from "fs";
import { hardhat } from "../../config.js";
import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log(`🚀 Deploying to network: ${hardhat.network.name}`);
  const contract = await ethers.getContractFactory("HouseUrban");
}

// Execute deployment
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
