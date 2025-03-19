import fs from "fs";
import { hardhat } from "../../config.js";

async function main() {
  console.log(`🚀 Deploying to network: ${hardhat.network.name}`);
}

// Execute deployment
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
