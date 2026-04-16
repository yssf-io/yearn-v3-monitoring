import { formatUnits } from "viem";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function formatTokenAmount(amount: bigint, decimals: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(
    parseFloat(formatUnits(amount, decimals))
  );
}

export function formatCompact(amount: bigint, decimals: number) {
  const n = parseFloat(formatUnits(amount < 0n ? -amount : amount, decimals));
  const sign = amount < 0n ? "-" : "";
  if (n === 0) return "0";
  if (n < 0.0001) return `${sign}<0.0001`;
  if (n < 1) return `${sign}${n.toFixed(4)}`;
  if (n < 1000) return `${sign}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)}`;
  return `${sign}${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n)}`;
}

export function formatUnitsFixed(amount: bigint, decimals: number, places: number) {
  return parseFloat(formatUnits(amount, decimals)).toFixed(places);
}

export function formatAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatRelativeTime(timestamp: bigint) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - Number(timestamp);
  if (diff < 0) return "in the future";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

export function formatDuration(seconds: bigint) {
  const s = Number(seconds);
  if (s <= 0) return "—";
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m`;
  return `${s}s`;
}

export function formatDateTime(timestamp: bigint) {
  if (timestamp === 0n) return "—";
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

export function formatPct(ratio: number, places = 1) {
  if (!Number.isFinite(ratio)) return "—";
  return `${(ratio * 100).toFixed(places)}%`;
}
