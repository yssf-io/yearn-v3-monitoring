import { Vault } from "lucide-react";

import { AddressBadge } from "./address-badge";
import { ChainBadge } from "./chain-badge";
import { Badge } from "@/components/ui/badge";
import { formatCompact, formatUnitsFixed } from "@/lib/format";
import type { VaultData } from "@/lib/types";
import type { ChainKey } from "@/lib/chains";

interface VaultHeroProps {
  data: VaultData;
  chain: ChainKey;
}

export function VaultHero({ data, chain }: VaultHeroProps) {
  const pps = formatUnitsFixed(data.pricePerShare, data.decimals, 6);

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/15">
              <Vault className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="text-2xl font-semibold tracking-tight truncate max-w-[32ch]"
                  title={data.name}
                >
                  {data.name}
                </h1>
                <Badge variant="secondary">{data.symbol}</Badge>
                <ChainBadge chain={chain} />
                {data.isShutdown && <Badge variant="destructive">Shutdown</Badge>}
                {data.apiVersion && (
                  <Badge variant="outline">v{data.apiVersion}</Badge>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <AddressBadge address={data.address} chain={chain} label="vault" />
                <AddressBadge
                  address={data.asset}
                  chain={chain}
                  label={data.assetSymbol}
                />
              </div>
            </div>
          </div>
          <div className="space-y-3 text-right min-w-[240px] ml-auto">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Total Assets
              </p>
              <p className="text-3xl font-semibold tabular-nums leading-tight">
                {formatCompact(data.totalAssets, data.decimals)}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  {data.assetSymbol}
                </span>
              </p>
            </div>
            <div className="flex justify-end gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Price / Share
                </p>
                <p className="text-sm font-medium tabular-nums">{pps}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Shares
                </p>
                <p className="text-sm font-medium tabular-nums">
                  {formatCompact(data.totalSupply, data.decimals)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
