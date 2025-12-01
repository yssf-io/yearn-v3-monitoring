"use client";

import { useState } from "react";
import { getClient } from "@/lib/viem-client";
import { VaultABI, StrategyABI, ERC20ABI } from "@/lib/abis";
import { VaultInput } from "@/components/vault-input";
import { VaultOverview } from "@/components/vault-overview";
import { StrategyList } from "@/components/strategy-list";
import { VaultData, StrategyData } from "@/lib/types";
import { ChainKey } from "@/lib/chains";
import { isAddress, getContract } from "viem";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vaultData, setVaultData] = useState<VaultData | null>(null);
  const [strategies, setStrategies] = useState<StrategyData[]>([]);

  const fetchVaultData = async (chainKey: ChainKey, address: string) => {
    if (!isAddress(address)) {
      setError("Invalid address format");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVaultData(null);
    setStrategies([]);

    try {
      const client = getClient(chainKey);

      // 1. Fetch Vault Basics
      const vaultContract = getContract({
        address: address as `0x${string}`,
        abi: VaultABI,
        client: { public: client },
      });

      // Fetch critical data first
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
        strategyAddresses
      ] = await Promise.all([
        vaultContract.read.name(),
        vaultContract.read.symbol(),
        vaultContract.read.asset(),
        vaultContract.read.totalAssets(),
        vaultContract.read.totalDebt(),
        vaultContract.read.pricePerShare(),
        vaultContract.read.totalSupply(),
        vaultContract.read.deposit_limit(),
        vaultContract.read.minimum_total_idle(),
        vaultContract.read.get_default_queue(),
      ]);

      // Fetch optional data gracefully
      const [
        totalIdleResult,
        profitUnlockTimeResult,
        fullProfitUnlockDateResult,
        isShutdownResult
      ] = await Promise.allSettled([
        vaultContract.read.totalIdle(),
        vaultContract.read.profitMaxUnlockTime(),
        vaultContract.read.fullProfitUnlockDate(),
        vaultContract.read.isShutdown(),
      ]);

      const totalIdle = totalIdleResult.status === 'fulfilled'
        ? totalIdleResult.value
        : (totalAssets - totalDebt); // Fallback calculation

      const profitUnlockTime = profitUnlockTimeResult.status === 'fulfilled'
        ? profitUnlockTimeResult.value
        : 0n;

      const fullProfitUnlockDate = fullProfitUnlockDateResult.status === 'fulfilled'
        ? fullProfitUnlockDateResult.value
        : 0n;

      const isShutdown = isShutdownResult.status === 'fulfilled'
        ? isShutdownResult.value
        : false;

      // 2. Fetch Asset Details
      const assetContract = getContract({
        address: assetAddress,
        abi: ERC20ABI,
        client: { public: client },
      });

      const [assetSymbol, assetDecimals] = await Promise.all([
        assetContract.read.symbol(),
        assetContract.read.decimals(),
      ]);

      // 3. Fetch Strategy Details
      const strategiesData = await Promise.all(
        strategyAddresses.map(async (stratAddress) => {
          // Get vault-specific strategy data
          const [activation, lastReport, currentDebt, maxDebt] = await vaultContract.read.strategies([stratAddress]);

          // Get strategy contract data
          const strategyContract = getContract({
            address: stratAddress,
            abi: StrategyABI,
            client: { public: client },
          });

          const [stratName, stratTotalAssets] = await Promise.all([
            strategyContract.read.name(),
            strategyContract.read.totalAssets(),
          ]);

          return {
            address: stratAddress,
            name: stratName,
            activation,
            lastReport,
            currentDebt,
            maxDebt,
            totalAssets: stratTotalAssets,
          } as StrategyData;
        })
      );

      setVaultData({
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
        profitUnlockTime,
        fullProfitUnlockDate,
        isShutdown,
      });

      setStrategies(strategiesData);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch vault data. Ensure the address is a valid Yearn V3 vault on the selected chain.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Yearn V3 Monitor</h1>
          <p className="text-muted-foreground">
            Monitor vault metrics and strategy performance
          </p>
        </div>

        <VaultInput onSearch={fetchVaultData} isLoading={isLoading} />

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 max-w-3xl mx-auto">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        {isLoading && (
          <div className="space-y-6 max-w-7xl mx-auto w-full">
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        )}

        {!isLoading && vaultData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <VaultOverview data={vaultData} />
            <StrategyList
              strategies={strategies}
              decimals={vaultData.decimals}
              assetSymbol={vaultData.assetSymbol}
            />
          </div>
        )}
      </div>
    </main>
  );
}
