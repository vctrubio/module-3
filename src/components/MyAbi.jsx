import React, { useState, useEffect } from 'react';

// Contract Selection component
const ContractSelector = ({ configFiles, selectedConfig, onSelect }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">Available Contracts:</h3>
    <div className="flex flex-wrap gap-2">
      {configFiles.map((configName) => (
        <button
          key={configName}
          onClick={() => onSelect(configName)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedConfig === configName
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
          }`}
        >
          {configName}
        </button>
      ))}
    </div>
  </div>
);

// Network Information component
const NetworkInfo = ({ network }) => (
  <div>
    <h4 className="font-medium text-lg mb-2">Network</h4>
    <div className="bg-gray-700 text-gray-100 p-3 rounded">
      <p>Name: <span className="text-green-300">{network?.name}</span></p>
      <p>Chain ID: <span className="text-green-300">{network?.chainId}</span></p>
      <p className="truncate">Address: <span className="text-green-300">{network?.address}</span></p>
    </div>
  </div>
);

// Contract Information component
const ContractInfo = ({ contract }) => (
  <div>
    <h4 className="font-medium text-lg mb-2">Contract</h4>
    <div className="bg-gray-700 text-gray-100 p-3 rounded">
      <p>Name: <span className="text-green-300">{contract?.name}</span></p>
      <p className="truncate">Owner: <span className="text-green-300">{contract?.owner}</span></p>
    </div>
  </div>
);

// ABI Functions component
const AbiFunctions = ({ abi }) => {
  const functions = abi?.filter(item => item.type === "function") || [];
  
  return (
    <div>
      <h4 className="font-medium text-lg mb-2">ABI Functions ({functions.length})</h4>
      <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto">
        {functions.map((func, index) => (
          <div key={index} className="mb-3 p-2 border-b border-gray-700">
            <span className="text-yellow-400 font-medium">{func.name}</span>
            <span className="text-gray-400"> ({func.inputs?.map(input => `${input.type} ${input.name}`).join(', ')})</span>
            <span className="text-gray-400"> → {func.outputs?.map(output => output.type).join(', ') || 'void'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Contract Data Display component
const ContractDisplay = ({ contractData }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2">
        Contract: {contractData.contract?.name}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <NetworkInfo network={contractData.network} />
        <ContractInfo contract={contractData.contract} />
      </div>
      
      <AbiFunctions abi={contractData.contract?.abi} />
    </div>
  );
};

// Main component
const MyAbi = ({ contractInstance, setContractInstance }) => {
  const [configFiles, setConfigFiles] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set the selected config from the parent if available and not already set
  useEffect(() => {
    if (contractInstance && !selectedConfig) {
      setSelectedConfig(contractInstance.name);
      setContractData(contractInstance);
      setLoading(false);
    }
  }, [contractInstance, selectedConfig]);

  // Fetch available config files
  useEffect(() => {
    const fetchConfigFiles = async () => {
      try {
        // In a real app, you'd need a server endpoint to list files
        // This is a simulated approach for demonstration
        const files = ['HouseUrban']; // Add more config file names as they become available
        setConfigFiles(files);
      } catch (err) {
        setError('Failed to fetch config files');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigFiles();
  }, []);

  // Load selected config file
  const loadConfigFile = async (configName) => {
    try {
      setLoading(true);
      // Dynamic import of the config file
      const configModule = await import(`../config.${configName}.json`);
      const configData = configModule.default || configModule;
      
      // Create a contractInstance object with specific shape
      const newContractInstance = {
        name: configName,
        contract: {
          name: configData.contract?.name,
          address: configData.network?.address,
          abi: configData.contract?.abi
        },
        network: {
          name: configData.network?.name,
          chainId: configData.network?.chainId
        }
      };
      
      // Update local state
      setContractData(configData);
      setSelectedConfig(configName);
      
      // Send contract information up to parent component
      setContractInstance(newContractInstance);
    } catch (err) {
      setError(`Failed to load config file: ${configName}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && configFiles.length === 0) {
    return <div className="text-center p-4">Loading available contracts...</div>;
  }

  if (error && configFiles.length === 0) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Smart Contract Selection</h2>
      
      <ContractSelector 
        configFiles={configFiles} 
        selectedConfig={selectedConfig} 
        onSelect={loadConfigFile} 
      />

      {loading && selectedConfig && (
        <div className="text-center p-4">Loading contract data...</div>
      )}

      {error && selectedConfig && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
      )}

      {contractData && !loading && (
        <ContractDisplay contractData={contractData} />
      )}
    </div>
  );
};

export default MyAbi;
