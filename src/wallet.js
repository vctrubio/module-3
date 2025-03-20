import { ethers } from 'ethers';

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return accounts[0];
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            throw error;
        }
    } else {
        alert("Please install MetaMask!");
        throw new Error("MetaMask not installed");
    }
};

export const disconnectWallet = () => {
    //you cannot directy disconeect from wallet?
    return null;
};

/**
 * Prompts the user to switch to the specified network
 * @param {string} chainId - The chain ID to switch to (in hex or decimal)
 * @returns {Promise<boolean>} - Returns true if switch was successful
 */
export const switchNetwork = async (chainId) => {
    if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return false;
    }

    // Convert decimal chainId to hex if it's not already in hex format
    const chainIdHex = chainId.toString().startsWith('0x') 
        ? chainId 
        : `0x${parseInt(chainId).toString(16)}`;
    
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
        });
        return true;
    } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        if (error.code === 4902) {
            try {
                // Special handling for Ganache localhost network
                if (chainId === '1337' || chainIdHex === '0x539') {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x539', // 1337 in hex
                                chainName: 'Ganache Localhost',
                                nativeCurrency: {
                                    name: 'ETH',
                                    symbol: 'ETH',
                                    decimals: 18
                                },
                                rpcUrls: ['http://localhost:8585'],
                                blockExplorerUrls: []
                            }
                        ]
                    });
                    
                    // Try switching again after adding the network
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: chainIdHex }],
                    });
                    return true;
                } else {
                    alert("This network is not available in your MetaMask, please add it manually.");
                }
            } catch (addError) {
                console.error("Error adding the network:", addError);
                alert("Failed to add the network. " + addError.message);
                return false;
            }
        } else {
            console.error("Error switching network:", error);
            alert("Failed to switch network. " + error.message);
        }
        return false;
    }
};

export async function getEthers() {
    try {
        console.log('one')
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        await provider.send("eth_requestAccounts", []);
        
        const network = await provider.getNetwork();
        console.log('two')
        
        const blockNumber = await provider.getBlockNumber();
        console.log('three')
        
        const feeData = await provider.getFeeData();
        console.log('four')
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        
        console.log('five')
        
        return {
            connected: true,
            address,
            provider,
            network: {
                name: network.name,
                chainId: network.chainId.toString()
            },
            blockNumber: blockNumber,
            feeData: feeData,
            balance: {
                wei: balance.toString(),
                ether: ethers.formatEther(balance)
            },
            signer
        };
    } catch (error) {
        return {
            connected: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
