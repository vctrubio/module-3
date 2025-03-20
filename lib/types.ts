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
    apiResponse: Record<string, any> | null;
}

export interface Network {
    chainId: string;
    name: string;
    // rpcUrl: string;
}

export interface Contract {
    params: {
        name: string | null;
        address: string;
        abi: ethers.ContractInterface | null;
        originalOwner: string | null;
    }
    instance: ethers.Contract | null;
    network: Network | null;
    apiResponse: Record<string, any> | null;
}


/*
Including rpcUrl is optional but useful if you want to:
Display it to the user (e.g., for debugging).
Switch providers manually later (e.g., fallback to a different RPC).
Track which endpoint the wallet is using.



*/