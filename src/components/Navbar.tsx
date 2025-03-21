import React from 'react';
import { navigationItems, NavigationItem } from './navigationConfig';

interface NavbarProps {
  activeItemId: string;
  setActiveItem: (id: string) => void;
  connectionStatus: {
    wallet: boolean;
    contract: boolean;
  };
}

export function Navbar({ activeItemId, setActiveItem, connectionStatus }: NavbarProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="text-xl font-bold text-blue-400">
              <span className="text-white">Web3</span>Inspector
            </div>
          </div>
          
          {/* Connection Status Indicators */}
          <div className="flex items-center space-x-3 mx-4">
            <div className="flex items-center">
              <div className={`h-2.5 w-2.5 rounded-full mr-2 ${connectionStatus.wallet ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-300">Wallet</span>
            </div>
            <div className="flex items-center">
              <div className={`h-2.5 w-2.5 rounded-full mr-2 ${connectionStatus.contract ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-300">Contract</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex space-x-1">
            {navigationItems.map((item: NavigationItem) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                  ${activeItemId === item.id
                    ? 'bg-gray-700 text-white shadow-inner'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  flex items-center space-x-1 relative group`}
              >
                <span className={item.iconClass}></span>
                <span>{item.name}</span>
                
                {/* Active indicator animation */}
                {activeItemId === item.id && (
                  <div className="absolute bottom-0 left-0 h-0.5 bg-blue-400 w-full"></div>
                )}
                
                {/* Hover tooltip */}
                <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none">
                  <div className="bg-gray-800 text-xs text-white p-2 rounded shadow-lg whitespace-nowrap">
                    {item.description}
                  </div>
                  <div className="h-2 w-2 bg-gray-800 transform rotate-45 absolute -top-1 left-1/2 -translate-x-1/2"></div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
