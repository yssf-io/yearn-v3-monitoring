import { chains, type ChainKey } from "@/lib/chains";
import { cn } from "@/lib/utils";

interface ChainBadgeProps {
  chain: ChainKey;
  className?: string;
}

export function ChainBadge({ chain, className }: ChainBadgeProps) {
  const c = chains[chain];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: c.color }}
        aria-hidden
      />
      {c.name}
    </span>
  );
}
