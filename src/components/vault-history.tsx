"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, X } from "lucide-react";

import { chains } from "@/lib/chains";
import { formatAddress, formatRelativeTime } from "@/lib/format";
import {
  clearHistory,
  getHistory,
  HISTORY_EVENT,
  removeEntry,
  type HistoryEntry,
} from "@/lib/vault-history";

export function VaultHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
    setMounted(true);
    const onChange = () => setEntries(getHistory());
    window.addEventListener(HISTORY_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(HISTORY_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  if (!mounted || entries.length === 0) return null;

  return (
    <section className="mt-12 text-left">
      <div className="flex items-center justify-between mb-3">
        <h2 className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Clock className="size-3.5" />
          Recently viewed
        </h2>
        <button
          type="button"
          onClick={() => setEntries(clearHistory())}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear all
        </button>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {entries.map((e) => (
          <li key={`${e.chain}:${e.address}`} className="relative group">
            <Link
              href={`/vault/${e.chain}/${e.address}`}
              className="flex items-center gap-3 rounded-xl border bg-card/60 backdrop-blur p-3 pr-10 shadow-sm hover:bg-card hover:border-primary/40 transition-colors"
            >
              <span
                className="size-2 rounded-full shrink-0"
                style={{ background: chains[e.chain].color }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="font-medium truncate"
                    title={e.name ?? e.address}
                  >
                    {e.name ?? formatAddress(e.address)}
                  </span>
                  {e.assetSymbol && (
                    <span className="text-xs text-muted-foreground">
                      {e.assetSymbol}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                  {chains[e.chain].shortName} · {formatAddress(e.address)} ·{" "}
                  {formatRelativeTime(BigInt(Math.floor(e.viewedAt / 1000)))}
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                setEntries(removeEntry(e.chain, e.address));
              }}
              aria-label="Remove from history"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
