export const chains = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    shortName: "ETH",
    rpcUrls: [
      "https://eth.llamarpc.com",
      "https://ethereum-rpc.publicnode.com",
      "https://rpc.ankr.com/eth",
      "https://1rpc.io/eth",
    ],
    explorer: "https://etherscan.io",
    color: "#627EEA",
  },
  base: {
    id: 8453,
    name: "Base",
    shortName: "Base",
    rpcUrls: [
      "https://base.llamarpc.com",
      "https://base-rpc.publicnode.com",
      "https://1rpc.io/base",
      "https://mainnet.base.org",
    ],
    explorer: "https://basescan.org",
    color: "#0052FF",
  },
  arbitrum: {
    id: 42161,
    name: "Arbitrum",
    shortName: "ARB",
    rpcUrls: [
      "https://arbitrum.llamarpc.com",
      "https://arbitrum-one-rpc.publicnode.com",
      "https://1rpc.io/arb",
      "https://arb1.arbitrum.io/rpc",
    ],
    explorer: "https://arbiscan.io",
    color: "#28A0F0",
  },
  polygon: {
    id: 137,
    name: "Polygon",
    shortName: "POL",
    rpcUrls: [
      "https://polygon.llamarpc.com",
      "https://polygon-bor-rpc.publicnode.com",
      "https://1rpc.io/matic",
      "https://polygon-rpc.com",
    ],
    explorer: "https://polygonscan.com",
    color: "#8247E5",
  },
} as const;

export type ChainKey = keyof typeof chains;

export function isChainKey(key: string): key is ChainKey {
  return key in chains;
}

const ENV_OVERRIDES: Record<ChainKey, string | undefined> = {
  ethereum: process.env.NEXT_PUBLIC_RPC_ETHEREUM,
  base: process.env.NEXT_PUBLIC_RPC_BASE,
  arbitrum: process.env.NEXT_PUBLIC_RPC_ARBITRUM,
  polygon: process.env.NEXT_PUBLIC_RPC_POLYGON,
};

export function getRpcUrls(chain: ChainKey): readonly string[] {
  const override = ENV_OVERRIDES[chain];
  if (override) return [override, ...chains[chain].rpcUrls];
  return chains[chain].rpcUrls;
}
