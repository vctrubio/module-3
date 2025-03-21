import React, { useState, useRef, useEffect } from 'react';

interface Network {
  name: string;
  chainId: string;
  rpcUrl?: string;
  icon?: string;
  explorerUrl?: string;
}

interface NetworkSwitcherProps {
  currentNetwork: Network | null;
  onNetworkChange: (network: Network) => Promise<void>;
  disabled?: boolean;
}

// Common EVM networks
const predefinedNetworks: Network[] = [
  { name: 'Ethereum', chainId: '1', icon: '🔷', explorerUrl: 'https://etherscan.io' },
  { name: 'Goerli', chainId: '5', icon: '🔹', explorerUrl: 'https://goerli.etherscan.io' },
  { name: 'Sepolia', chainId: '11155111', icon: '🟣', explorerUrl: 'https://sepolia.etherscan.io' },
  { name: 'Polygon', chainId: '137', icon: '🟪', explorerUrl: 'https://polygonscan.com' },
  { name: 'Mumbai', chainId: '80001', icon: '🟣', explorerUrl: 'https://mumbai.polygonscan.com' },
  { name: 'Arbitrum', chainId: '42161', icon: '🔵', explorerUrl: 'https://arbiscan.io' },
  { name: 'Optimism', chainId: '10', icon: '🔴', explorerUrl: 'https://optimistic.etherscan.io' },
  { name: 'Base', chainId: '8453', icon: '🔵', explorerUrl: 'https://basescan.org' },
];

export function NetworkSwitcher({ currentNetwork, onNetworkChange, disabled = false }: NetworkSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNetworkSelect = async (network: Network) => {
    try {
      await onNetworkChange(network);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to switch network:", error);
      // Error handling could be improved here
    }
  };

  const getCurrentNetworkIcon = () => {
    if (!currentNetwork) return '🌐';
    const network = predefinedNetworks.find(n => n.chainId === currentNetwork.chainId);
    return network?.icon || '🌐';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center space-x-1 rounded-md px-3 py-1.5 transition-all ${
          isOpen ? 'bg-gray-700' : 'hover:bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={disabled ? "Network switching unavailable" : "Switch network"}
      >
        <span className="text-lg mr-1">{getCurrentNetworkIcon()}</span>
        <span className="text-gray-300 hidden sm:inline">
          {currentNetwork?.name || 'Select Network'}
        </span>
        <svg
          className={`h-4 w-4 transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
          <div className="py-1">
            <div className="px-3 py-2 border-b border-gray-700">
              <h3 className="text-xs font-medium text-gray-400">Select a network</h3>
            </div>
            {predefinedNetworks.map((network) => (
              <button
                key={network.chainId}
                className={`flex items-center px-3 py-2 text-sm w-full text-left hover:bg-gray-700 ${
                  currentNetwork?.chainId === network.chainId ? 'bg-gray-700 text-blue-400' : 'text-white'
                }`}
                onClick={() => handleNetworkSelect(network)}
              >
                <span className="mr-2">{network.icon}</span>
                <span className="flex-1">{network.name}</span>
                {currentNetwork?.chainId === network.chainId && (
                  <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
            <div className="border-t border-gray-700 px-3 py-2">
              <a
                href={currentNetwork?.explorerUrl || "https://chainlist.org"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
              >
                <span>View in explorer</span>
                <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
