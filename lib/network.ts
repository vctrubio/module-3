/**
 * Unified network configuration - single source of truth for all network related data
 */
export const NETWORK_CONFIG = {
    1: {
        id: 1,
        chainId: '0x1',
        name: 'Ethereum Mainnet',
        currency: 'ETH',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.infura.io/v3/your-project-id'],
        blockExplorerUrls: ['https://etherscan.io'],
        isTestnet: false,
        isCommon: true
    },
    5: {
        id: 5,
        chainId: '0x5',
        name: 'Goerli Testnet',
        currency: 'ETH',
        nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://goerli.infura.io/v3/your-project-id'],
        blockExplorerUrls: ['https://goerli.etherscan.io'],
        isTestnet: true,
        isCommon: true
    },
    11155111: {
        id: 11155111,
        chainId: '0xaa36a7',
        name: 'Sepolia Testnet',
        currency: 'ETH',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.infura.io/v3/your-project-id'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
        isTestnet: true,
        isCommon: true
    },
    137: {
        id: 137,
        chainId: '0x89',
        name: 'Polygon Mainnet',
        currency: 'MATIC',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com'],
        isTestnet: false,
        isCommon: true
    },
    80001: {
        id: 80001,
        chainId: '0x13881',
        name: 'Mumbai Testnet',
        currency: 'MATIC',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com'],
        isTestnet: true,
        isCommon: true
    },
    42161: {
        id: 42161,
        chainId: '0xa4b1',
        name: 'Arbitrum One',
        currency: 'ETH',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io'],
        isTestnet: false,
        isCommon: false
    },
    31337: {
        id: 31337,
        chainId: '0x7a69',
        name: 'Hardhat Local',
        currency: 'ETH',
        nativeCurrency: { name: 'Hardhat ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['http://127.0.0.1:8545'],
        blockExplorerUrls: [],
        isTestnet: true,
        isCommon: true
    }
};

/**
 * Helper function to get common networks for UI selectors
 */
export function getCommonNetworks() {
    return Object.values(NETWORK_CONFIG).filter(network => network.isCommon);
}
