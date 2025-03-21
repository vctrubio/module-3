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

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-2xl overflow-auto">
            <div className="flex py-2 items-center justify-between">
                <AppleNavBar icons={navIcons} />
                <UINetwork network={wallet.network} refreshWallet={refreshWallet} disabled={false} />
            </div>

            <div>
                <pre className="bg-gray-700 p-4 rounded text-green-300 overflow-x-auto">
                    {JSON.stringify(wallet, null, 2)}
                </pre>
            </div>
        </div>
    );
}
