import { AddressBadge } from "./address-badge";
import { Badge } from "@/components/ui/badge";
import { formatAddress, formatCompact, formatDuration } from "@/lib/format";
import type { VaultData } from "@/lib/types";
import { chains, type ChainKey } from "@/lib/chains";

interface ConfigPanelProps {
  data: VaultData;
  chain: ChainKey;
}

export function ConfigPanel({ data, chain }: ConfigPanelProps) {
  return (
    <div className="rounded-2xl border bg-card shadow-sm p-5 lg:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Configuration & roles</h3>
        <p className="text-sm text-muted-foreground">
          Protocol-level settings and management addresses
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Role manager"
          value={
            data.roleManager ? (
              <AddressBadge address={data.roleManager} chain={chain} />
            ) : (
              <EmptyValue />
            )
          }
        />
        <Field
          label="Accountant"
          value={
            data.accountant ? (
              <div className="flex flex-col gap-1">
                <AddressBadge address={data.accountant} chain={chain} />
                {data.accountantAssets !== undefined && (
                  <span
                    className="text-xs text-muted-foreground"
                    title={
                      data.accountantShares !== undefined
                        ? `${formatCompact(data.accountantShares, data.decimals)} ${data.symbol} shares held`
                        : undefined
                    }
                  >
                    Accrued fees:{" "}
                    <span className="font-medium text-foreground tabular-nums">
                      {formatCompact(data.accountantAssets, data.decimals)}{" "}
                      {data.assetSymbol}
                    </span>
                  </span>
                )}
              </div>
            ) : (
              <EmptyValue />
            )
          }
        />
        <Field
          label="Factory"
          value={
            data.factory ? (
              <AddressBadge address={data.factory} chain={chain} />
            ) : (
              <EmptyValue />
            )
          }
        />
        <Field label="API version" value={data.apiVersion ?? <EmptyValue />} />
        <Field
          label="Profit unlock window"
          value={formatDuration(data.profitUnlockTime)}
        />
        <Field
          label="Minimum idle floor"
          value={`${formatCompact(data.minIdle, data.decimals)} ${data.assetSymbol}`}
        />
        <Field
          label="Default queue"
          value={
            <Badge variant={data.useDefaultQueue ? "success" : "secondary"}>
              {data.useDefaultQueue ? "Enforced" : "Optional"}
            </Badge>
          }
        />
        <Field
          label="Auto-allocate"
          value={
            <Badge variant={data.autoAllocate ? "success" : "secondary"}>
              {data.autoAllocate ? "Enabled" : "Disabled"}
            </Badge>
          }
        />
      </div>

      {data.defaultQueue.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Queue order
          </p>
          <ol className="flex flex-wrap gap-2">
            {data.defaultQueue.map((addr, i) => (
              <li
                key={addr}
                className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 pl-1 pr-2.5 py-0.5 text-xs"
              >
                <span className="size-5 rounded-full bg-background text-foreground grid place-items-center font-medium text-[10px] border">
                  {i + 1}
                </span>
                <a
                  href={`${chains[chain].explorer}/address/${addr}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono hover:text-foreground text-muted-foreground transition-colors"
                >
                  {formatAddress(addr)}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-background/40 p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </p>
      <div className="text-sm font-medium min-h-[22px] flex items-center">
        {value}
      </div>
    </div>
  );
}

function EmptyValue() {
  return <span className="text-muted-foreground">—</span>;
}
