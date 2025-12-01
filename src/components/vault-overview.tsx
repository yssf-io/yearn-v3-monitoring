import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VaultData } from "@/lib/types";
import { formatCurrency, formatTokenAmount, formatDateTime, formatDuration } from "@/lib/format";
import { Activity, AlertTriangle, Banknote, Clock, Coins, Lock, TrendingUp, Wallet } from "lucide-react";

interface VaultOverviewProps {
    data: VaultData;
}

export function VaultOverview({ data }: VaultOverviewProps) {
    const metrics = [
        {
            label: "Total Assets",
            value: formatTokenAmount(data.totalAssets, data.decimals),
            subValue: data.assetSymbol,
            icon: Wallet,
        },
        {
            label: "Price Per Share",
            value: formatTokenAmount(data.pricePerShare, data.decimals),
            subValue: `1 ${data.symbol} = ${formatTokenAmount(data.pricePerShare, data.decimals)} ${data.assetSymbol}`,
            icon: TrendingUp,
        },
        {
            label: "Total Idle",
            value: formatTokenAmount(data.totalIdle, data.decimals),
            subValue: data.assetSymbol,
            icon: Banknote,
        },
        {
            label: "Total Debt",
            value: formatTokenAmount(data.totalDebt, data.decimals),
            subValue: "Deployed to Strategies",
            icon: Coins,
        },
        {
            label: "Deposit Limit",
            value: formatTokenAmount(data.depositLimit, data.decimals),
            subValue: data.assetSymbol,
            icon: Lock,
        },
        {
            label: "Profit Unlock",
            value: formatDuration(data.profitUnlockTime),
            subValue: `Full: ${formatDateTime(data.fullProfitUnlockDate)}`,
            icon: Clock,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{data.name}</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        {data.symbol} • {data.address}
                        {data.isShutdown && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                Shutdown
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric) => (
                    <Card key={metric.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {metric.label}
                            </CardTitle>
                            <metric.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {metric.subValue}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
