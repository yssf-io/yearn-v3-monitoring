export const chains = {
  base: {
    id: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org"
  },
  ethereum: {
    id: 1,
    name: "Ethereum",
    rpcUrl: "https://eth.llamarpc.com"
  },
  arbitrum: {
    id: 42161,
    name: "Arbitrum",
    rpcUrl: "https://arb1.arbitrum.io/rpc"
  },
  polygon: {
    id: 137,
    name: "Polygon",
    rpcUrl: "https://polygon-rpc.com"
  }
} as const;

export type ChainKey = keyof typeof chains;
