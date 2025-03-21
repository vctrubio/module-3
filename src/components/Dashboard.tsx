import React from 'react';
import { Wallet } from '../../lib/types';
import { navigationItems } from './navigationConfig';
import { ethers } from 'ethers';

interface DashboardProps {
  wallet: Wallet | null;
  contract: {
    address: string | null;
    abi: any[] | null;
    name: string | null;
  };
  setActiveItem: (id: string) => void;
  connectWallet: () => void;
  connectContract: () => void;
}

export function Dashboard({ 
  wallet, 
  contract, 
  setActiveItem, 
  connectWallet, 
  connectContract 
}: DashboardProps) {
  
  const isWalletConnected = !!wallet?.address;
  const isContractConnected = !!contract?.address && !!contract?.abi;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Web3 Inspector Dashboard
      </h1>
      
      {/* Connection Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Wallet Status */}
        <div className={`p-5 rounded-lg border border-opacity-20 transition-all duration-300 
          ${isWalletConnected 
            ? 'bg-green-900 bg-opacity-20 border-green-500 shadow-green-900/20 shadow-inner' 
            : 'bg-red-900 bg-opacity-10 border-red-500'}`}>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <span className="fas fa-wallet mr-2"></span>
              Wallet Status
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${isWalletConnected ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-100'}`}>
              {isWalletConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {isWalletConnected ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Address:</span>
                <span className="font-mono text-sm bg-gray-800 p-1 rounded">
                  {wallet?.address?.substring(0, 8)}...{wallet?.address?.substring(wallet.address.length - 6)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Network:</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-sm">
                  {wallet?.network?.name || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Balance:</span>
                <span>{wallet?.balance?.formatted || '0.0'} ETH</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-gray-300">
                Connect your wallet to interact with blockchain data and smart contracts.
              </p>
              <button 
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 
                  hover:shadow-lg flex items-center justify-center"
              >
                <span className="fas fa-plug mr-2"></span>
                Connect Wallet
              </button>
            </div>
          )}
        </div>
        
        {/* Contract Status */}
        <div className={`p-5 rounded-lg border border-opacity-20 transition-all duration-300
          ${isContractConnected 
            ? 'bg-green-900 bg-opacity-20 border-green-500 shadow-green-900/20 shadow-inner' 
            : 'bg-red-900 bg-opacity-10 border-red-500'}`}>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <span className="fas fa-file-contract mr-2"></span>
              Contract Status
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${isContractConnected ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-100'}`}>
              {isContractConnected ? 'Ready' : 'Not Set'}
            </span>
          </div>
          
          {isContractConnected ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Name:</span>
                <span>{contract.name || 'Unknown Contract'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Address:</span>
                <span className="font-mono text-sm bg-gray-800 p-1 rounded">
                  {contract.address?.substring(0, 8)}...{contract.address?.substring(contract.address.length - 6)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-24">ABI:</span>
                <span className="text-sm">
                  {contract.abi ? `${contract.abi.length} methods available` : 'No ABI loaded'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-gray-300">
                Set up a contract to interact with its functions and data.
              </p>
              <button 
                onClick={connectContract}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors duration-200
                  hover:shadow-lg flex items-center justify-center"
                disabled={!isWalletConnected}
              >
                <span className="fas fa-file-import mr-2"></span>
                {isWalletConnected ? 'Select Contract' : 'Connect Wallet First'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Available Components Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Available Components</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {navigationItems.map(item => {
            const isDisabled = 
              (item.requiresWallet && !isWalletConnected) || 
              (item.requiresContract && !isContractConnected);
              
            return (
              <div 
                key={item.id}
                onClick={() => !isDisabled && setActiveItem(item.id)}
                className={`p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200 
                  ${isDisabled 
                    ? 'opacity-50 cursor-not-allowed bg-gray-800' 
                    : 'cursor-pointer hover:bg-gray-800 hover:shadow-md hover:shadow-blue-500/10 transform hover:-translate-y-1'}
                `}
              >
                <div className="flex items-center mb-2">
                  <span className={`${item.iconClass} text-xl w-8 h-8 flex items-center justify-center 
                    rounded-full bg-gray-700 mr-2`}></span>
                  <h3 className="font-medium">{item.name}</h3>
                </div>
                
                <p className="text-sm text-gray-400">{item.description}</p>
                
                {isDisabled && (
                  <div className="mt-2 text-xs text-amber-400 flex items-center">
                    <span className="fas fa-exclamation-triangle mr-1"></span>
                    {item.requiresWallet && !isWalletConnected && "Requires wallet connection"}
                    {item.requiresContract && !isContractConnected && 
                      (isWalletConnected ? "Requires contract setup" : "")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
