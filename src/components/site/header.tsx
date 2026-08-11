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
    <header className="sticky top-0 z-50 w-full border-b border-gold-200/60 bg-cream/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

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
                  "nav-link rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-gold-700 font-semibold"
                    : "text-ink-soft hover:text-ink"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-gold-500" aria-hidden />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="btn btn-dark btn-sm hidden sm:inline-flex"
          >
            Book an Event
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
