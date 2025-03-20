import React from 'react';
import { Wallet } from '../../lib/types';
import { AppleNavBar } from './AppleNavBar';
import { UINetwork } from './Network';

export function UIWallet({ wallet, refreshWallet }: { wallet: Wallet, refreshWallet: () => void }) {
    
    const navIcons = [
        {
            color: "#ff0000",
            action: () => {
                console.log('exit');
            },
            message: "Exit"
        },
        {
            color: "#00ff00",
            action: () => {
                console.log('minimize');
            },
            message: "Minimize"
        },
        {
            color: "#0000ff",
            action: () => {
                console.log('share');
            },
            message: "Share..."
        },
    ];

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-2xl overflow-auto">
            <div className="flex py-2 items-center justify-between">
                <AppleNavBar icons={navIcons} />
                <UINetwork network={wallet.network} refreshWallet={refreshWallet} />
            </div>

            <div>
                <pre className="bg-gray-700 p-4 rounded text-green-300 overflow-x-auto">
                    {JSON.stringify(wallet, null, 2)}
                </pre>
            </div>
        </div>
    );
}
