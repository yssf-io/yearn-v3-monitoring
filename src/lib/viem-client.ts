import { createPublicClient, http } from 'viem';
import { mainnet, arbitrum, polygon, base } from 'viem/chains';
import { chains, type ChainKey } from './chains';

export const getClient = (chainKey: ChainKey) => {
    const chainConfig = chains[chainKey];

    // Map our chain keys to viem chain objects
    const viemChain = {
        ethereum: mainnet,
        arbitrum: arbitrum,
        polygon: polygon,
        base: base,
    }[chainKey];

    return createPublicClient({
        chain: viemChain,
        transport: http(chainConfig.rpcUrl),
        batch: {
            multicall: true,
        },
    });
};
