import { ethers } from 'ethers';
/*
Signer
Transaction
Contract
Receipt

An RPC URL (Remote Procedure Call URL) is the address of an Ethereum node that your application uses to communicate with the Ethereum blockchain.

*/

export async function getConnection() {
    if (!window.ethereum) {
        return { error: 'No Ethereum provider found, please install.', status: 400 };
    }

    try {
        console.log('Initializing BrowserProvider...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log('Requesting accounts...');
        await provider.send("eth_requestAccounts", []);
        console.log('Getting signer...');
        const signer = await provider.getSigner();
        console.log('Getting address...');
        const address = await signer.getAddress();
        console.log('Connected address:', address);

        console.log('Getting network info...');
        const network = await provider.getNetwork();
        console.log('Detected network:', network);

        console.log('Getting balance...');
        const balance = await provider.getBalance(address);


        return {
            address,
            network: {
                chainId: network.chainId.toString(),
                name: network.name,
                // rpcUrl: rpcUrl //dont know what this does yet
            },
            balance: {
                wei: balance.toString(),
                formatted: ethers.formatEther(balance),
                value: parseFloat(ethers.formatEther(balance))
            },
            apiResponse: {},
            status: 200
        };
    } catch (error) {
        console.error('Error in getConnection:', error);
        return {
            address: null,
            chainId: null,
            balance: null,
            apiResponse: { error: error instanceof Error ? error.message : String(error) },
            status: 400
        };
    }
}