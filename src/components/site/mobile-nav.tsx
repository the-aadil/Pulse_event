"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MenuIcon, CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
  }

  // Close on click outside (works anywhere on screen, including header area)
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      const insideNav = navRef.current?.contains(target);
      const insideToggle = toggleRef.current?.contains(target);
      if (!insideNav && !insideToggle) {
        close();
      }
    }

    // Use capture so we catch clicks before anything else
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [open]);


  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-gold-100"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden">
          {/* Visual backdrop — purely decorative, closing is handled by click-outside above */}
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <nav
            ref={navRef}
            className="relative mx-3 mt-2 max-h-[calc(100dvh-4.5rem)] overflow-y-auto rounded-lg border border-gold-200/70 bg-white p-4 shadow-xl shadow-ink/10"
          >
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className={cn(
                      "block rounded-md px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-gold-50 hover:text-gold-700"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/book"
              onClick={close}
              className="btn btn-primary mt-3 w-full"
            >
              Book an Event
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
