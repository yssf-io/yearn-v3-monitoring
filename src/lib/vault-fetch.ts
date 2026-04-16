import { getContract, isAddress, zeroAddress } from "viem";
import { getClient } from "./viem-client";
import { VaultABI, StrategyABI, ERC20ABI } from "./abis";
import type { ChainKey } from "./chains";
import type { VaultData, StrategyData } from "./types";

const settled = <T>(r: PromiseSettledResult<T>, fallback: T): T =>
  r.status === "fulfilled" ? r.value : fallback;

const settledMaybe = <T>(r: PromiseSettledResult<T>): T | undefined =>
  r.status === "fulfilled" ? r.value : undefined;

export async function fetchVaultData(
  chain: ChainKey,
  address: string
): Promise<{ vault: VaultData; strategies: StrategyData[] }> {
  if (!isAddress(address)) throw new Error("Invalid address");
  const client = getClient(chain);
  const vault = getContract({
    address: address as `0x${string}`,
    abi: VaultABI,
    client: { public: client },
  });

  const [
    name,
    symbol,
    assetAddress,
    totalAssets,
    totalDebt,
    pricePerShare,
    totalSupply,
    depositLimit,
    minIdle,
    defaultQueue,
  ] = await Promise.all([
    vault.read.name(),
    vault.read.symbol(),
    vault.read.asset(),
    vault.read.totalAssets(),
    vault.read.totalDebt(),
    vault.read.pricePerShare(),
    vault.read.totalSupply(),
    vault.read.deposit_limit(),
    vault.read.minimum_total_idle(),
    vault.read.get_default_queue(),
  ]);

  const [
    totalIdleR,
    profitUnlockTimeR,
    fullProfitUnlockDateR,
    isShutdownR,
    apiVersionR,
    accountantR,
    roleManagerR,
    factoryR,
    useDefaultQueueR,
    autoAllocateR,
  ] = await Promise.allSettled([
    vault.read.totalIdle(),
    vault.read.profitMaxUnlockTime(),
    vault.read.fullProfitUnlockDate(),
    vault.read.isShutdown(),
    vault.read.api_version(),
    vault.read.accountant(),
    vault.read.role_manager(),
    vault.read.factory(),
    vault.read.use_default_queue(),
    vault.read.auto_allocate(),
  ]);

  const totalIdle = settled(totalIdleR, totalAssets - totalDebt);

  const asset = getContract({
    address: assetAddress,
    abi: ERC20ABI,
    client: { public: client },
  });

  const [assetSymbol, assetDecimals] = await Promise.all([
    asset.read.symbol(),
    asset.read.decimals(),
  ]);

  // Unclaimed fees: the vault mints shares to the accountant on every strategy
  // report, so balanceOf(accountant) is the pool of accrued-but-not-yet-claimed
  // fees. Convert to underlying via pricePerShare (which V3 defines as
  // convertToAssets(10**decimals)).
  const accountantAddr = settledMaybe(accountantR);
  let accountantShares: bigint | undefined;
  let accountantAssets: bigint | undefined;
  if (accountantAddr && accountantAddr.toLowerCase() !== zeroAddress) {
    try {
      accountantShares = await vault.read.balanceOf([
        accountantAddr as `0x${string}`,
      ]);
      const scale = 10n ** BigInt(assetDecimals);
      accountantAssets = (accountantShares * pricePerShare) / scale;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[vault-fetch] accountant balanceOf failed:`, err);
      }
    }
  }

  const strategies: StrategyData[] = await Promise.all(
    defaultQueue.map(async (stratAddr) => {
      const [activation, lastReport, currentDebt, maxDebt] =
        await vault.read.strategies([stratAddr]);
      const strat = getContract({
        address: stratAddr,
        abi: StrategyABI,
        client: { public: client },
      });
      const [stratNameR, vaultSharesR] = await Promise.allSettled([
        strat.read.name(),
        strat.read.balanceOf([address as `0x${string}`]),
      ]);

      // Compute the vault's actual slice of the strategy (underlying units).
      // Falls back to `undefined` when the strategy isn't ERC-4626 compliant.
      const vaultShares = settledMaybe(vaultSharesR);
      let vaultAssets: bigint | undefined;
      if (vaultShares !== undefined) {
        if (vaultShares === 0n) {
          vaultAssets = 0n;
        } else {
          try {
            vaultAssets = await strat.read.convertToAssets([vaultShares]);
          } catch (err) {
            if (process.env.NODE_ENV !== "production") {
              console.warn(`[vault-fetch] convertToAssets failed for strategy ${stratAddr}:`, err);
            }
            vaultAssets = undefined;
          }
        }
      } else if (process.env.NODE_ENV !== "production" && vaultSharesR.status === "rejected") {
        console.warn(`[vault-fetch] balanceOf failed for strategy ${stratAddr}:`, vaultSharesR.reason);
      }

      return {
        address: stratAddr,
        name: settled(stratNameR, "Unknown strategy"),
        activation,
        lastReport,
        currentDebt,
        maxDebt,
        vaultAssets,
      };
    })
  );

  const vaultData: VaultData = {
    address,
    name,
    symbol,
    asset: assetAddress,
    assetSymbol,
    decimals: assetDecimals,
    totalAssets,
    totalIdle,
    totalDebt,
    pricePerShare,
    totalSupply,
    depositLimit,
    minIdle,
    profitUnlockTime: settled(profitUnlockTimeR, 0n),
    fullProfitUnlockDate: settled(fullProfitUnlockDateR, 0n),
    isShutdown: settled(isShutdownR, false),
    apiVersion: settledMaybe(apiVersionR),
    accountant: settledMaybe(accountantR),
    roleManager: settledMaybe(roleManagerR),
    factory: settledMaybe(factoryR),
    useDefaultQueue: settled(useDefaultQueueR, true),
    autoAllocate: settled(autoAllocateR, false),
    defaultQueue: [...defaultQueue],
    accountantShares,
    accountantAssets,
  };

  return { vault: vaultData, strategies };
}
