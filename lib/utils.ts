//read JSON file and return the data based on contract name 
// -- look at dir = config, look at file = x.file.json, return the data as contract
import { Contract } from '../lib/types';
import { COLORS, configDir } from "../lib/macros.js";

export async function getContractAbiFromConfig(contractName: string){
    try {
        console.log('ok contract data format');
        return 1;
    } catch (error) {
        console.error('Error reading contract config:', error);
        return null;
    }
}