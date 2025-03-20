import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Wallet, Contract } from '../lib/types'
import { getConnection } from './myethers';
import { UIWallet } from './components/Wallet';
import { UIContract } from './components/UIContract';

function App() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [contract, setContract] = useState<Contract | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchWallet = async () => {
        const result = await getConnection();
        if (result.status === 200) {
            // Remove the status property before setting wallet
            const { status, ...walletData } = result;
            setWallet(walletData);
        }
        else {
            setError(result.apiResponse?.error || "Unknown error");
            console.error(result.status, result.apiResponse);
        }
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

    window.w = wallet;
    return (
        <div className="min-h-screen bg-gray-800 p-4 w-full text-white border">
            <h1 className="text-4xl font-bold text-center mb-8">
                Hello Sir, lets begin
            </h1>

            <div className="flex justify-center gap-8">
                {wallet ? (
                    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center border">
                        <div className="w-full">
                            <h2 className="text-2xl font-semibold mb-4 text-center lg:text-left">Wallet</h2>
                            <UIWallet wallet={wallet} refreshWallet={fetchWallet} />
                        </div>

                    </div>
                ) : (
                    <div className="flex justify-center">
                        {error ? (
                            <div className="text-red-400">Error: {error}</div>
                        ) : (
                            <div className="text-xl">Loading...</div>
                        )}
                    </div>
                )}

                <div className="border">
                    <h2 className="text-2xl font-semibold mb-4 text-center lg:text-left">Contract</h2>
                    <UIContract contract={contract} />
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
