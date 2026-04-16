"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  formatAddress,
  formatCompact,
  formatPct,
  formatRelativeTime,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { chains, type ChainKey } from "@/lib/chains";
import type { StrategyData, VaultData } from "@/lib/types";

type SortKey = "allocation" | "utilization" | "lastReportSec" | "pnl";

interface StrategyTableProps {
  strategies: StrategyData[];
  vault: VaultData;
  chain: ChainKey;
}

const STALE_THRESHOLD_SECONDS = 7 * 86_400;

export function StrategyTable({ strategies, vault, chain }: StrategyTableProps) {
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({
    key: "allocation",
    desc: true,
  });

  const rows = useMemo(() => {
    const totalN = vault.totalAssets === 0n ? 1 : Number(vault.totalAssets);
    const decorated = strategies.map((s) => ({
      ...s,
      allocation: Number(s.currentDebt) / totalN,
      utilization: s.maxDebt > 0n ? Number(s.currentDebt) / Number(s.maxDebt) : 0,
      pnl: s.vaultAssets !== undefined ? s.vaultAssets - s.currentDebt : null,
      lastReportSec: Number(s.lastReport),
    }));

    return decorated.sort((a, b) => {
      const dir = sort.desc ? -1 : 1;
      const av = a[sort.key] === null ? -Infinity : Number(a[sort.key]);
      const bv = b[sort.key] === null ? -Infinity : Number(b[sort.key]);
      if (av === bv) return 0;
      return (av - bv) * dir;
    });
  }, [strategies, vault.totalAssets, sort]);

  const now = Math.floor(Date.now() / 1000);
  const toggleSort = (key: SortKey) =>
    setSort((p) => ({ key, desc: p.key === key ? !p.desc : true }));

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight">Strategies</h3>
          <span className="text-xs text-muted-foreground">
            {strategies.length} in default queue
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="text-left py-2.5 px-5 font-medium">Strategy</th>
              <Th sort={sort} colKey="allocation" onClick={() => toggleSort("allocation")}>
                Allocation
              </Th>
              <th className="text-left py-2.5 px-3 font-medium">Debt / Max</th>
              <Th sort={sort} colKey="utilization" onClick={() => toggleSort("utilization")}>
                Util.
              </Th>
              <Th sort={sort} colKey="pnl" onClick={() => toggleSort("pnl")}>
                Pending P/L
              </Th>
              <Th sort={sort} colKey="lastReportSec" onClick={() => toggleSort("lastReportSec")}>
                Last Report
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isStale = now - r.lastReportSec > STALE_THRESHOLD_SECONDS;
              const pnlUnknown = r.pnl === null;
              const pnlPositive = !pnlUnknown && r.pnl! > 0n;
              const pnlZero = !pnlUnknown && r.pnl === 0n;
              return (
                <tr
                  key={r.address}
                  className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-3 px-5 max-w-[300px]">
                    <div className="font-medium truncate" title={r.name}>
                      {r.name}
                    </div>
                    <a
                      href={`${chains[chain].explorer}/address/${r.address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5"
                    >
                      {formatAddress(r.address)}
                      <ExternalLink className="size-3" />
                    </a>
                  </td>
                  <td className="py-3 px-3 tabular-nums">
                    <div className="font-medium">{formatPct(r.allocation)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCompact(r.currentDebt, vault.decimals)} {vault.assetSymbol}
                    </div>
                  </td>
                  <td className="py-3 px-3 min-w-[200px]">
                    <DebtBar
                      current={r.currentDebt}
                      max={r.maxDebt}
                      decimals={vault.decimals}
                      assetSymbol={vault.assetSymbol}
                    />
                  </td>
                  <td className="py-3 px-3 tabular-nums">
                    <span
                      className={cn(
                        r.utilization >= 1 && "text-destructive",
                        r.utilization >= 0.95 && r.utilization < 1 && "text-warning"
                      )}
                    >
                      {formatPct(r.utilization)}
                    </span>
                  </td>
                  <td className="py-3 px-3 tabular-nums">
                    {pnlUnknown ? (
                      <span
                        className="text-muted-foreground"
                        title="Strategy does not expose ERC-4626 balanceOf / convertToAssets"
                      >
                        —
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1",
                          pnlZero
                            ? "text-muted-foreground"
                            : pnlPositive
                              ? "text-success"
                              : "text-destructive"
                        )}
                      >
                        {pnlZero ? (
                          <Minus className="size-3" />
                        ) : pnlPositive ? (
                          <TrendingUp className="size-3" />
                        ) : (
                          <TrendingDown className="size-3" />
                        )}
                        <span>
                          {pnlPositive ? "+" : ""}
                          {formatCompact(r.pnl!, vault.decimals)}
                        </span>
                      </span>
                    )}
                  </td>
                  <td
                    className={cn(
                      "py-3 px-5 whitespace-nowrap",
                      isStale && "text-warning"
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {isStale && <AlertCircle className="size-3" />}
                      {formatRelativeTime(r.lastReport)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  sort,
  colKey,
  onClick,
}: {
  children: React.ReactNode;
  sort: { key: SortKey; desc: boolean };
  colKey: SortKey;
  onClick: () => void;
}) {
  const active = sort.key === colKey;
  return (
    <th className="text-left py-2.5 px-3 font-medium whitespace-nowrap">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wider text-xs hover:text-foreground transition-colors",
          active && "text-foreground"
        )}
      >
        {children}
        {active ? (
          sort.desc ? (
            <ArrowDown className="size-3" />
          ) : (
            <ArrowUp className="size-3" />
          )
        ) : (
          <ArrowUp className="size-3 opacity-0" aria-hidden />
        )}
      </button>
    </th>
  );
}

function DebtBar({
  current,
  max,
  decimals,
  assetSymbol,
}: {
  current: bigint;
  max: bigint;
  decimals: number;
  assetSymbol: string;
}) {
  const pct = max > 0n ? Math.min(Number(current) / Number(max), 1) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs tabular-nums">
        <span>{formatCompact(current, decimals)}</span>
        <span className="text-muted-foreground">
          / {formatCompact(max, decimals)} {assetSymbol}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500",
            pct >= 1
              ? "bg-destructive"
              : pct >= 0.95
                ? "bg-warning"
                : "bg-primary"
          )}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
