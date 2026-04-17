import { Vault } from "lucide-react";

import { AddressBadge } from "./address-badge";
import { ChainBadge } from "./chain-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCompact, formatUnitsFixed } from "@/lib/format";
import type { VaultData } from "@/lib/types";
import type { ChainKey } from "@/lib/chains";

interface ApyData {
  net: number | null;
  weeklyNet: number | null;
  monthlyNet: number | null;
  inceptionNet: number | null;
  grossApr: number | null;
}
type Apy = { status: "loading" } | { status: "ready"; data: ApyData | null };

interface VaultHeroProps {
  data: VaultData;
  chain: ChainKey;
  apy?: Apy;
}

const pctFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const pctFormatterCompact = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function VaultHero({ data, chain, apy }: VaultHeroProps) {
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
            <div className="flex justify-end items-start gap-8">
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
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Net APY
                </p>
                <ApyHeadline apy={apy} />
              </div>
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

function ApyHeadline({ apy }: { apy?: Apy }) {
  if (!apy || apy.status === "loading") {
    return (
      <>
        <p
          aria-hidden
          className="h-[30px] w-24 rounded bg-muted animate-pulse mt-1"
        />
        <p className="mt-1 h-3 w-32 rounded bg-muted animate-pulse" />
      </>
    );
  }
  const data = apy.data;
  if (!data || data.net === null || data.net === undefined) {
    return (
      <>
        <p
          className="text-3xl font-semibold tabular-nums leading-tight text-muted-foreground"
          title="Kong has no APY data for this vault yet — usually means it's new or unindexed"
        >
          —
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Awaiting data</p>
      </>
    );
  }
  const tone =
    data.net > 0 ? "text-success" : data.net < 0 ? "text-destructive" : "";
  return (
    <>
      <p
        className={cn(
          "text-3xl font-semibold tabular-nums leading-tight",
          tone
        )}
      >
        {pctFormatter.format(data.net)}
      </p>
      <p className="mt-1.5 text-sm tabular-nums flex justify-end gap-3 text-foreground/80">
        {data.weeklyNet !== null && (
          <span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground mr-1">
              7d
            </span>
            <span className="font-medium">
              {pctFormatterCompact.format(data.weeklyNet)}
            </span>
          </span>
        )}
        {data.monthlyNet !== null && (
          <span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground mr-1">
              30d
            </span>
            <span className="font-medium">
              {pctFormatterCompact.format(data.monthlyNet)}
            </span>
          </span>
        )}
      </p>
    </>
  );
}

