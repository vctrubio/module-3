import React, { useState } from 'react';
import { Contract } from '../../lib/types';
import { AppleNavBar } from './AppleNavBar';
import { UINetwork } from './Network';
import { getContractAbiFromConfig } from '../../lib/utils';
import { deployee } from '../../config/config.deploy';

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
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    async function handleSelect(contractName: string) {
        setLoading(true);
        try {
            const contractData = await getContractAbiFromConfig(contractName);
            if (contractData) setContract(contractData);
        } catch (error) {
            console.error("Error loading contract:", error);
        } finally {
            setLoading(false);
            setShowDropdown(false);
        }
    }

    return (
        <div className='relative'>
            <div className='p-2 border rounded-xl cursor-pointer hover:bg-gray-700'
                onClick={() => setShowDropdown(!showDropdown)}>
                {loading ? 'Loading...' : 'Add Contract'}
            </div>
            {showDropdown && (
                <div className='absolute mt-4 w-full bg-gray-800 border rounded-xl'>
                    {deployee.contractNames.map((contractName: string) => (
                        <div key={contractName} className='p-2 cursor-pointer hover:bg-gray-700'
                            onClick={() => handleSelect(contractName)}>
                            {contractName}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export function UIContract({ contract, setContract }: { contract: Contract, setContract: (contract: Contract) => void }) {
    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-2xl overflow-auto">
            <div className="flex py-2 items-center justify-between">
                <AppleNavBar icons={navIcons} />
                {contract ? <UINetwork network={contract.network} refreshWallet={() => { }} disabled={true} /> : <AddContractBtn setContract={setContract} />}
            </div>

            <div>
                <pre className="bg-gray-700 p-4 rounded text-green-300 overflow-x-auto">
                    {contract ? JSON.stringify(contract, null, 2) : "No contract data available"}
                </pre>
            </div>
        </div>
    );
}
