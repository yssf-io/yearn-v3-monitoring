import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <LogoMark />
          <span>Yearn V3</span>
          <span className="text-muted-foreground font-normal">Monitor</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="relative size-7 rounded-md border border-primary/30 bg-primary/10 overflow-hidden flex items-center justify-center">
      <div className="size-3 rounded-sm bg-primary" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
    </div>
  );
}
