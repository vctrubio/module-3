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
