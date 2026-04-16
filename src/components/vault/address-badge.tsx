"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

import { formatAddress } from "@/lib/format";
import { chains, type ChainKey } from "@/lib/chains";
import { cn } from "@/lib/utils";

interface AddressBadgeProps {
  address: string;
  chain: ChainKey;
  className?: string;
  label?: string;
  tone?: "muted" | "subtle";
}

export function AddressBadge({
  address,
  chain,
  className,
  label,
  tone = "muted",
}: AddressBadgeProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const explorer = chains[chain].explorer;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border text-xs",
        tone === "muted"
          ? "bg-muted/40 px-2 py-0.5"
          : "bg-background/60 px-1.5 py-0.5",
        className
      )}
    >
      {label && <span className="text-muted-foreground font-sans">{label}</span>}
      <span className="font-mono tabular-nums">{formatAddress(address)}</span>
      <button
        type="button"
        onClick={onCopy}
        className="text-muted-foreground hover:text-foreground transition-colors -m-0.5 p-0.5"
        aria-label="Copy address"
        title="Copy address"
      >
        {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
      </button>
      <a
        href={`${explorer}/address/${address}`}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-muted-foreground hover:text-foreground transition-colors -m-0.5 p-0.5"
        aria-label="Open in block explorer"
        title="Open in block explorer"
      >
        <ExternalLink className="size-3" />
      </a>
    </span>
  );
}
