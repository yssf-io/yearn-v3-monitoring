import { VaultSearch } from "@/components/vault-search";
import { VaultHistory } from "@/components/vault-history";
import { chains } from "@/lib/chains";
import { Activity, BarChart3, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="relative">
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 backdrop-blur px-3 py-1 text-xs text-muted-foreground mb-6">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full size-1.5 bg-success" />
          </span>
          Read-only · management actions coming soon
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-balance">
          Inspect any{" "}
          <span className="bg-gradient-to-r from-primary via-primary to-chart-3 bg-clip-text text-transparent">
            Yearn V3
          </span>{" "}
          vault
        </h1>
        <p className="mt-5 text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-balance">
          Vault health, strategy allocation and on-chain configuration at a
          glance. Paste an address to begin.
        </p>
        <div className="mt-10">
          <VaultSearch autoFocus />
        </div>
        <VaultHistory />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Chains</span>
          {Object.values(chains).map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card/40 backdrop-blur px-2.5 py-0.5 text-xs"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: c.color }}
                aria-hidden
              />
              {c.name}
            </span>
          ))}
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3 text-left">
          <FeatureCard
            icon={<Activity className="size-4" />}
            title="Live vault health"
            body="Idle vs deployed, deposit capacity, profit unlock — on-chain, every load."
          />
          <FeatureCard
            icon={<BarChart3 className="size-4" />}
            title="Strategy allocation"
            body="See debt vs max, utilization and pending P/L per strategy with stale-report flags."
          />
          <FeatureCard
            icon={<ShieldCheck className="size-4" />}
            title="Roles & config"
            body="Role manager, accountant, factory, queue order and protocol flags in one panel."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border bg-card/60 backdrop-blur p-4 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <div className="size-7 rounded-md bg-primary/10 border border-primary/20 grid place-items-center">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
