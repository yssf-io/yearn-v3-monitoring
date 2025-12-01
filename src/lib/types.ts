export interface VaultData {
    address: string;
    name: string;
    symbol: string;
    asset: string;
    assetSymbol: string;
    decimals: number;
    totalAssets: bigint;
    totalIdle: bigint;
    totalDebt: bigint;
    pricePerShare: bigint;
    totalSupply: bigint;
    depositLimit: bigint;
    minIdle: bigint;
    profitUnlockTime: bigint;
    fullProfitUnlockDate: bigint;
    isShutdown: boolean;
}

export interface StrategyData {
    address: string;
    name: string;
    activation: bigint;
    lastReport: bigint;
    currentDebt: bigint;
    maxDebt: bigint;
    totalAssets: bigint;
}
