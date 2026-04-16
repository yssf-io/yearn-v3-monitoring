import { createPublicClient, fallback, http } from "viem";
import { arbitrum, base, mainnet, polygon } from "viem/chains";
import { getRpcUrls, type ChainKey } from "./chains";

const VIEM_CHAINS = {
  ethereum: mainnet,
  base,
  arbitrum,
  polygon,
} as const;

const clientCache = new Map<ChainKey, ReturnType<typeof buildClient>>();

function buildClient(chain: ChainKey) {
  const urls = getRpcUrls(chain);
  const transports = urls.map((url) =>
    http(url, {
      retryCount: 2,
      retryDelay: 300,
      timeout: 15_000,
    })
  );

  return createPublicClient({
    chain: VIEM_CHAINS[chain],
    transport: fallback(transports, { rank: false, retryCount: 1 }),
    batch: {
      multicall: {
        wait: 16,
      },
    },
  });
}

export function getClient(chain: ChainKey) {
  let cached = clientCache.get(chain);
  if (!cached) {
    cached = buildClient(chain);
    clientCache.set(chain, cached);
  }
  return cached;
}
