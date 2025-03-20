import React, { useEffect, useState } from 'react';
import { NETWORKS, COMMON_NETWORKS, NETWORK_PARAMS } from '../../lib/network';
import { Network, Wallet } from '../../lib/types';

export function getNetwork(chainId: string) {
    return NETWORKS[chainId] || { name: 'Unknown Network', currency: 'ETH' };
}

export async function setNetwork(chainId: number) {
    if (!window.ethereum) return false;

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        return true;
    } catch (error: any) {
        if (error.code === 4902 && NETWORK_PARAMS[chainId]) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [NETWORK_PARAMS[chainId]],
                });
                return true;
            } catch (addError) {
                console.error('Error adding network:', addError);
                return false;
            }
        }
        console.error('Error switching network:', error);
        return false;
    }
}

export function UINetwork({ network, refreshWallet }: { network: Network, refreshWallet: () => void }) {
    const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
    const networkInfo = getNetwork(network.chainId);

    const handleNetworkChange = async (chainId: number) => {
        setShowNetworkDropdown(false);
        const success = await setNetwork(chainId);
        if (success) {
            refreshWallet();
        }
    };

    return (
        <div className="ml-4 relative">
            <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center"
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
            >
                <span className="mr-2">Network:</span>
                <span className="font-bold">{networkInfo.name} ({network.chainId})</span>
            </button>

            {showNetworkDropdown && (
                <div className="absolute mt-1 w-full bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                    {COMMON_NETWORKS.map((net) => (
                        <div
                            key={net.id}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleNetworkChange(net.id)}
                        >
                            {net.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
