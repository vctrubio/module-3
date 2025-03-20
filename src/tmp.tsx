import React from 'react';

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

// Mock data for demonstration
const mockWallet: Wallet = {
  address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  chainId: '0x1',
  balance: {
    wei: '2500000000000000000',
    formatted: '2.5 ETH',
    value: 2.5
  },
  apiResponse: {
    status: 'success',
    gasPrice: '35 Gwei',
    latestTransaction: '0x12345...'
  },
  blockNumber: 18245367,
  blockHash: '0xfe88c94d860f01a17f961bf4bdfb6e0c6cd10d3fda5cc861e805ca1240c58553'
};

// Subcomponent for address display with copy functionality
const AddressDisplay: React.FC<{ address: string }> = ({ address }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    // In a real app, you'd want to add a toast notification here
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-gray-800 p-3 rounded-lg">
        <p className="text-xs text-gray-400 mb-1">Wallet Address</p>
        <div className="flex items-center">
          <p className="text-white font-mono text-sm truncate">
            {address}
          </p>
        </div>
      </div>
      <button 
        onClick={copyToClipboard}
        className="p-3 bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-purple-200"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
  );
};

// Subcomponent for balance display
const BalanceDisplay: React.FC<{ balance: BalanceInfo }> = ({ balance }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <p className="text-xs text-gray-400 mb-1">Balance</p>
      <div className="flex items-baseline">
        <p className="text-white text-2xl font-bold">{balance.formatted}</p>
        <p className="text-gray-400 text-xs ml-2">≈ ${(balance.value * 3150).toLocaleString()} USD</p>
      </div>
      <p className="text-xs text-gray-500 mt-1 font-mono">{balance.wei} wei</p>
    </div>
  );
};

// Subcomponent for network information
const NetworkInfo: React.FC<{ chainId: string }> = ({ chainId }) => {
  // Map of chain IDs to network names (would be more extensive in a real app)
  const networks: Record<string, { name: string, color: string }> = {
    '0x1': { name: 'Ethereum Mainnet', color: 'bg-blue-600' },
    '0x89': { name: 'Polygon', color: 'bg-purple-600' },
    '0xa': { name: 'Optimism', color: 'bg-red-600' },
    '0xa4b1': { name: 'Arbitrum', color: 'bg-blue-400' },
  };

  const network = networks[chainId] || { name: 'Unknown Network', color: 'bg-gray-600' };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <p className="text-xs text-gray-400 mb-1">Network</p>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${network.color} mr-2`}></div>
        <p className="text-white font-medium">{network.name}</p>
      </div>
      <p className="text-xs text-gray-500 mt-1 font-mono">Chain ID: {chainId}</p>
    </div>
  );
};

// Subcomponent for blockchain details
const BlockchainDetails: React.FC<{ blockNumber?: number, blockHash?: string }> = ({ 
  blockNumber, 
  blockHash 
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <p className="text-xs text-gray-400 mb-1">Latest Block</p>
      {blockNumber && (
        <p className="text-white font-medium"># {blockNumber.toLocaleString()}</p>
      )}
      {blockHash && (
        <p className="text-xs text-gray-500 mt-1 font-mono truncate">{blockHash}</p>
      )}
    </div>
  );
};

// Main wallet display component
const WalletDisplay: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  if (!wallet.address) {
    return (
      <div className="bg-gray-900 p-4 rounded-xl max-w-md mx-auto text-center">
        <p className="text-white">No wallet connected</p>
        <button className="mt-4 bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors">
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 md:p-6 rounded-xl max-w-md mx-auto">
      <h2 className="text-xl text-white font-bold mb-4">Wallet Details</h2>
      
      {/* Address Display */}
      <AddressDisplay address={wallet.address} />
      
      <div className="mt-4">
        {/* Balance Display */}
        {wallet.balance && <BalanceDisplay balance={wallet.balance} />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {/* Network Info */}
          {wallet.chainId && <NetworkInfo chainId={wallet.chainId} />}
          
          {/* Blockchain Details */}
          {(wallet.blockNumber || wallet.blockHash) && (
            <BlockchainDetails 
              blockNumber={wallet.blockNumber} 
              blockHash={wallet.blockHash} 
            />
          )}
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-2">
        <button className="bg-purple-800 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors font-medium">
          Send
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors font-medium">
          Receive
        </button>
      </div>
    </div>
  );
};

// App component that uses the WalletDisplay with mock data
const DApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <WalletDisplay wallet={mockWallet} />
    </div>
  );
};

export default DApp;