import React, { useState, useEffect } from 'react';
import configData from '../config.HouseUrban.json';
import testData from '../config.Test.json';
import ContractInteraction from './ContractInteraction';

// Provider Section Component
const ProviderSection = ({
  provider,
  showCustomProviderForm,
  customProvider,
  connectProviderFromConfig,
  connectProviderFromTest,
  connectCustomProvider,
  setShowCustomProviderForm,
  handleCustomProviderChange
}) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Provider</h3>
      {provider ? (
        <div className="text-sm">
          <p>Name: {provider.name}</p>
          <p>Network: {provider.network}</p>
          <p>Chain ID: {provider.chainId}</p>
          {provider.url && <p>URL: {provider.url}</p>}
        </div>
      ) : (
        <>
          <p className="text-gray-500">No provider connected</p>

          {showCustomProviderForm ? (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Provider Name"
                value={customProvider.name}
                onChange={handleCustomProviderChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="network"
                placeholder="Network"
                value={customProvider.network}
                onChange={handleCustomProviderChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="chainId"
                placeholder="Chain ID"
                value={customProvider.chainId}
                onChange={handleCustomProviderChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex space-x-2">
                <button
                  onClick={connectCustomProvider}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 flex-1"
                >
                  Connect Custom
                </button>
                <button
                  onClick={() => setShowCustomProviderForm(false)}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-3">
              <button 
                onClick={connectProviderFromConfig}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 flex-1"
              >
                Use Config Data
              </button>
              <button 
                onClick={connectProviderFromTest}
                className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-300 flex-1"
              >
                Use Test Data
              </button>
              <button 
                onClick={() => setShowCustomProviderForm(true)}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 flex-1"
              >
                Input Custom
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Contract Section Component
const ContractSection = ({
  contract,
  provider,
  showCustomContractForm,
  customContract,
  connectContractFromConfig,
  connectContractFromTest,
  connectCustomContract,
  setShowCustomContractForm,
  handleCustomContractChange
}) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Contract</h3>
      {contract ? (
        <div className="text-sm">
          <p>Name: {contract.name}</p>
          <p>Address: {contract.address}</p>
          {contract.owner && <p>Owner: {contract.owner}</p>}
          <p>ABI: {contract.abi.length} methods available</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500">No contract connected</p>
          
          {showCustomContractForm ? (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Contract Name"
                value={customContract.name}
                onChange={handleCustomContractChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Contract Address"
                value={customContract.address}
                onChange={handleCustomContractChange}
                className="w-full p-2 border rounded"
              />
              <textarea
                name="abi"
                placeholder="Contract ABI (comma-separated methods)"
                value={customContract.abi}
                onChange={handleCustomContractChange}
                className="w-full p-2 border rounded h-24"
              />
              <div className="flex space-x-2">
                <button
                  onClick={connectCustomContract}
                  disabled={!provider}
                  className={`px-3 py-2 text-white rounded transition duration-300 flex-1 ${!provider ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'}`}
                >
                  Connect Custom
                </button>
                <button
                  onClick={() => setShowCustomContractForm(false)}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={connectContractFromConfig}
                disabled={!provider}
                className={`px-3 py-2 text-white rounded transition duration-300 flex-1 ${!provider ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'}`}
              >
                Use Config Data
              </button>
              <button
                onClick={connectContractFromTest}
                disabled={!provider}
                className={`px-3 py-2 text-white rounded transition duration-300 flex-1 ${!provider ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                Use Test Data
              </button>
              <button
                onClick={() => setShowCustomContractForm(true)}
                disabled={!provider}
                className={`px-3 py-2 text-white rounded transition duration-300 flex-1 ${!provider ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
              >
                Input Custom
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Signer Section Component
const SignerSection = ({ signer }) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Signer</h3>
      {signer ? (
        <div className="text-sm">
          <p>Address: {signer}</p>
        </div>
      ) : (
        <p className="text-gray-500">No wallet connected</p>
      )}
    </div>
  );
};

// Main Component
const EthersComponent = ({ signerAddress }) => {
  const [ethersState, setEthersState] = useState({
    provider: null,
    contract: null,
    signer: signerAddress
  });

  const [showCustomProviderForm, setShowCustomProviderForm] = useState(false);
  const [showCustomContractForm, setShowCustomContractForm] = useState(false);

  const [customProvider, setCustomProvider] = useState({
    name: "",
    network: "",
    chainId: ""
  });

  const [customContract, setCustomContract] = useState({
    name: "",
    address: "",
    abi: ""
  });

  // Update signer when signerAddress changes
  useEffect(() => {
    setEthersState(prevState => ({
      ...prevState,
      signer: signerAddress
    }));
  }, [signerAddress]);

  const connectProviderFromConfig = () => {
    setEthersState(prevState => ({
      ...prevState,
      provider: {
        name: configData.network.name,
        network: configData.network.name,
        chainId: configData.network.chainId,
        url: configData.network.url
      }
    }));
    setShowCustomProviderForm(false);
  };

  const connectProviderFromTest = () => {
    setEthersState(prevState => ({
      ...prevState,
      provider: {
        name: testData.network.name,
        network: testData.network.name,
        chainId: testData.network.chainId,
        url: testData.network.url
      }
    }));
    setShowCustomProviderForm(false);
  };

  const connectContractFromConfig = () => {
    if (!ethersState.provider) {
      alert("Please connect to a provider first");
      return;
    }

    setEthersState(prevState => ({
      ...prevState,
      contract: {
        name: configData.contract.name,
        address: configData.network.address,
        owner: configData.contract.owner,
        abi: configData.contract.abi
      }
    }));
    setShowCustomContractForm(false);
  };

  const connectContractFromTest = () => {
    if (!ethersState.provider) {
      alert("Please connect to a provider first");
      return;
    }

    setEthersState(prevState => ({
      ...prevState,
      contract: {
        name: testData.contract.name,
        address: testData.network.address,
        owner: testData.contract.owner,
        abi: testData.contract.abi
      }
    }));
    setShowCustomContractForm(false);
  };

  const connectCustomProvider = () => {
    if (!customProvider.name || !customProvider.network || !customProvider.chainId) {
      alert("Please fill all provider fields");
      return;
    }

    setEthersState(prevState => ({
      ...prevState,
      provider: {
        name: customProvider.name,
        network: customProvider.network,
        chainId: parseInt(customProvider.chainId)
      }
    }));
    setShowCustomProviderForm(false);
  };

  const connectCustomContract = () => {
    if (!ethersState.provider) {
      alert("Please connect to a provider first");
      return;
    }

    if (!customContract.name || !customContract.address || !customContract.abi) {
      alert("Please fill all contract fields");
      return;
    }

    setEthersState(prevState => ({
      ...prevState,
      contract: {
        name: customContract.name,
        address: customContract.address,
        abi: customContract.abi.split(',')
      }
    }));
    setShowCustomContractForm(false);
  };

  const handleCustomProviderChange = (e) => {
    const { name, value } = e.target;
    setCustomProvider(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomContractChange = (e) => {
    const { name, value } = e.target;
    setCustomContract(prev => ({ ...prev, [name]: value }));
  };

  const simulateContractCall = () => {
    if (!ethersState.contract || !ethersState.signer) {
      alert("Please connect to a contract and wallet first");
      return;
    }

    alert(`Simulating contract call from ${ethersState.signer} to ${ethersState.contract.address}`);
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Lets Interact</h2>

      {/* Provider Section */}
      <ProviderSection
        provider={ethersState.provider}
        showCustomProviderForm={showCustomProviderForm}
        customProvider={customProvider}
        connectProviderFromConfig={connectProviderFromConfig}
        connectProviderFromTest={connectProviderFromTest}
        connectCustomProvider={connectCustomProvider}
        setShowCustomProviderForm={setShowCustomProviderForm}
        handleCustomProviderChange={handleCustomProviderChange}
      />

      {/* Contract Section */}
      <ContractSection
        contract={ethersState.contract}
        provider={ethersState.provider}
        showCustomContractForm={showCustomContractForm}
        customContract={customContract}
        connectContractFromConfig={connectContractFromConfig}
        connectContractFromTest={connectContractFromTest}
        connectCustomContract={connectCustomContract}
        setShowCustomContractForm={setShowCustomContractForm}
        handleCustomContractChange={handleCustomContractChange}
      />

      {/* Signer Section */}
      <SignerSection signer={ethersState.signer} />

      {/* Contract Interaction Section */}
      {ethersState.contract && ethersState.provider && (
        <ContractInteraction 
          contract={ethersState.contract} 
          signer={ethersState.signer}
        />
      )}

      {/* Simulate Contract Call Button - Can be removed if using ContractInteraction */}
      {!ethersState.contract && (
        <button 
          onClick={simulateContractCall}
          disabled={!ethersState.contract || !ethersState.signer}
          className={`w-full px-4 py-3 text-white rounded-md ${!ethersState.contract || !ethersState.signer ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} transition duration-300`}
        >
          Simulate Contract Call
        </button>
      )}
    </div>
  );
};

export default EthersComponent;
