import { formatCompact, formatPct } from "@/lib/format";
import type { StrategyData, VaultData } from "@/lib/types";

interface AllocationBarProps {
  data: VaultData;
  strategies: StrategyData[];
}

export function AllocationBar({ data, strategies }: AllocationBarProps) {
  const totalN = data.totalAssets === 0n ? 1 : Number(data.totalAssets);
  const idle = Number(data.totalIdle);
  const segments = strategies
    .map((s, i) => ({
      key: s.address,
      label: s.name,
      value: Number(s.currentDebt),
      pct: Number(s.currentDebt) / totalN,
      color: `var(--chart-${(i % 5) + 1})`,
    }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  const idlePct = idle / totalN;

  return (
    <div className="rounded-2xl border bg-card shadow-sm p-5 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium">Allocation breakdown</h3>
          <p className="text-xs text-muted-foreground">
            {formatCompact(data.totalAssets, data.decimals)} {data.assetSymbol} distribution
          </p>
        </div>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label="Vault allocation">
        {idle > 0 && (
          <div
            className="bg-muted-foreground/25 border-r border-background/40"
            style={{ width: `${idlePct * 100}%` }}
            title={`Idle ${formatPct(idlePct)}`}
          />
        )}
        {segments.map((s) => (
          <div
            key={s.key}
            className="border-r border-background/40 last:border-r-0"
            style={{ width: `${s.pct * 100}%`, background: s.color }}
            title={`${s.label} ${formatPct(s.pct)}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <Legend color="var(--muted-foreground)" opacity={0.3} label="Idle" value={formatPct(idlePct)} />
        {segments.map((s) => (
          <Legend key={s.key} color={s.color} label={s.label} value={formatPct(s.pct)} />
        ))}
      </div>
    </div>
  );
}

function Legend({
  color,
  label,
  value,
  opacity = 1,
}: {
  color: string;
  label: string;
  value: string;
  opacity?: number;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 min-w-0">
      <span
        className="size-2 rounded-sm shrink-0"
        style={{ background: color, opacity }}
        aria-hidden
      />
      <span className="truncate max-w-[180px]" title={label}>
        {label}
      </span>
      <span className="text-muted-foreground tabular-nums">{value}</span>
    </div>
  );
}
