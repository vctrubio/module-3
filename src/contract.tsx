import React, { useState } from 'react';
import { ethers } from 'ethers';

// Interface for contract parameters
interface ContractParams {
  address: string;
  contractAbi: ethers.ContractInterface;
  signer?: ethers.Signer;
}

// Interface for contract state
interface ContractState {
  contract: ethers.Contract | null;
  isLoading: boolean;
  error: string | null;
}

const Contract: React.FC<ContractParams> = ({ address, contractAbi, signer }) => {
  // State for contract instance
  const [contractState, setContractState] = useState<ContractState>({
    contract: null,
    isLoading: false,
    error: null,
  });

  // Initialize contract
  const initContract = async () => {
    setContractState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const contract = new ethers.Contract(address, contractAbi, signer);
      setContractState({
        contract,
        isLoading: false,
        error: null,
      });
      return contract;
    } catch (error) {
      setContractState({
        contract: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return null;
    }
  };

  // Call a contract method
  const call = async (methodName: string, ...args: any[]) => {
    if (!contractState.contract) {
      await initContract();
    }
    
    if (contractState.contract) {
      try {
        return await contractState.contract[methodName](...args);
      } catch (error) {
        throw new Error(`Error calling ${methodName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    throw new Error('Contract not initialized');
  };

  return {
    contract: contractState.contract,
    isLoading: contractState.isLoading,
    error: contractState.error,
    call,
    initContract,
  };
};

// Hook for using the contract
export const useContract = (address: string, contractAbi: ethers.ContractInterface, signer?: ethers.Signer) => {
  return Contract({ address, contractAbi, signer });
};

export default Contract;
