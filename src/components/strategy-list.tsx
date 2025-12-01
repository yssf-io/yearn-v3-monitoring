import { StrategyData } from "@/lib/types";
import { StrategyCard } from "./strategy-card";

interface StrategyListProps {
    strategies: StrategyData[];
    decimals: number;
    assetSymbol: string;
}

export function StrategyList({ strategies, decimals, assetSymbol }: StrategyListProps) {
    if (strategies.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                No strategies active
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">Active Strategies ({strategies.length})</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {strategies.map((strategy) => (
                    <StrategyCard
                        key={strategy.address}
                        strategy={strategy}
                        decimals={decimals}
                        assetSymbol={assetSymbol}
                    />
                ))}
            </div>
        </div>
    );
}
