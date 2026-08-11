import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="Pulse Event home"
    >
      <span className="flex h-9 w-9 items-center justify-center border border-gold-400/70 bg-gradient-to-br from-gold-400 to-gold-600 font-display text-lg font-bold text-white shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:shadow-gold-500/30">
        P
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-wide",
            dark ? "text-cream" : "text-ink"
          )}
        >
          Pulse&nbsp;Event
        </span>
        <span
          className={cn(
            "mt-1 text-[9px] font-semibold uppercase tracking-[0.35em]",
            dark ? "text-gold-400" : "text-gold-600"
          )}
        >
          Events · Pune
        </span>
      </span>
    </Link>
  );
}
