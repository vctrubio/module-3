import React, { useState } from 'react';
import { AppleNavBar } from './AppleNavBar';
import { ethers } from 'ethers';

interface TokenInfoProps {
    tokenAddress: string;
    provider: ethers.Provider;
    walletAddress: string;
}

const navIcons = [
    {
        color: "#880080", // Purple
        action: () => {
            console.log('exit');
        },
        message: "Exit"
    },
    {
        color: "#A9A9A9", // Dark Grey
        action: () => {
            console.log('minimize');
        },
        message: "Minimize"
    },
    {
        color: "#00001F", // Dark Blue
        action: () => {
            console.log('share');
        },
        message: "Share..."
    },
];

export function TokenInfo({ tokenAddress, provider, walletAddress }: TokenInfoProps) {
    const [tokenData, setTokenData] = useState<any>(null);
    const [tokenId, setTokenId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // ERC-1155 ABI for basic interactions
    const erc1155Abi = [
        "function balanceOf(address account, uint256 id) view returns (uint256)",
        "function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])",
        "function isApprovedForAll(address account, address operator) view returns (bool)",
        "function uri(uint256 id) view returns (string)",
        "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
        "function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)",
        "function setApprovalForAll(address operator, bool approved)"
    ];

    // Methods categorized by functionality
    const erc1155Methods = [
        {
            category: "Balance & Information",
            methods: [
                { name: "balanceOf(account, id)", desc: "Get token balance for a specific token ID" },
                { name: "balanceOfBatch(accounts[], ids[])", desc: "Get multiple balances in a single call" },
                { name: "uri(id)", desc: "Get metadata URI for a specific token ID" },
            ]
        },
        {
            category: "Transfers",
            methods: [
                { name: "safeTransferFrom(from, to, id, amount, data)", desc: "Transfer tokens to another address" },
                { name: "safeBatchTransferFrom(from, to, ids[], amounts[], data)", desc: "Transfer multiple tokens in one transaction" },
            ]
        },
        {
            category: "Approvals",
            methods: [
                { name: "setApprovalForAll(operator, approved)", desc: "Authorize an operator to manage all your tokens" },
                { name: "isApprovedForAll(owner, operator)", desc: "Check if operator is approved to manage all tokens" },
            ]
        },
        {
            category: "Events",
            methods: [
                { name: "TransferSingle", desc: "Emitted when a token is transferred" },
                { name: "TransferBatch", desc: "Emitted when multiple tokens are transferred" },
                { name: "ApprovalForAll", desc: "Emitted when approval status changes" },
                { name: "URI", desc: "Emitted when token URI changes" },
            ]
        },
    ];
    
    // Sample function to fetch token balance
    const fetchTokenBalance = async () => {
        if (!tokenAddress || !tokenId || !ethers.isAddress(tokenAddress)) {
            setError("Please provide a valid token address and token ID");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const tokenContract = new ethers.Contract(tokenAddress, erc1155Abi, provider);
            const balance = await tokenContract.balanceOf(walletAddress, tokenId);
            
            // Try to fetch metadata URI
            let uri = "";
            try {
                uri = await tokenContract.uri(tokenId);
            } catch (err) {
                uri = "Could not fetch URI";
            }
            
            setTokenData({
                tokenId: tokenId,
                balance: balance.toString(),
                uri: uri
            });
            
        } catch (err) {
            console.error("Error fetching token data:", err);
            setError("Failed to fetch token data. Check if the address is a valid ERC-1155 contract.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-2xl overflow-auto">
            <div className="flex py-2 items-center justify-between">
                <AppleNavBar icons={navIcons} />
                <div className="text-white font-semibold">ERC-1155 Token Inspector</div>
            </div>

            <div className="mb-5 bg-gray-800 p-4 rounded">
                <h3 className="text-white text-lg font-medium mb-3">Query Token</h3>
                <div className="flex flex-col space-y-3">
                    <div>
                        <label className="block text-gray-300 mb-1">Token Contract Address</label>
                        <input 
                            type="text" 
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            value={tokenAddress}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">Token ID</label>
                        <input 
                            type="text" 
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            value={tokenId}
                            onChange={(e) => setTokenId(e.target.value)}
                            placeholder="Enter token ID (e.g. 1)"
                        />
                    </div>
                    <button 
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        onClick={fetchTokenBalance}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Get Token Info"}
                    </button>
                    {error && <div className="text-red-400 mt-2">{error}</div>}
                </div>
            </div>
            
            {tokenData && (
                <div className="bg-gray-800 p-4 rounded mb-4">
                    <h3 className="text-white text-lg font-medium mb-2">Token Data</h3>
                    <pre className="bg-gray-700 p-4 rounded text-green-300 overflow-x-auto">
                        {JSON.stringify(tokenData, null, 2)}
                    </pre>
                </div>
            )}
            
            <div className="bg-gray-800 p-4 rounded">
                <h3 className="text-white text-lg font-medium mb-2">ERC-1155 Methods Reference</h3>
                <div className="space-y-4">
                    {erc1155Methods.map((category, idx) => (
                        <div key={idx} className="bg-gray-700 p-3 rounded">
                            <h4 className="text-blue-300 font-medium mb-2">{category.category}</h4>
                            <table className="w-full text-sm">
                                <tbody>
                                    {category.methods.map((method, methodIdx) => (
                                        <tr key={methodIdx} className="border-t border-gray-600">
                                            <td className="py-2 pr-4 text-yellow-300 whitespace-nowrap">{method.name}</td>
                                            <td className="py-2 text-gray-300">{method.desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
