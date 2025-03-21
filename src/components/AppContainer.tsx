import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Dashboard } from './Dashboard';
import { UIWallet } from './Wallet';
import { TokenInfo } from './TokenInfo';
import { Wallet } from '../../lib/types';
import { ethers } from 'ethers';
import { navigationItems } from './navigationConfig';

// Placeholder for a Contract Explorer component
const ContractExplorer = ({ contract, provider, address }: any) => (
  <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
    <h2 className="text-xl text-white mb-4">Contract Explorer</h2>
    <p className="text-gray-300">Contract functionality will be implemented here.</p>
  </div>
);

// Placeholder for Settings component
const Settings = () => (
  <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
    <h2 className="text-xl text-white mb-4">Settings</h2>
    <p className="text-gray-300">Application settings will be implemented here.</p>
  </div>
);

interface AppContainerProps {
  wallet: Wallet;
  refreshWallet: () => void;
}

export function AppContainer({ wallet, refreshWallet }: AppContainerProps) {
  const [activeItemId, setActiveItemId] = useState('dashboard');
  const [contract, setContract] = useState({
    address: null as string | null,
    abi: null as any[] | null,
    name: null as string | null
  });

  // Mock functions for demonstration
  const connectWallet = () => {
    console.log("Connect wallet requested");
    // This would normally trigger a wallet connection flow
    // In this case it's just a UI demo since we're already passing in the wallet
  };

  const connectContract = () => {
    console.log("Connect contract requested");
    // Mock contract connection for demo purposes
    setContract({
      address: "0x1234567890123456789012345678901234567890",
      abi: [/* sample ABI methods */],
      name: "Sample ERC-1155 Token"
    });
  };

  // Render the active component
  const renderActiveComponent = () => {
    switch (activeItemId) {
      case 'dashboard':
        return (
          <Dashboard 
            wallet={wallet} 
            contract={contract}
            setActiveItem={setActiveItemId}
            connectWallet={connectWallet}
            connectContract={connectContract}
          />
        );
      case 'wallet':
        return <UIWallet wallet={wallet} refreshWallet={refreshWallet} />;
      case 'token':
        return (
          <TokenInfo 
            tokenAddress={contract.address || ''} 
            provider={wallet.provider} 
            walletAddress={wallet.address || ''}
          />
        );
      case 'contract':
        return (
          <ContractExplorer 
            contract={contract}
            provider={wallet.provider}
            address={wallet.address}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard 
          wallet={wallet} 
          contract={contract}
          setActiveItem={setActiveItemId}
          connectWallet={connectWallet}
          connectContract={connectContract}
        />;
    }
  };

  // Determine connection status for navbar indicators
  const connectionStatus = {
    wallet: !!wallet?.address,
    contract: !!contract?.address && !!contract?.abi
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar 
        activeItemId={activeItemId} 
        setActiveItem={setActiveItemId} 
        connectionStatus={connectionStatus}
      />
      
      <div className="container mx-auto p-4 transition-all duration-500 animate-fadeIn">
        {renderActiveComponent()}
      </div>
      
      {/* Footer with connection info */}
      <div className="bg-gray-900 border-t border-gray-800 mt-8">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center text-sm text-gray-400">
          <div>
            {wallet?.network?.name && (
              <span className="mr-4">
                <span className="fas fa-network-wired mr-1"></span> 
                {wallet.network.name} ({wallet.network.chainId})
              </span>
            )}
            {wallet?.address && (
              <span>
                <span className="fas fa-wallet mr-1"></span> 
                {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
              </span>
            )}
          </div>
          <div>
            <button 
              onClick={refreshWallet}
              className="text-blue-400 hover:text-blue-300 transition-colors"
              title="Refresh wallet data"
            >
              <span className="fas fa-sync-alt mr-1"></span> Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
