import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Contract } from '../../lib/types';
import { getContractAbiFromConfig } from '../../lib/utils';
import { deployee } from '../../config/config.deploy';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface ContractSelectorProps {
  provider: ethers.Provider;
  onContractCreated: (contract: {
    instance: ethers.Contract;
    address: string;
    name: string;
    abi: any[];
    functions?: any[];
    events?: any[];
  }) => void;
  existingAddress?: string;
  // For the original contract selection
  setExistingContract?: (contract: Contract) => void;
}

export function ContractSelector({ 
  provider, 
  onContractCreated, 
  existingAddress = '',
  setExistingContract 
}: ContractSelectorProps) {
  const [activeTab, setActiveTab] = useState<'select' | 'create'>('select');
  const [address, setAddress] = useState<string>(existingAddress);
  const [name, setName] = useState<string>('');
  const [abiInput, setAbiInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [contractDetails, setContractDetails] = useState<any>(null);

  // Template ABIs for common contract types
  const abiTemplates = [
    { label: 'ERC-20', value: 'erc20' },
    { label: 'ERC-721 (NFT)', value: 'erc721' },
    { label: 'ERC-1155 (Multi Token)', value: 'erc1155' },
  ];

  // Common ABIs
  const commonAbis = {
    erc20: [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address owner) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) returns (bool)",
      "event Transfer(address indexed from, address indexed to, uint256 value)",
      "event Approval(address indexed owner, address indexed spender, uint256 value)"
    ],
    erc721: [
      "function balanceOf(address owner) view returns (uint256)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function safeTransferFrom(address from, address to, uint256 tokenId)",
      "function transferFrom(address from, address to, uint256 tokenId)",
      "function approve(address to, uint256 tokenId)",
      "function getApproved(uint256 tokenId) view returns (address)",
      "function setApprovalForAll(address operator, bool approved)",
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
      "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
      "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
    ],
    erc1155: [
      "function balanceOf(address account, uint256 id) view returns (uint256)",
      "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
      "function setApprovalForAll(address operator, bool approved)",
      "function isApprovedForAll(address account, address operator) view returns (bool)",
      "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
      "function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)",
      "function uri(uint256 id) view returns (string)",
      "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
      "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)",
      "event ApprovalForAll(address indexed account, address indexed operator, bool approved)",
      "event URI(string value, uint256 indexed id)"
    ]
  };

  const loadTemplateAbi = (templateKey: string) => {
    const abi = commonAbis[templateKey as keyof typeof commonAbis];
    if (abi) {
      setAbiInput(JSON.stringify(abi, null, 2));
    }
  };

  // Original contract selection functionality
  async function handleSelectExistingContract(contractName: string) {
    if (!setExistingContract) return;
    
    setLoading(true);
    setError(null);
    try {
      const contractData = await getContractAbiFromConfig(contractName);
      if (contractData) {
        setExistingContract(contractData);
        setSuccess(true);
        setContractDetails({
          name: contractName,
          address: contractData.params?.address || 'N/A',
          network: contractData.network?.name || 'Unknown'
        });
      } else {
        setError('Failed to load contract data');
      }
    } catch (error) {
      setError(`Error loading contract: ${String(error)}`);
      console.error("Contract selection error:", error);
    } finally {
      setLoading(false);
    }
  }

  const validateAndCreateContract = async () => {
    // Reset states
    setError(null);
    setSuccess(false);
    setContractDetails(null);

    // Validate inputs
    if (!address) {
      setError("Contract address is required");
      return;
    }

    if (!ethers.isAddress(address)) {
      setError("Invalid Ethereum address");
      return;
    }

    if (!abiInput) {
      setError("ABI is required");
      return;
    }

    let parsedAbi: any[];
    try {
      // Check if the ABI is in string format or already an array
      parsedAbi = typeof abiInput === 'string' ? JSON.parse(abiInput) : abiInput;
    } catch (e) {
      setError("Invalid ABI JSON format");
      return;
    }

    setLoading(true);

    try {
      // Create a contract instance
      const contractInstance = new ethers.Contract(address, parsedAbi, provider);
      
      // Try to fetch some basic info if available (this helps verify the contract is accessible)
      let contractName = name;
      
      // If no name provided, try to get it from the contract
      if (!contractName) {
        try {
          // Check if the contract has a name() function
          if (contractInstance.interface.hasFunction("name")) {
            contractName = await contractInstance.name();
          } else {
            contractName = `Contract-${address.substring(0, 6)}`;
          }
        } catch (e) {
          contractName = `Contract-${address.substring(0, 6)}`;
        }
      }

      // Get contract functions
      const functions = Object.keys(contractInstance.interface.functions).map(fn => {
        const fragment = contractInstance.interface.functions[fn];
        return {
          name: fragment.name,
          type: fragment.type,
          inputs: fragment.inputs,
          outputs: fragment.outputs,
          signature: fragment.format()
        };
      });

      // Get contract events
      const events = Object.keys(contractInstance.interface.events).map(ev => {
        const fragment = contractInstance.interface.events[ev];
        return {
          name: fragment.name,
          inputs: fragment.inputs,
          signature: fragment.format()
        };
      });

      const contractInfo = {
        instance: contractInstance,
        address: address,
        name: contractName,
        abi: parsedAbi,
        functions,
        events
      };

      setContractDetails({
        name: contractName,
        address: address,
        functionCount: functions.length,
        eventCount: events.length
      });

      // Call the parent component's callback
      onContractCreated(contractInfo);
      
      setSuccess(true);
      setName(contractName); // Update the name field with the discovered name
    } catch (e: any) {
      console.error("Error creating contract:", e);
      setError(`Error creating contract: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setAddress('');
    setName('');
    setAbiInput('');
    setError(null);
    setSuccess(false);
    setContractDetails(null);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <span className="fas fa-file-contract mr-2"></span>
        Contract Selection
      </h2>
      
      {/* Tab selection */}
      <div className="flex mb-5 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('select')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative
            ${activeTab === 'select' 
              ? 'text-blue-400' 
              : 'text-gray-400 hover:text-gray-200'}`}
        >
          Select Deployed Contract
          {activeTab === 'select' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative
            ${activeTab === 'create' 
              ? 'text-blue-400' 
              : 'text-gray-400 hover:text-gray-200'}`}
        >
          Create Custom Contract
          {activeTab === 'create' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
          )}
        </button>
      </div>

      {/* Select from deployed contracts */}
      {activeTab === 'select' && (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm mb-4">
            Select from your deployed contracts:
          </p>
          
          {deployee.contractNames.length > 0 ? (
            <div className="bg-gray-800 p-4 rounded">
              <label className="block text-sm font-medium text-gray-300 mb-2">Deployed Contracts</label>
              <div className="space-y-2">
                {deployee.contractNames.map((contractName: string) => (
                  <button
                    key={contractName}
                    onClick={() => handleSelectExistingContract(contractName)}
                    className="w-full flex justify-between items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-left transition-colors"
                    disabled={loading}
                  >
                    <span className="text-white">{contractName}</span>
                    <span className="text-gray-400 text-xs">
                      <span className="fas fa-chevron-right"></span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded text-center">
              <p className="text-gray-400">No deployed contracts found in configuration.</p>
            </div>
          )}
        </div>
      )}

      {/* Create custom contract */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          {/* Address input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contract Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md 
                focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contract Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Token"
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md 
                focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* Template selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ABI Template</label>
            <div className="flex flex-wrap gap-2">
              {abiTemplates.map((template) => (
                <button
                  key={template.value}
                  onClick={() => loadTemplateAbi(template.value)}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm font-medium rounded-md 
                    text-blue-400 transition-colors"
                >
                  {template.label}
                </button>
              ))}
              <button
                onClick={() => setAbiInput('')}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm font-medium rounded-md 
                  text-gray-400 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          
          {/* ABI input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contract ABI</label>
            <textarea
              value={abiInput}
              onChange={(e) => setAbiInput(e.target.value)}
              placeholder="[{...}]"
              rows={6}
              className="w-full p-2.5 bg-gray-800 border border-gray-700 text-white rounded-md 
                font-mono text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">
              Paste the contract ABI JSON here or select a template
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between pt-2">
            <button
              onClick={clearForm}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Clear
            </button>
            <button
              onClick={validateAndCreateContract}
              disabled={loading}
              className={`px-4 py-2 rounded-md flex items-center ${
                loading
                  ? 'bg-blue-800 text-blue-100 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors`}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Connecting..." : "Connect to Contract"}
            </button>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mt-4 bg-red-900 bg-opacity-30 border border-red-500 text-white p-3 rounded-md">
          <div className="flex items-start">
            <span className="fas fa-exclamation-circle mt-0.5 mr-2 text-red-400"></span>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Success message */}
      {success && contractDetails && (
        <div className="mt-4 bg-green-900 bg-opacity-30 border border-green-500 text-white p-3 rounded-md">
          <div className="flex items-start">
            <span className="fas fa-check-circle mt-0.5 mr-2 text-green-400"></span>
            <div>
              <p className="font-medium">Contract connected successfully!</p>
              <ul className="mt-1 text-sm text-gray-300">
                <li><span className="text-gray-400">Name:</span> {contractDetails.name}</li>
                <li><span className="text-gray-400">Address:</span> {contractDetails.address?.substring(0, 8)}...{contractDetails.address?.substring(contractDetails.address.length - 6)}</li>
                {contractDetails.functionCount && <li><span className="text-gray-400">Functions:</span> {contractDetails.functionCount}</li>}
                {contractDetails.eventCount && <li><span className="text-gray-400">Events:</span> {contractDetails.eventCount}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
