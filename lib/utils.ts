//read JSON file and return the data based on contract name 
// -- look at dir = config, look at file = x.file.json, return the data as contract
import { Contract } from '../lib/types';
import { COLORS, configDir } from "../lib/macros.js";
import fs from 'fs';
import path from 'path';


export function getContractAbiFromConfig(name: string) {
    const dir = configDir;
    const file = path.join(dir, `config.${name}.json`);
    console.log('file... ', file);
    const data = fs.readFileSync(file);
    console.log('data... ', data);
    // return JSON.parse(data);
}