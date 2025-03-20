import { ethers } from 'ethers';
export interface BalanceInfo {
    wei: string;         // Raw wei value as string
    formatted: string;   // Formatted in ETH with appropriate decimal places
    value: number;       // Numeric value in ETH (may lose precision for very large amounts)
}
export interface Wallet {
    address: string | null;
    network: Network | null;
    balance: BalanceInfo | null;
    apiResponse: Record<string, any>;
}

export interface Network {
    chainId: string;
    name: string;
    // rpcUrl: string;
}

export interface Contract {
    params: {
        address: string;
        abi: ethers.ContractInterface | null;
    }
    instance: ethers.Contract | null;
    network: Network;
    apiResponse: Record<string, any>;
}