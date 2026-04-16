import { Banknote, Clock, Gauge, Wallet } from "lucide-react";

import { formatCompact, formatDuration, formatPct } from "@/lib/format";
import type { StrategyData, VaultData } from "@/lib/types";
import { cn } from "@/lib/utils";

const UNCAPPED = 2n ** 255n;

interface VaultKPIsProps {
  data: VaultData;
  strategies: StrategyData[];
}

export function VaultKPIs({ data, strategies }: VaultKPIsProps) {
  const totalN = data.totalAssets === 0n ? 1 : Number(data.totalAssets);
  const idleRatio = Number(data.totalIdle) / totalN;
  const deployedRatio = Math.max(0, 1 - idleRatio);

  const capped = data.depositLimit > 0n && data.depositLimit < UNCAPPED;
  const capacityFilled = capped
    ? Math.min(Number(data.totalAssets) / Number(data.depositLimit), 1)
    : null;
  const depositRoom =
    capped && data.depositLimit > data.totalAssets
      ? data.depositLimit - data.totalAssets
      : 0n;

  const now = BigInt(Math.floor(Date.now() / 1000));
  const remaining =
    data.fullProfitUnlockDate > now ? data.fullProfitUnlockDate - now : 0n;
  const unlockPct =
    data.profitUnlockTime > 0n && data.fullProfitUnlockDate > 0n
      ? remaining === 0n
        ? 1
        : Math.max(
            0,
            Math.min(1, 1 - Number(remaining) / Number(data.profitUnlockTime))
          )
      : 1;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        icon={<Banknote className="size-4" />}
        label="Idle"
        value={`${formatCompact(data.totalIdle, data.decimals)} ${data.assetSymbol}`}
        sub={`${formatPct(idleRatio)} of assets • floor ${formatCompact(data.minIdle, data.decimals)}`}
        progress={idleRatio}
        tone="muted"
      />
      <KPICard
        icon={<Wallet className="size-4" />}
        label="Deployed"
        value={`${formatCompact(data.totalDebt, data.decimals)} ${data.assetSymbol}`}
        sub={`${formatPct(deployedRatio)} across ${strategies.length} ${strategies.length === 1 ? "strategy" : "strategies"}`}
        progress={deployedRatio}
        tone="primary"
      />
      <KPICard
        icon={<Gauge className="size-4" />}
        label={capped ? "Capacity" : "Deposit limit"}
        value={capped ? formatPct(capacityFilled ?? 0) : "Unlimited"}
        sub={
          capped
            ? `${formatCompact(depositRoom, data.decimals)} ${data.assetSymbol} available`
            : "No cap set"
        }
        progress={capacityFilled ?? undefined}
        tone={
          capacityFilled != null && capacityFilled >= 0.95 ? "warning" : "primary"
        }
      />
      <KPICard
        icon={<Clock className="size-4" />}
        label="Profit unlock"
        value={unlockPct >= 1 ? "Complete" : formatDuration(remaining)}
        sub={`Window ${formatDuration(data.profitUnlockTime)}`}
        progress={unlockPct}
        tone="primary"
      />
    </div>
  );
}

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  progress?: number;
  tone?: "primary" | "warning" | "muted";
}

function KPICard({ icon, label, value, sub, progress, tone = "primary" }: KPICardProps) {
  const toneClass =
    tone === "primary"
      ? "bg-primary"
      : tone === "warning"
        ? "bg-warning"
        : "bg-muted-foreground/40";
  return (
    <div className="rounded-2xl border bg-card shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div>
        <p className="text-xl font-semibold tabular-nums leading-tight">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </div>
      {progress !== undefined && (
        <div className="mt-auto h-1 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full transition-all duration-500", toneClass)}
            style={{
              width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
