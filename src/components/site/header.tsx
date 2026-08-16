"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/site/logo";
import { MobileNav } from "@/components/site/mobile-nav";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-500/30 bg-[#08090c]/95 shadow-md backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo dark />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-md px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-gold-300 font-semibold drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]"
                    : "text-slate-300 hover:text-gold-200"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-gold-500 via-yellow-300 to-gold-500 shadow-[0_0_8px_#eab308]" aria-hidden />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="!hidden lg:!inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            Book an Event
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
