//read JSON file and return the data based on contract name 
// -- look at dir = config, look at file = x.file.json, return the data as contract
import { Contract } from '../lib/types';
import { COLORS, configDir } from "../lib/macros.js";

export async function getContractAbiFromConfig(contractName: string): Promise<Contract | null> {
    try {
        console.log('fetching contract from getContractAbiFromConfig> ', contractName);
        const response = await fetch(`/config/config.${contractName}.json`);

        if (!response.ok) {
            throw new Error(`Failed to load contract: ${response.statusText}`);
        }

        const jsonData = await response.json();

        if (jsonData && jsonData.contract) {
            return {
                instance: null,
                network: jsonData.network || null,
                params: {
                    address: jsonData.contract.address || null,
                    name: jsonData.contract.name || null,
                    originalOwner: jsonData.contract.owner || null,
                    abi: jsonData.contract.abi || null
                },
                apiResponse: null
            };
        }

    } catch (error) {
        throw error
    }

}
