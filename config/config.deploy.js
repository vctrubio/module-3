const NETWORK = {
  name: "hardhat",
  chainId: 1337,
  url: "http://127.0.0.1:8545",
};

const CONTRACTS = ["HouseUrban"];

export const deployee = {
  network: NETWORK,
  contractNames: CONTRACTS,
};
