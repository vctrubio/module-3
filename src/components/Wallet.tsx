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
    // Helper function to get provider methods - kept for reference
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
    
    // Defining the key provider methods with descriptions
    const keyProviderMethods = [
        {
            category: "Account Information",
            methods: [
                { name: "getBalance(address)", desc: "Get account balance in wei" },
                { name: "getTransactionCount(address)", desc: "Get number of transactions sent" },
                { name: "getCode(address)", desc: "Get deployed bytecode at address" },
                { name: "getStorageAt(address, position)", desc: "Get storage value at position" },
            ]
        },
        {
            category: "Transactions",
            methods: [
                { name: "call(transaction)", desc: "Perform read-only call" },
                { name: "estimateGas(transaction)", desc: "Estimate gas for transaction" },
                { name: "getTransaction(hash)", desc: "Get transaction details" },
                { name: "getTransactionReceipt(hash)", desc: "Get transaction receipt" },
            ]
        },
        {
            category: "Blocks & Events",
            methods: [
                { name: "getBlock(blockHashOrNumber)", desc: "Get block information" },
                { name: "getBlockNumber()", desc: "Get current block number" },
                { name: "getLogs(filter)", desc: "Get events matching filter" },
                { name: "on(event, listener)", desc: "Subscribe to events" },
                { name: "once(event, listener)", desc: "Listen for one event occurrence" },
            ]
        },
        {
            category: "Network",
            methods: [
                { name: "getNetwork()", desc: "Get connected network details" },
                { name: "getFeeData()", desc: "Get current gas price data" },
                { name: "broadcastTransaction(signedTx)", desc: "Broadcast raw transaction" },
            ]
        },
        {
            category: "Signer Operations",
            methods: [
                { name: "getSigner()", desc: "Get a signer connected to this provider" },
                { name: "resolveName(ensName)", desc: "Resolve ENS name to address" },
                { name: "lookupAddress(address)", desc: "Lookup ENS name for address" },
            ]
        }
    ];

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
                
                <div className="bg-gray-800 p-4 rounded mb-4">
                    <h3 className="text-white text-lg font-medium mb-2">Provider Methods</h3>
                    <pre className="bg-gray-700 p-4 rounded text-yellow-300 overflow-x-auto">
                        {getProviderMethods().length > 0 
                            ? getProviderMethods().map(method => `- ${method}()`).join('\n')
                            : 'No methods found or provider is not available'}
                    </pre>
                </div>
                
                <div className="bg-gray-800 p-4 rounded">
                    <h3 className="text-white text-lg font-medium mb-2">Common Provider Methods (ethers.js v6)</h3>
                    <div className="space-y-4">
                        {keyProviderMethods.map((category, idx) => (
                            <div key={idx} className="bg-gray-700 p-3 rounded">
                                <h4 className="text-blue-300 font-medium mb-2">{category.category}</h4>
                                <table className="w-full text-sm">
                                    <tbody>
                                        {category.methods.map((method, methodIdx) => (
                                            <tr key={methodIdx} className="border-t border-gray-600">
                                                <td className="py-2 pr-4 text-yellow-300 whitespace-nowrap">{method.name}</td>
                                                <td className="py-2 text-gray-300">{method.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
