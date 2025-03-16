import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "node:fs/promises";

/**
 * Get all contract files from the contracts directory using Bun APIs
 * @param {string} dirPath - Optional: specific directory to scan (defaults to contracts dir)
 * @return {Array} - Array of contract files with paths
 */
async function getContractFiles(dirPath = null) {
  try {
    // Get current file's directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    // Determine the contracts directory path - go up one directory and into contracts
    const contractsDir = dirPath || join(__dirname, "..", "contracts");
    
    // Debug path resolution
    console.log(`Current script: ${__filename}`);
    console.log(`Script directory: ${__dirname}`);
    console.log(`Scanning directory: ${contractsDir}`);
    
    try {
      // Read directory using fs.promises (works in Bun)
      const files = await fs.readdir(contractsDir);
      
      // Filter for .sol files and map to full paths
      const contractFiles = [];
      
      for (const file of files) {
        if (file.endsWith('.sol')) {
          const filePath = join(contractsDir, file);
          const stats = await fs.stat(filePath);
          const content = await Bun.file(filePath).text();
          const lines = content.split('\n').length;
          
          contractFiles.push({
            name: file,
            path: filePath,
            size: stats.size,
            lines: lines,
            content
          });
        }
      }
      
      // Log the contract files
      console.log('Contract files found:');
      for (const file of contractFiles) {
        console.log(`- ${file.name} (${file.size} bytes, ${file.lines} lines)`);
      }
      
      console.log(`Total: ${contractFiles.length} Solidity files`);
      return contractFiles;
    } catch (error) {
      console.error(`Error reading directory ${contractsDir}:`, error);
      return [];
    }
  } catch (error) {
    console.error('Error getting contract files:', error);
    return [];
  }
}

// Execute right away when run directly
async function listContracts() {
  console.log("Listing all Solidity contracts...");
  const files = await getContractFiles();
  return files;
}

listContracts()