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


function AddContractBtn({ setContract }: { setContract: (contract: Contract) => void }) {
    function handleClick() {
        setContract({
            instance: null,
            network: null,
            apiResponse: null,
            params: {
                address: "0x",
                abi: null,
                originalOwner: null,
                name: null
            }
        })
    }

    return (
        <div className='p-2 border rounded-xl'
            onClick={handleClick}>
            Add Contract
        </div>
    )
}


export function UIContract({ contract, setContract }: { contract: Contract, setContract: (contract: Contract) => void }) {


    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-2xl overflow-auto">
            <div className="flex py-2 items-center justify-between">
                <AppleNavBar icons={navIcons} />
                <AddContractBtn setContract={setContract} />
                {/* {contract ? <UINetwork network={contract.network} refreshWallet={() => { }} disabled={true} /> : <AddContractBtn setContract={setContract} />} */}
            </div>

            <div>
                <pre className="bg-gray-700 p-4 rounded text-green-300 overflow-x-auto">
                    {contract ? JSON.stringify(contract, null, 2) : "No contract data available"}
                </pre>
            </div>
        </div>
    );
}
