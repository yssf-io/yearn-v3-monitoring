import { isChainKey, type ChainKey } from "./chains";

export interface HistoryEntry {
  chain: ChainKey;
  address: string;
  name?: string;
  assetSymbol?: string;
  viewedAt: number;
}

const KEY = "yv3m:vault-history";
const MAX_ENTRIES = 10;
export const HISTORY_EVENT = "yv3m:vault-history-change";

function keyOf(chain: string, address: string) {
  return `${chain}:${address.toLowerCase()}`;
}

function isEntry(v: unknown): v is HistoryEntry {
  if (!v || typeof v !== "object") return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.chain === "string" &&
    isChainKey(e.chain) &&
    typeof e.address === "string" &&
    typeof e.viewedAt === "number"
  );
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEntry);
  } catch {
    return [];
  }
}

function persist(entries: HistoryEntry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    // quota / private mode — ignore
  }
}

export function recordVaultVisit(entry: HistoryEntry): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const k = keyOf(entry.chain, entry.address);
  const next = [
    entry,
    ...getHistory().filter((e) => keyOf(e.chain, e.address) !== k),
  ].slice(0, MAX_ENTRIES);
  persist(next);
  return next;
}

export function removeEntry(chain: ChainKey, address: string): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const k = keyOf(chain, address);
  const next = getHistory().filter((e) => keyOf(e.chain, e.address) !== k);
  persist(next);
  return next;
}

export function clearHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    // ignore
  }
  return [];
}
