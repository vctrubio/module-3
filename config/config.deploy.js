const NETWORK = {
  name: "Hardhat Local",
  chainId: 31337,
  url: "http://127.0.0.1:8545",
};

const CONTRACTS = ["HouseUrban", "houseonwheels"];

export const deployee = {
  network: NETWORK,
  contractNames: CONTRACTS,
};
