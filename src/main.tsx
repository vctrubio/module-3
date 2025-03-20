import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Wallet } from '../lib/types'
import { getConnection } from './myethers';
import { UIWallet } from './components/Wallet';

function App() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4 w-full text-white">
            <h1 className={`text-4xl font-bold mb-8 ${!true && 'animate-bounce'}`}>
                Hello Sir, lets begin
            </h1>
            {wallet ? <UIWallet wallet={wallet} refreshWallet={fetchWallet} /> : (
                <div>
                    {error ? (<div className="text-red-400">Error: {error}</div>) :
                        (<div>Loading...</div>)}
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
