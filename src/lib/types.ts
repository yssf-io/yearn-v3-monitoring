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
  apiVersion?: string;
  accountant?: string;
  roleManager?: string;
  factory?: string;
  useDefaultQueue: boolean;
  autoAllocate: boolean;
  defaultQueue: string[];
  /** Vault shares currently held by the accountant (unclaimed fee shares). */
  accountantShares?: bigint;
  /** Underlying-asset value of the accountant's share balance. */
  accountantAssets?: bigint;
}

export interface StrategyData {
  address: string;
  name: string;
  activation: bigint;
  lastReport: bigint;
  currentDebt: bigint;
  maxDebt: bigint;
  /**
   * Value of the vault's position in the strategy (underlying asset units).
   * `undefined` when the strategy doesn't expose ERC-4626 balance/convert fns.
   */
  vaultAssets?: bigint;
}
