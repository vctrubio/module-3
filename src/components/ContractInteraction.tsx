import React from 'react';
import { Wallet, Contract } from '../../lib/types';

interface ContractInteractionProps {
    wallet: Wallet;
    contract: Contract;
}

export const ContractInteraction: React.FC<ContractInteractionProps> = ({ wallet, contract }) => {
    const networksMatch = wallet.network?.chainId == contract.network?.chainId;

    return (
        <div className="mt-8 text-center p-4 border-2 rounded-lg">
            <p className="text-xl mb-4">We have contract and wallet. Let's interact!</p>
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
        </div>
    );
};
