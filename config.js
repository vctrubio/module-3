const NETWORK = {
  name: "hardhat",
  chainId: 1337,
  url: "http://127.0.0.1:8545",
};

export const hardhat = {
  network: NETWORK,
};

export const deployedContract = {
  network: {
    name: NETWORK.name,
    chainId: NETWORK.chainId,
    address: "",
  },
};
