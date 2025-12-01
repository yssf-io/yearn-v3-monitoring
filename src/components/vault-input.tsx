"use client";

import { useState } from "react";
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
import { Search } from "lucide-react";

interface VaultInputProps {
    onSearch: (chain: ChainKey, address: string) => void;
    isLoading: boolean;
}

export function VaultInput({ onSearch, isLoading }: VaultInputProps) {
    const [chain, setChain] = useState<ChainKey>("ethereum");
    const [address, setAddress] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (address) {
            onSearch(chain, address);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-1 w-full max-w-2xl mx-auto">
            <Input
                placeholder="Vault Address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
                className="font-mono flex-1"
            />
            <div className="w-full sm:w-[140px]">
                <Select
                    value={chain}
                    onValueChange={(value) => setChain(value as ChainKey)}
                    disabled={isLoading}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Chain" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(chains).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                                {config.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" disabled={!address || isLoading}>
                {isLoading ? "Loading..." : <Search className="w-4 h-4" />}
            </Button>
        </form>
    );
}
