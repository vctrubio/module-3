import React, { useState, useEffect } from 'react';
import { Contract } from '../../lib/types';
import { AppleNavBar } from './AppleNavBar';
import { UINetwork } from './Network';
import { getContractAbiFromConfig } from '../../lib/utils';
import { deployee } from '../../config/config.deploy';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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

function AddContractBtn({ setContract }: {
    setContract: (contract: Contract) => void,
}) {
    const [loading, setLoading] = useState(false);

    async function handleSelect(contractName: string) {
        setLoading(true);
        try {
            const contractData = await getContractAbiFromConfig(contractName);
            if (contractData) setContract(contractData); // Success case, contractData is never null here, but why eslint then fuck
            if (!contractData) console.log('what are u reading???')
        } catch (error) {
            setContract({
                instance: null,
                network: null,
                params: { address: null, name: contractName, originalOwner: null, abi: null },
                apiResponse: { getContractAbiFromConfigError: String(error) }
            });
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        if (deployee.contractNames.length > 0) {
            handleSelect(deployee.contractNames[0]);
        }
    }, []);

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <div className='p-2 border rounded-xl cursor-pointer hover:bg-gray-700'>
                    {loading ? 'Loading...' : 'Add Contract'}
                </div>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className='min-w-[200px] bg-gray-800 mt-1 Fz-50'
                    sideOffset={5}
                >
                    {deployee.contractNames.map((contractName: string) => (
                        <DropdownMenu.Item
                            key={contractName}
                            className='px-2 py-4 cursor-pointer hover:bg-gray-700 outline-none text-white'
                            onClick={() => handleSelect(contractName)}
                        >
                            {contractName}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
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
