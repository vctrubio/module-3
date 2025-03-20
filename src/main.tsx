import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Wallet } from '../lib/types'
import { getConnection } from './myethers';

// New UIWallet component
function UIWallet({ wallet }: { wallet: Wallet }) {
    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-2xl overflow-auto">
            <h2 className="text-xl font-semibold mb-2">Wallet Information</h2>
            <pre className="bg-gray-700 p-4 rounded text-green-300 overflow-x-auto">
                {JSON.stringify(wallet, null, 2)}
            </pre>
        </div>
    );
}

function App() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWallet() {
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
        }
        fetchWallet();
    }, []);

    window.w = wallet;
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4 w-full text-white">
            <h1 className={`text-4xl font-bold mb-8 ${!false && 'animate-bounce'}`}>
                Hello Sir, lets begin
            </h1>
            {wallet ? <UIWallet wallet={wallet} /> : (
                <div>
                    {error ? (
                        <div className="text-red-400">Error: {error}</div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
