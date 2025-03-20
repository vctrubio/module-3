import React, { useState } from 'react';

// Function Item Component for Read Functions
const ReadFunctionItem = ({ func, contractAddress, signer }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});

  const handleParamChange = (e, paramName) => {
    setParams({
      ...params,
      [paramName]: e.target.value
    });
  };

  const callReadFunction = async () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      // Mock results based on function name
      let mockResult;
      switch (func.name) {
        case 'balanceOf':
          mockResult = '3'; // Mock token balance
          break;
        case 'symbol':
          mockResult = 'HU'; // Mock symbol
          break;
        case 'tokenName':
          mockResult = 'House Urban'; // Mock name
          break;
        case 'FRONT':
          mockResult = '1'; // Mock token ID
          break;
        case 'MIDDLE':
          mockResult = '2'; // Mock token ID
          break;
        case 'BACK':
          mockResult = '3'; // Mock token ID
          break;
        case 'uri':
          mockResult = 'https://house-urban.example/metadata/{id}.json'; // Mock URI
          break;
        case 'isApprovedForAll':
          mockResult = 'false'; // Mock approval status
          break;
        case 'supportsInterface':
          mockResult = 'true'; // Mock interface support
          break;
        default:
          mockResult = 'No data available';
      }
      setResult(mockResult);
      setLoading(false);
    }, 500);
  };

  // Only show input fields if the function has parameters
  const hasParameters = func.inputs && func.inputs.length > 0;

  return (
    <div className="mb-4 p-3 border rounded-lg bg-blue-50">
      <h4 className="font-medium mb-2">{func.name}</h4>
      {hasParameters && (
        <div className="mb-3 space-y-2">
          {func.inputs.map((input, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="text-sm text-gray-600">
                {input.name || `param${idx}`} ({input.type})
              </label>
              <input
                type="text"
                placeholder={`Enter ${input.type}`}
                className="p-1 border rounded"
                onChange={(e) => handleParamChange(e, input.name || `param${idx}`)}
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          onClick={callReadFunction}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Call'}
        </button>
        {result !== null && (
          <div className="ml-3 p-2 bg-gray-100 rounded flex-1">
            <span className="text-sm font-medium">Result: </span>
            <span className="text-sm">{result}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Function Item Component for Write Functions
const WriteFunctionItem = ({ func, contractAddress, signer }) => {
  const [status, setStatus] = useState(null); // 'success', 'error', 'pending'
  const [params, setParams] = useState({});
  const [txHash, setTxHash] = useState(null);

  const handleParamChange = (e, paramName) => {
    setParams({
      ...params,
      [paramName]: e.target.value
    });
  };

  const callWriteFunction = async () => {
    if (!signer) {
      setStatus('error');
      return;
    }

    setStatus('pending');
    
    // Simulate transaction
    setTimeout(() => {
      // Generate a mock transaction hash
      const mockTxHash = '0x' + Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setTxHash(mockTxHash);
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="mb-4 p-3 border rounded-lg bg-green-50">
      <h4 className="font-medium mb-2">{func.name}</h4>
      
      <div className="mb-3 space-y-2">
        {func.inputs.map((input, idx) => (
          <div key={idx} className="flex flex-col">
            <label className="text-sm text-gray-600">
              {input.name || `param${idx}`} ({input.type})
            </label>
            <input
              type="text"
              placeholder={`Enter ${input.type}`}
              className="p-1 border rounded"
              onChange={(e) => handleParamChange(e, input.name || `param${idx}`)}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-3">
        <button
          onClick={callWriteFunction}
          className={`px-3 py-1 text-white rounded transition duration-300 ${
            !signer 
              ? 'bg-gray-400' 
              : status === 'pending' 
                ? 'bg-yellow-500' 
                : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={!signer || status === 'pending'}
        >
          {status === 'pending' ? 'Processing...' : 'Execute'}
        </button>
        
        {status && (
          <div className={`mt-2 p-2 rounded ${
            status === 'success' ? 'bg-green-100' : 
            status === 'error' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            {status === 'success' && (
              <>
                <p className="text-sm font-medium text-green-800">Transaction sent!</p>
                <p className="text-xs text-gray-700 break-all">TX: {txHash}</p>
              </>
            )}
            {status === 'error' && (
              <p className="text-sm font-medium text-red-800">
                Error: Wallet connection required
              </p>
            )}
            {status === 'pending' && (
              <p className="text-sm font-medium text-yellow-800">
                Sending transaction...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Contract Interaction Component
const ContractInteraction = ({ contract, signer }) => {
  const [activeTab, setActiveTab] = useState('read');
  
  // Mock contract details
  const contractDetails = {
    name: contract.name || 'Unknown Contract',
    address: contract.address,
    tokenType: 'ERC1155',
    tokenName: 'House Urban',
    owner: contract.owner
  };

  // Filter ABI based on function type
  const getReadFunctions = () => {
    return contract.abi.filter(item => 
      item.type === 'function' && 
      (item.stateMutability === 'view' || item.stateMutability === 'pure')
    );
  };

  const getWriteFunctions = () => {
    return contract.abi.filter(item => 
      item.type === 'function' && 
      item.stateMutability !== 'view' && 
      item.stateMutability !== 'pure'
    );
  };

  const readFunctions = getReadFunctions();
  const writeFunctions = getWriteFunctions();

  return (
    <div className="mt-6 border rounded-lg shadow-md overflow-hidden">
      {/* Contract Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{contractDetails.name}</h3>
            <p className="text-sm text-gray-300">{contractDetails.tokenType} | {contractDetails.tokenName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Address:</p>
            <p className="text-sm">{contractDetails.address.substring(0, 8)}...{contractDetails.address.substring(36)}</p>
          </div>
        </div>
        {contractDetails.owner && (
          <p className="text-xs mt-2 text-gray-400">
            Owner: {contractDetails.owner.substring(0, 8)}...{contractDetails.owner.substring(36)}
          </p>
        )}
      </div>
      
      {/* Function Tabs */}
      <div className="flex border-b">
        <button 
          className={`flex-1 py-2 px-4 ${activeTab === 'read' ? 'bg-blue-50 border-b-2 border-blue-500' : 'bg-gray-50'}`}
          onClick={() => setActiveTab('read')}
        >
          Read Functions
        </button>
        <button 
          className={`flex-1 py-2 px-4 ${activeTab === 'write' ? 'bg-green-50 border-b-2 border-green-500' : 'bg-gray-50'}`}
          onClick={() => setActiveTab('write')}
        >
          Write Functions
        </button>
      </div>
      
      {/* Function Lists */}
      <div className="p-4">
        {activeTab === 'read' ? (
          <div>
            <h3 className="text-lg font-medium mb-3">Read Contract State</h3>
            {readFunctions.length > 0 ? (
              readFunctions.map((func, idx) => (
                <ReadFunctionItem 
                  key={idx} 
                  func={func} 
                  contractAddress={contractDetails.address}
                  signer={signer}
                />
              ))
            ) : (
              <p className="text-gray-500">No read functions available</p>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-3">Execute Contract Functions</h3>
            {writeFunctions.length > 0 ? (
              writeFunctions.map((func, idx) => (
                <WriteFunctionItem 
                  key={idx} 
                  func={func} 
                  contractAddress={contractDetails.address}
                  signer={signer}
                />
              ))
            ) : (
              <p className="text-gray-500">No write functions available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractInteraction;
