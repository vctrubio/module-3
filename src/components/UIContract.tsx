import React from 'react';
import { Contract } from '../../lib/types';
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

export function UIContract({ contract }: { contract: Contract }) {

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-2xl overflow-auto">
            <div className="flex py-2 items-center justify-between">
                <AppleNavBar icons={navIcons} />
                {contract ? <UINetwork network={contract.network} refreshWallet={() => { }} disabled={true} /> : <>no network</>}
            </div>

            <div>
                <pre className="bg-gray-700 p-4 rounded text-green-300 overflow-x-auto">
                    {contract ? JSON.stringify(contract, null, 2) : "No contract data available"}
                </pre>
            </div>
        </div>
    );
}
