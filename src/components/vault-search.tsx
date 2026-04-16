"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import { ArrowRight, Search } from "lucide-react";

import { chains, type ChainKey } from "@/lib/chains";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VaultSearchProps {
  autoFocus?: boolean;
  compact?: boolean;
  initialChain?: ChainKey;
  initialAddress?: string;
}

export function VaultSearch({
  autoFocus = false,
  compact = false,
  initialChain = "ethereum",
  initialAddress = "",
}: VaultSearchProps) {
  const router = useRouter();
  const [chain, setChain] = useState<ChainKey>(initialChain);
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = address.trim();
    if (!isAddress(trimmed)) {
      setError("Invalid address format");
      return;
    }
    setError(null);
    router.push(`/vault/${chain}/${trimmed}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn("w-full", compact ? "max-w-xl" : "max-w-2xl mx-auto")}
    >
      <div className="group flex items-center gap-1 rounded-xl border bg-card/80 backdrop-blur shadow-sm p-1.5 transition-all focus-within:border-primary/50 focus-within:shadow-md">
        <Select value={chain} onValueChange={(v) => setChain(v as ChainKey)}>
          <SelectTrigger className="h-9 w-[130px] shrink-0 border-0 shadow-none focus-visible:ring-0 bg-transparent dark:bg-transparent dark:hover:bg-transparent gap-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(chains).map(([k, c]) => (
              <SelectItem key={k} value={k}>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: c.color }}
                  />
                  {c.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="h-6 w-px bg-border shrink-0" />
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError(null);
            }}
            placeholder="Vault address (0x…)"
            autoFocus={autoFocus}
            spellCheck={false}
            className="font-mono h-9 pl-8 border-0 shadow-none focus-visible:ring-0 bg-transparent dark:bg-transparent"
          />
        </div>
        <Button type="submit" disabled={!address} className="h-9">
          <span className="hidden sm:inline">Inspect</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
