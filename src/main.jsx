import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { getEthers, switchNetwork } from './wallet';
import MyAbi from './components/MyAbi';
import { Client } from './client';
// Import the useContract hook
import { useContract } from './contract';

const WalletShow = ({ walletInstance }) => {
    const [jsonError, setJsonError] = useState(false);

    if (!walletInstance) {
        return <div>No wallet data to display</div>;
    }

    let jsonDisplay;
    try {
        jsonDisplay = JSON.stringify(walletInstance, (key, value) => {
            if (key === 'provider' || typeof value === 'function') {
                return '[Object]';
            }
            return value;
        }, 2);
    } catch (error) {
        console.error("Error stringifying wallet data:", error);
        setJsonError(true);
        jsonDisplay = '{"error": "Could not stringify wallet data"}';
    }

    return (
        <div className="w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Wallet Details</h2>
            {jsonError ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    Error displaying wallet data
                </div>
            ) : (
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto h-full">
                    {jsonDisplay}
                </pre>
            )}
        </div>
    );
};

const WalletConnection = ({ walletInstance, connectWallet, disconnectWallet, isConnecting, contractInstance, setContractInstance, setWalletInstance }) => {
    const [networkMismatch, setNetworkMismatch] = useState(false);
    const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

    useEffect(() => {
        if (walletInstance && contractInstance) {
            // Check if wallet network matches contract network
            const walletChainId = walletInstance.network?.chainId;
            const contractChainId = contractInstance.network?.chainId;

            if (walletChainId && contractChainId && walletChainId !== contractChainId) {
                setNetworkMismatch(true);
            } else {
                setNetworkMismatch(false);
            }
        }
    }, [walletInstance, contractInstance]);

    const handleNetworkSwitch = async () => {
        if (!contractInstance || !contractInstance.network?.chainId) return;
        
        setIsSwitchingNetwork(true);
        try {
            const success = await switchNetwork(contractInstance.network.chainId);
            if (success) {
                // Refresh wallet data after successful switch
                const instance = await getEthers();
                // Assuming you have access to setWalletInstance
                if (instance && instance.connected) {
                    setWalletInstance(instance);
                }
            }
        } catch (error) {
            console.error("Error during network switch:", error);
        } finally {
            setIsSwitchingNetwork(false);
        }
    };

    if (walletInstance && walletInstance.connected) {
        return (
            <div className="flex flex-col items-center w-full">
                <div className="text-center w-full max-w-md mb-6">
                    <button
                        onClick={disconnectWallet}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
                    >
                        Sign Out
                    </button>
                </div>

                {networkMismatch && contractInstance && (
                    <div className="w-full max-w-2xl mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                        <p className="font-bold">Network Mismatch Warning</p>
                        <p>Your wallet is connected to network with chainId: {walletInstance.network?.chainId}</p>
                        <p>Contract is deployed on network with chainId: {contractInstance.network?.chainId}</p>
                        <p>Please switch your network to interact with this contract.</p>
                        <button
                            onClick={handleNetworkSwitch}
                            disabled={isSwitchingNetwork}
                            className={`mt-2 px-4 py-2 ${isSwitchingNetwork ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-white rounded transition duration-300`}
                        >
                            {isSwitchingNetwork ? 'Switching...' : 'Switch Network'}
                        </button>
                    </div>
                )}

                <div className='flex gap-4'>
                    <MyAbi
                        contractInstance={contractInstance}
                        setContractInstance={setContractInstance}
                    />

                    <WalletShow walletInstance={walletInstance} />
                </div>
            </div>
        );
    }

    if (isConnecting) {
        return (
            <button
                disabled
                className="p-8 bg-yellow-500 text-white rounded-xl cursor-wait"
            >
                Fetching Wallet...
            </button>
        );
    }

    return (
        <button
            onClick={connectWallet}
            className="p-8 bg-green-500 text-white rounded hover:bg-green-700 rounded-xl transition duration-300"
        >
            Sign In
        </button>
    );
};

function App() {
    const [walletInstance, setWalletInstance] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [contractAddress, setContractAddress] = useState(''); // New state for contract address
    const [contractAbi, setContractAbi] = useState(null); // New state for contract ABI

    // Using our custom hook when we have an address, ABI and signer
    const { contract, isLoading, error, call, initContract } = useContract(
        contractAddress || '0x0000000000000000000000000000000000000000', // Default or empty address
        contractAbi,
        walletInstance?.signer // Use the signer from the wallet when available
    );

    useEffect(() => {
        if (contract && !isLoading && !error) {
            setContractInstance(contract);
        }
    }, [contract, isLoading, error]);


    window.w = walletInstance;
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4 w-full text-white">
            <h1 className={`text-4xl font-bold mb-8 ${!walletInstance && 'animate-bounce'}`}>
                Hello Sir, lets begin
            </h1>

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
