import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface AbiComponentProps {
  address: string;
  abi: any[];
  provider: ethers.Provider;
  networkName?: string;
  contractName?: string;
}

interface FunctionFragment {
  name: string;
  inputs: any[];
  outputs?: any[];
  stateMutability?: string;
  type: string;
  signature: string;
}

interface EventFragment {
  name: string;
  inputs: any[];
  signature: string;
}

type TabType = 'read' | 'write' | 'events';

export function AbiComponent({ 
  address, 
  abi, 
  provider, 
  networkName, 
  contractName = 'Contract' 
}: AbiComponentProps) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [readFunctions, setReadFunctions] = useState<FunctionFragment[]>([]);
  const [writeFunctions, setWriteFunctions] = useState<FunctionFragment[]>([]);
  const [events, setEvents] = useState<EventFragment[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('read');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [functionInputs, setFunctionInputs] = useState<Record<string, any>>({});
  const [functionResults, setFunctionResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize contract and parse ABI
  useEffect(() => {
    if (address && abi && provider) {
      try {
        const contractInstance = new ethers.Contract(address, abi, provider);
        setContract(contractInstance);
        
        const readFns: FunctionFragment[] = [];
        const writeFns: FunctionFragment[] = [];
        const eventsList: EventFragment[] = [];
        
        // Parse interface for functions and events
        Object.keys(contractInstance.interface.functions).forEach(fn => {
          const fragment = contractInstance.interface.functions[fn];
          const funcInfo = {
            name: fragment.name,
            inputs: fragment.inputs,
            outputs: fragment.outputs,
            stateMutability: fragment.stateMutability,
            type: fragment.type,
            signature: fragment.format()
          };
          
          // Categorize functions as read or write
          if (fragment.stateMutability === 'view' || fragment.stateMutability === 'pure') {
            readFns.push(funcInfo);
          } else {
            writeFns.push(funcInfo);
          }
        });
        
        // Parse events
        Object.keys(contractInstance.interface.events).forEach(ev => {
          const fragment = contractInstance.interface.events[ev];
          eventsList.push({
            name: fragment.name,
            inputs: fragment.inputs,
            signature: fragment.format()
          });
        });
        
        // Sort by name for better organization
        setReadFunctions(readFns.sort((a, b) => a.name.localeCompare(b.name)));
        setWriteFunctions(writeFns.sort((a, b) => a.name.localeCompare(b.name)));
        setEvents(eventsList.sort((a, b) => a.name.localeCompare(b.name)));
        
        // Initialize input state for all functions
        const initialInputs: Record<string, any> = {};
        [...readFns, ...writeFns].forEach(fn => {
          initialInputs[fn.signature] = fn.inputs.map(() => '');
        });
        setFunctionInputs(initialInputs);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    }
  }, [address, abi, provider]);

  const toggleExpandItem = (signature: string) => {
    setExpandedItem(expandedItem === signature ? null : signature);
  };

  const handleInputChange = (signature: string, index: number, value: string) => {
    setFunctionInputs(prev => {
      const inputs = [...(prev[signature] || [])];
      inputs[index] = value;
      return { ...prev, [signature]: inputs };
    });
  };

  const callReadFunction = async (fn: FunctionFragment) => {
    if (!contract) return;
    
    setLoading(prev => ({ ...prev, [fn.signature]: true }));
    setErrors(prev => ({ ...prev, [fn.signature]: '' }));
    
    try {
      const inputs = functionInputs[fn.signature] || [];
      const result = await contract[fn.name](...inputs);
      setFunctionResults(prev => ({ ...prev, [fn.signature]: result }));
    } catch (error: any) {
      console.error(`Error calling ${fn.name}:`, error);
      setErrors(prev => ({ ...prev, [fn.signature]: error.message || 'Transaction failed' }));
    } finally {
      setLoading(prev => ({ ...prev, [fn.signature]: false }));
    }
  };

  const executeWriteFunction = async (fn: FunctionFragment) => {
    if (!contract) return;
    
    setLoading(prev => ({ ...prev, [fn.signature]: true }));
    setErrors(prev => ({ ...prev, [fn.signature]: '' }));
    
    try {
      const inputs = functionInputs[fn.signature] || [];
      
      // Get signer for write functions
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      const tx = await contractWithSigner[fn.name](...inputs);
      setFunctionResults(prev => ({ 
        ...prev, 
        [fn.signature]: {
          hash: tx.hash,
          status: 'Pending',
          timestamp: new Date().toISOString()
        } 
      }));
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      setFunctionResults(prev => ({ 
        ...prev, 
        [fn.signature]: {
          ...prev[fn.signature],
          status: receipt.status === 1 ? 'Success' : 'Failed',
          gasUsed: receipt.gasUsed?.toString(),
          blockNumber: receipt.blockNumber
        } 
      }));
    } catch (error: any) {
      console.error(`Error executing ${fn.name}:`, error);
      setErrors(prev => ({ ...prev, [fn.signature]: error.message || 'Transaction failed' }));
    } finally {
      setLoading(prev => ({ ...prev, [fn.signature]: false }));
    }
  };

  const renderFunctionInputs = (fn: FunctionFragment) => {
    return fn.inputs.map((input, index) => (
      <div key={`${fn.signature}-input-${index}`} className="mb-2">
        <label className="block text-sm text-gray-400 mb-1">
          {input.name || `param${index}`}: <span className="text-xs text-gray-500">{input.type}</span>
        </label>
        <input
          type="text"
          value={functionInputs[fn.signature]?.[index] || ''}
          onChange={(e) => handleInputChange(fn.signature, index, e.target.value)}
          placeholder={`${input.type}`}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    ));
  };

  const renderFunctionOutputs = (fn: FunctionFragment) => {
    const result = functionResults[fn.signature];
    const error = errors[fn.signature];
    
    if (error) {
      return (
        <div className="mt-3 p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded-md">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      );
    }
    
    if (!result) return null;

    // Format the result based on type
    let formattedResult;
    if (typeof result === 'object' && !Array.isArray(result) && result !== null) {
      if (result.hash) {
        // Transaction result
        return (
          <div className="mt-3 p-3 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-md">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-blue-400">Transaction:</span>
              <span className={`text-xs px-2 py-1 rounded ${
                result.status === 'Success' ? 'bg-green-900 text-green-300' : 
                result.status === 'Failed' ? 'bg-red-900 text-red-300' :
                'bg-yellow-900 text-yellow-300'
              }`}>
                {result.status}
              </span>
            </div>
            <div className="mt-2">
              <a 
                href={`https://etherscan.io/tx/${result.hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm break-all flex items-center"
              >
                {result.hash}
                <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            {result.blockNumber && (
              <p className="text-gray-400 text-xs mt-1">Block: {result.blockNumber}</p>
            )}
            {result.gasUsed && (
              <p className="text-gray-400 text-xs">Gas used: {result.gasUsed}</p>
            )}
          </div>
        );
      }

      // For BigNumber results
      if (ethers.BigNumber.isBigNumber(result)) {
        formattedResult = result.toString();
      } else {
        try {
          formattedResult = JSON.stringify(result, (key, value) => {
            if (typeof value === 'bigint') return value.toString();
            if (ethers.BigNumber.isBigNumber(value)) return value.toString();
            return value;
          }, 2);
        } catch (e) {
          formattedResult = 'Cannot display result';
        }
      }
    } else if (Array.isArray(result)) {
      try {
        formattedResult = JSON.stringify(result, (key, value) => {
          if (typeof value === 'bigint') return value.toString();
          if (ethers.BigNumber.isBigNumber(value)) return value.toString();
          return value;
        }, 2);
      } catch (e) {
        formattedResult = 'Cannot display result';
      }
    } else {
      formattedResult = String(result);
    }

    return (
      <div className="mt-3">
        <h4 className="text-sm font-medium text-gray-300 mb-1">Result:</h4>
        <pre className="bg-gray-800 p-3 rounded-md text-green-300 overflow-x-auto text-sm whitespace-pre-wrap">
          {formattedResult}
        </pre>
      </div>
    );
  };

  const renderReadFunctions = () => {
    if (readFunctions.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          No read functions found in this contract.
        </div>
      );
    }

    return readFunctions.map((fn) => (
      <div 
        key={fn.signature}
        className="mb-3 border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-blue-500"
      >
        <div 
          className="flex justify-between items-center p-3 bg-gray-800 cursor-pointer hover:bg-gray-750"
          onClick={() => toggleExpandItem(fn.signature)}
        >
          <div>
            <h3 className="font-medium text-white">{fn.name}</h3>
            <p className="text-xs text-gray-400 font-mono">{fn.signature}</p>
          </div>
          <div className="flex items-center">
            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded mr-2">Read</span>
            <svg 
              className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedItem === fn.signature ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {expandedItem === fn.signature && (
          <div className="p-3 bg-gray-900 border-t border-gray-700 animate-fadeIn">
            {fn.inputs.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Inputs:</h4>
                {renderFunctionInputs(fn)}
              </div>
            )}
            
            <div className="flex">
              <button
                onClick={() => callReadFunction(fn)}
                disabled={loading[fn.signature]}
                className={`px-4 py-2 rounded-md text-sm ${
                  loading[fn.signature]
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                } flex items-center`}
              >
                {loading[fn.signature] && (
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading[fn.signature] ? 'Loading...' : 'Execute'}
              </button>
            </div>
            
            {renderFunctionOutputs(fn)}
            
            {fn.outputs && fn.outputs.length > 0 && !functionResults[fn.signature] && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-300 mb-1">Returns:</h4>
                <div className="text-xs text-gray-400">
                  {fn.outputs.map((output, i) => (
                    <div key={i} className="py-1">
                      {output.name ? `${output.name}: ` : ''}<span className="text-yellow-300">{output.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    ));
  };

  const renderWriteFunctions = () => {
    if (writeFunctions.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          No write functions found in this contract.
        </div>
      );
    }

    return writeFunctions.map((fn) => (
      <div 
        key={fn.signature}
        className="mb-3 border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-purple-500"
      >
        <div 
          className="flex justify-between items-center p-3 bg-gray-800 cursor-pointer hover:bg-gray-750"
          onClick={() => toggleExpandItem(fn.signature)}
        >
          <div>
            <h3 className="font-medium text-white">{fn.name}</h3>
            <p className="text-xs text-gray-400 font-mono">{fn.signature}</p>
          </div>
          <div className="flex items-center">
            <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded mr-2">Write</span>
            <svg 
              className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedItem === fn.signature ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {expandedItem === fn.signature && (
          <div className="p-3 bg-gray-900 border-t border-gray-700 animate-fadeIn">
            {fn.inputs.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Inputs:</h4>
                {renderFunctionInputs(fn)}
              </div>
            )}
            
            <div className="flex">
              <button
                onClick={() => executeWriteFunction(fn)}
                disabled={loading[fn.signature]}
                className={`px-4 py-2 rounded-md text-sm ${
                  loading[fn.signature]
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 transition-colors'
                } flex items-center`}
              >
                {loading[fn.signature] && (
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading[fn.signature] ? 'Processing...' : 'Execute Transaction'}
              </button>
            </div>
            
            {renderFunctionOutputs(fn)}
          </div>
        )}
      </div>
    ));
  };

  const renderEvents = () => {
    if (events.length === 0) {
      return (
        <div className="text-center text-gray-400 py-8">
          No events found in this contract.
        </div>
      );
    }

    return events.map((event) => (
      <div 
        key={event.signature}
        className="mb-3 border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-yellow-500"
      >
        <div 
          className="flex justify-between items-center p-3 bg-gray-800 cursor-pointer hover:bg-gray-750"
          onClick={() => toggleExpandItem(event.signature)}
        >
          <div>
            <h3 className="font-medium text-white">{event.name}</h3>
            <p className="text-xs text-gray-400 font-mono">{event.signature}</p>
          </div>
          <div className="flex items-center">
            <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded mr-2">Event</span>
            <svg 
              className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedItem === event.signature ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {expandedItem === event.signature && (
          <div className="p-3 bg-gray-900 border-t border-gray-700 animate-fadeIn">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Parameters:</h4>
            <div className="space-y-1">
              {event.inputs.map((input, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="text-gray-400 w-20">{input.indexed ? 'Indexed' : 'Not indexed'}</span>
                  <span className="text-gray-300 mr-2">{input.name || `param${index}`}:</span>
                  <span className="text-yellow-300 text-xs">{input.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="fas fa-file-contract mr-2 text-blue-400"></span>
          {contractName}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded-md">
            <div className="text-sm text-gray-400">Address</div>
            <div className="font-mono text-white break-all text-sm">{address}</div>
          </div>
          
          {networkName && (
            <div className="bg-gray-800 p-3 rounded-md">
              <div className="text-sm text-gray-400">Network</div>
              <div className="text-white">{networkName}</div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
          <div className="flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400 mr-1.5"></span>
            <span>{readFunctions.length} Read Functions</span>
          </div>
          <div className="flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-400 mr-1.5"></span>
            <span>{writeFunctions.length} Write Functions</span>
          </div>
          <div className="flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 mr-1.5"></span>
            <span>{events.length} Events</span>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('read')}
            className={`py-2 px-3 text-sm font-medium rounded-t-md transition-colors relative ${
              activeTab === 'read' 
                ? 'bg-gray-800 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Read Functions
            {activeTab === 'read' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`py-2 px-3 text-sm font-medium rounded-t-md transition-colors relative ${
              activeTab === 'write' 
                ? 'bg-gray-800 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Write Functions
            {activeTab === 'write' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-2 px-3 text-sm font-medium rounded-t-md transition-colors relative ${
              activeTab === 'events' 
                ? 'bg-gray-800 text-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Events
            {activeTab === 'events' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500"></div>
            )}
          </button>
        </nav>
      </div>

      <div className="transition-opacity duration-200">
        {activeTab === 'read' && renderReadFunctions()}
        {activeTab === 'write' && renderWriteFunctions()}
        {activeTab === 'events' && renderEvents()}
      </div>
    </div>
  );
}
