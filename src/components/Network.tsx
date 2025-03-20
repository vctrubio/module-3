import React, { useEffect, useState } from 'react';
import { NETWORKS, COMMON_NETWORKS, NETWORK_PARAMS } from '../../lib/network';
import { Network } from '../../lib/types';

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

export function UINetwork({ network, refreshWallet, disabled }: { network: Network | null, refreshWallet: () => void, disabled?: boolean  }) {
    if (!network) return <>no network found</>;
    if (!network.chainId) return <>no chainId found</>

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
        <div className="relative">
            <button
                className="bg-blue-700 hover:bg-gray-800 text-white py-2 px-4 rounded flex items-center"
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                disabled={disabled}
            >
                <span className="font-bold">{networkInfo.name} : {network.chainId}</span>
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
