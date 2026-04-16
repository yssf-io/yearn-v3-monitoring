"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { isAddress } from "viem";

import { VaultSearch } from "@/components/vault-search";
import { VaultHero } from "@/components/vault/vault-hero";
import { VaultKPIs } from "@/components/vault/vault-kpis";
import { AllocationBar } from "@/components/vault/allocation-bar";
import { StrategyTable } from "@/components/vault/strategy-table";
import { ConfigPanel } from "@/components/vault/config-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { isChainKey, type ChainKey } from "@/lib/chains";
import { fetchVaultData } from "@/lib/vault-fetch";
import type { StrategyData, VaultData } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "ready"; vault: VaultData; strategies: StrategyData[] }
  | { status: "error"; message: string };

type HolderCount = { status: "loading" } | { status: "ready"; count: number | null };

export default function VaultPage({
  params,
}: {
  params: Promise<{ chain: string; address: string }>;
}) {
  const { chain: chainParam, address } = use(params);
  const validChain = isChainKey(chainParam);
  const chain = validChain ? (chainParam as ChainKey) : null;

  const [state, setState] = useState<State>({ status: "loading" });
  const [holders, setHolders] = useState<HolderCount>({ status: "loading" });

  useEffect(() => {
    if (!chain || !isAddress(address)) return;
    let cancelled = false;
    setHolders({ status: "loading" });
    (async () => {
      try {
        const res = await fetch(`/api/holders/${chain}/${address}`);
        const json = await res.json();
        if (!cancelled) {
          const count = typeof json.count === "number" ? json.count : null;
          setHolders({ status: "ready", count });
        }
      } catch {
        if (!cancelled) setHolders({ status: "ready", count: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chain, address]);

  useEffect(() => {
    if (!chain) {
      setState({
        status: "error",
        message: `Unknown chain: "${chainParam}". Supported: ethereum, base, arbitrum, polygon.`,
      });
      return;
    }
    if (!isAddress(address)) {
      setState({
        status: "error",
        message: "Invalid vault address format.",
      });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        const data = await fetchVaultData(chain, address);
        if (!cancelled)
          setState({
            status: "ready",
            vault: data.vault,
            strategies: data.strategies,
          });
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          const raw = err instanceof Error ? err.message : String(err);
          const detail = raw.split("\n")[0].slice(0, 200);
          setState({
            status: "error",
            message: `Failed to fetch vault data. ${detail}`,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chain, chainParam, address]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to search
        </Link>
        <VaultSearch
          compact
          initialChain={chain ?? "ethereum"}
          initialAddress={address}
        />
      </div>

      {state.status === "error" && <ErrorBanner message={state.message} />}
      {state.status === "loading" && <LoadingSkeleton />}
      {state.status === "ready" && chain && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <VaultHero data={state.vault} chain={chain} holders={holders} />
          <VaultKPIs data={state.vault} strategies={state.strategies} />
          {state.strategies.length > 0 && (
            <>
              <AllocationBar
                data={state.vault}
                strategies={state.strategies}
              />
              <StrategyTable
                strategies={state.strategies}
                vault={state.vault}
                chain={chain}
              />
            </>
          )}
          <ConfigPanel data={state.vault} chain={chain} />
        </div>
      )}
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-44 rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-start gap-2">
      <AlertTriangle className="size-5 shrink-0 mt-0.5" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
