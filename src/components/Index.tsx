import React, { useState, useEffect } from 'react';
import { Wallet, Contract } from '../../lib/types';
import { getConnection } from '../myethers';
import { AppContainer } from './AppContainer';
import { UIContract } from './Contract';

export function Index() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [contract, setContract] = useState<Contract | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchWallet = async () => {
        setLoading(true);
        const result = await getConnection();
        if (result.status === 200) {
            // Remove the status property before setting wallet
            const { status, ...walletData } = result;
            setWallet(walletData);
            setError(null);
        }
        else {
            setError(result.apiResponse?.error || "Unknown error");
            console.error(result.status, result.apiResponse);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            const handleChainChanged = () => {
                fetchWallet();
            };
            window.ethereum.on('chainChanged', handleChainChanged);
            return () => {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    // For development convenience
    if (typeof window !== 'undefined') {
        window.w = wallet;
        window.c = contract;
    }

    if (loading && !wallet) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                <div className="text-white text-xl animate-pulse flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Web3 Interface...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-8 max-w-md text-center">
                    <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-red-300 text-lg font-medium mt-3">Connection Error</h3>
                    <p className="text-white mt-2 mb-4">{error}</p>
                    <button
                        onClick={fetchWallet}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    // If wallet is loaded, render the app with navigation
    return wallet ? (
        <AppContainer 
            wallet={wallet} 
            refreshWallet={fetchWallet} 
        />
    ) : null;
}
