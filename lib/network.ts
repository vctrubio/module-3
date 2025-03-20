/**
 * Known Ethereum networks mapping
 */
export const NETWORKS = {
    1: { name: 'Ethereum Mainnet', currency: 'ETH' },
    5: { name: 'Goerli Testnet', currency: 'ETH' },
    11155111: { name: 'Sepolia Testnet', currency: 'ETH' },
    137: { name: 'Polygon Mainnet', currency: 'MATIC' },
    80001: { name: 'Mumbai Testnet', currency: 'MATIC' },
    42161: { name: 'Arbitrum One', currency: 'ETH' },
    10: { name: 'Optimism', currency: 'ETH' },
    56: { name: 'BNB Smart Chain', currency: 'BNB' },
    31337: { name: 'Hardhat Local', currency: 'ETH' },
    1337: { name: 'Local Network', currency: 'ETH' }
};

/**
 * Network parameters for adding networks to wallets
 */
export const NETWORK_PARAMS = {
    1: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.infura.io/v3/your-project-id'],
        blockExplorerUrls: ['https://etherscan.io']
    },
    5: {
        chainId: '0x5',
        chainName: 'Goerli Testnet',
        nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://goerli.infura.io/v3/your-project-id'],
        blockExplorerUrls: ['https://goerli.etherscan.io']
    },
    11155111: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.infura.io/v3/your-project-id'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
    },
    137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com']
    },
    31337: {
        chainId: '0x7a69',
        chainName: 'Hardhat Local',
        nativeCurrency: { name: 'Hardhat ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['http://127.0.0.1:8545'],
        blockExplorerUrls: []
    },
    1337: {
        chainId: '0x539',
        chainName: 'Local Network',
        nativeCurrency: { name: 'Local ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['http://localhost:8545'],
        blockExplorerUrls: []
    }
};

/**
 * Common networks to display in UI selectors
 */
export const COMMON_NETWORKS = [
    { id: 1, name: 'Ethereum Mainnet' },
    { id: 5, name: 'Goerli Testnet' },
    { id: 11155111, name: 'Sepolia Testnet' },
    { id: 137, name: 'Polygon Mainnet' },
    { id: 80001, name: 'Mumbai Testnet' },
    { id: 31337, name: 'Hardhat Local' },
    { id: 1337, name: 'Local Network' },
];
