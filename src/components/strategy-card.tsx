import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StrategyData } from "@/lib/types";
import { formatTokenAmount, formatAddress, formatRelativeTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";

interface StrategyCardProps {
    strategy: StrategyData;
    decimals: number;
    assetSymbol: string;
}

export function StrategyCard({ strategy, decimals, assetSymbol }: StrategyCardProps) {
    const utilization = strategy.maxDebt > 0n
        ? (Number(strategy.currentDebt) / Number(strategy.maxDebt)) * 100
        : 0;

    const copyAddress = () => {
        navigator.clipboard.writeText(strategy.address);
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium truncate pr-4" title={strategy.name}>
                        {strategy.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                    {formatAddress(strategy.address)}
                </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Debt</span>
                    <span className="font-medium">
                        {formatTokenAmount(strategy.currentDebt, decimals)} {assetSymbol}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Debt</span>
                    <span className="font-medium">
                        {formatTokenAmount(strategy.maxDebt, decimals)} {assetSymbol}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-medium">
                        {utilization.toFixed(1)}%
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Report</span>
                    <span className="font-medium">
                        {formatRelativeTime(strategy.lastReport)}
                    </span>
                </div>
                <div className="pt-2">
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all"
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
