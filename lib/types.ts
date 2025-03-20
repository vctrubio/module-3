
export interface BalanceInfo {
    wei: string;         // Raw wei value as string
    formatted: string;   // Formatted in ETH with appropriate decimal places
    value: number;       // Numeric value in ETH (may lose precision for very large amounts)
}

export interface Wallet {
    address: string | null;
    chainId: string | null;
    balance: BalanceInfo | null;
    apiResponse: Record<string, any>;
    blockNumber?: number;
    blockHash?: string;
}

export interface User {
    ipAddress: string;
    loggedIn: boolean;
    wallet: Wallet;
}

export interface Contract {
    address: string;
    abi: any;
    instance: any;
    apiResponse: Record<string, any>;
}

export interface Network {
    chainId: string;
    name: string;
    rpcUrl: string;
}