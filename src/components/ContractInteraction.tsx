import React from 'react';
import { Wallet, Contract } from '../../lib/types';

interface ContractInteractionProps {
    wallet: Wallet;
    contract: Contract;
}

export const ContractInteraction: React.FC<ContractInteractionProps> = ({ wallet, contract }) => {
    const networksMatch = wallet.network?.chainId == contract.network?.chainId;

    function onClick() {
        console.log('babies were made yesterday');

    }
    return (
        <div className="m-8 text-center p-4 border-2 rounded-lg">
            {networksMatch ? (
                <div className="text-green-500">
                    <p>✅ Networks match! You can interact with the contract.</p>
                </div>
            ) : (
                <div className="text-red-500">
                    <p>❌ Networks do not match! Please switch to the correct network.</p>
                    <p>Wallet is on: {wallet.network?.chainId}</p>
                    <p>Contract is on: {contract.network?.chainId}</p>
                </div>
            )}
            <div>
                <button 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={onClick}
                >
                    Interact with Contract
                </button>
            </div>
        </div>
    );
};
