import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Dashboard } from './Dashboard';
import { UIWallet } from './Wallet';
import { TokenInfo } from './TokenInfo';
import { ContractSelector } from './ContractSelector';
import { Wallet } from '../../lib/types';
import { ethers } from 'ethers';
import { navigationItems } from './navigationConfig';
import { NetworkSwitcher } from './NetworkSwitcher';
import { AbiComponent } from './AbiComponent';

// Replace the ContractExplorer placeholder with our new component
const ContractExplorer = ({ contract, provider, address }: any) => (
  <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
    <h2 className="text-xl text-white mb-4">Contract Explorer</h2>
    {contract && contract.address && contract.abi ? (
      <AbiComponent 
        address={contract.address}
        abi={contract.abi}
        provider={provider}
        contractName={contract.name}
        networkName={provider?._network?.name}
      />
    ) : (
      <p className="text-gray-300">No contract connected. Please select a contract first.</p>
    )}
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
  const [contract, setContract] = useState<{
    instance: ethers.Contract | null;
    address: string | null;
    abi: any[] | null;
    name: string | null;
    functions?: any[];
    events?: any[];
  }>({
    instance: null,
    address: null,
    abi: null,
    name: null
  });

  // Function to handle contract creation from manual input
  const handleContractCreated = (contractInfo: {
    instance: ethers.Contract;
    address: string;
    name: string;
    abi: any[];
    functions?: any[];
    events?: any[];
  }) => {
    setContract(contractInfo);
    // After contract connection, redirect to the contract explorer
    setActiveItemId('contract');
  };
  
  // Function to handle contract selection from existing contracts
  const handleExistingContract = (contractData: Contract) => {
    if (contractData && contractData.params) {
      setContract({
        instance: contractData.instance,
        address: contractData.params.address,
        abi: contractData.params.abi,
        name: contractData.params.name || "Unknown Contract",
        // Add any other properties needed
      });
      setActiveItemId('contract');
    }
  };

  // Handle network switching
  const handleNetworkSwitch = async (network: { name: string; chainId: string }) => {
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found");
      }
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(network.chainId).toString(16)}` }],
      });
      
      // The wallet refresh will happen via the chainChanged event listener
    } catch (error: any) {
      // If the network doesn't exist, we could add code here to add it
      if (error.code === 4902) {
        // Network not available, would need to add it
        console.log("Network not available in wallet");
      }
      throw error;
    }
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
            connectWallet={refreshWallet}
            connectContract={() => setActiveItemId('selectContract')}
          />
        );
      case 'wallet':
        return <UIWallet wallet={wallet} refreshWallet={refreshWallet} />;
      case 'selectContract':
        return (
          <ContractSelector 
            provider={wallet.provider}
            onContractCreated={handleContractCreated}
            existingAddress={contract.address || ''}
            setExistingContract={handleExistingContract}
          />
        );
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
          connectWallet={refreshWallet}
          connectContract={() => setActiveItemId('selectContract')}
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
      
      {/* Footer with connection info and network switcher */}
      <div className="bg-gray-900 border-t border-gray-800 mt-8">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            {wallet?.network?.name && (
              <span className="text-gray-400 flex items-center">
                <span className="fas fa-network-wired mr-1"></span> 
                {wallet.network.name} ({wallet.network.chainId})
              </span>
            )}
            {wallet?.address && (
              <span className="text-gray-400">
                <span className="fas fa-wallet mr-1"></span> 
                {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <NetworkSwitcher 
              currentNetwork={wallet?.network} 
              onNetworkChange={handleNetworkSwitch}
              disabled={!wallet?.address} 
            />
            {contract.address && (
              <button
                onClick={() => setActiveItemId('selectContract')}
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center"
                title="Change contract"
              >
                <span className="fas fa-file-contract mr-1"></span> 
                <span className="hidden sm:inline">Change Contract</span>
              </button>
            )}
            <button 
              onClick={refreshWallet}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
              title="Refresh wallet data"
            >
              <span className="fas fa-sync-alt mr-1"></span> 
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
