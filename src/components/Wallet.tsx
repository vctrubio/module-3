import React from 'react';
import { Wallet } from '../../lib/types';
import { AppleNavBar } from './AppleNavBar';
import { UINetwork } from './Network';

const navIcons = [
    {
        color: "#880080", // Purple
        action: () => {
            console.log('exit');
        },
        message: "Exit"
    },
    {
        color: "#A9A9A9", // Dark Grey
        action: () => {
            console.log('minimize');
        },
        message: "Minimize"
    },
    {
        color: "#00001F", // Dark Blue
        action: () => {
            console.log('share');
        },
        message: "Share..."
    },
];

export function UIWallet({ wallet, refreshWallet }: { wallet: Wallet, refreshWallet: () => void }) {
    // Helper function to get provider methods
    const getProviderMethods = () => {
        if (!wallet.provider) return [];
        
        // Get all properties including methods
        const properties = Object.getOwnPropertyNames(Object.getPrototypeOf(wallet.provider));
        
        // Filter for methods (excluding constructor and internal methods)
        return properties.filter(
            prop => typeof wallet.provider[prop as keyof typeof wallet.provider] === 'function' && 
            prop !== 'constructor' && 
            !prop.startsWith('_')
        );
    };
    
    const providerMethods = getProviderMethods();

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-2xl overflow-auto">
            <div className="flex py-2 items-center justify-between">
                <AppleNavBar icons={navIcons} />
                <UINetwork network={wallet.network} refreshWallet={refreshWallet} disabled={false} />
            </div>

            <div>
                <pre className="bg-gray-700 p-4 rounded text-green-300 overflow-x-auto mb-4">
                    {JSON.stringify(wallet, null, 2)}
                </pre>
                
                <div className="bg-gray-800 p-4 rounded">
                    <h3 className="text-white text-lg font-medium mb-2">Provider Methods</h3>
                    <pre className="bg-gray-700 p-4 rounded text-yellow-300 overflow-x-auto">
                        {providerMethods.length > 0 
                            ? providerMethods.map(method => `- ${method}()`).join('\n')
                            : 'No methods found or provider is not available'}
                    </pre>
                </div>
            </div>
        </div>
    );
}
