import { formatUnits } from 'viem';

export function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

export function formatTokenAmount(amount: bigint, decimals: number) {
    const formatted = formatUnits(amount, decimals);
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 4,
    }).format(parseFloat(formatted));
}

export function formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatRelativeTime(timestamp: bigint) {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - Number(timestamp);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export function formatDuration(seconds: bigint) {
    const secs = Number(seconds);
    const days = Math.floor(secs / 86400);
    const hours = Math.floor((secs % 86400) / 3600);

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
}

export function formatDateTime(timestamp: bigint) {
    return new Date(Number(timestamp) * 1000).toLocaleString();
}
