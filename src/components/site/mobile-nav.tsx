"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

  // Close on click outside, handle resize, escape key
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

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
    }

    function handleResize() {
      // Auto-close the mobile menu if the screen gets resized to desktop size
      if (window.innerWidth >= 1024) {
        close();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);


  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-200 transition-colors hover:bg-gold-500/20"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-x-0 bottom-0 top-16 z-40 lg:hidden">
            {/* Visual backdrop — purely decorative, closing is handled by click-outside above */}
            <div
              className="absolute inset-0 bg-[#08090c]/80 backdrop-blur-md"
              aria-hidden="true"
            />
            <nav
              ref={navRef}
              className="relative mx-3 mt-2 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-lg border border-gold-500/30 bg-[#12141c] p-4 shadow-2xl"
            >
              <ul className="flex flex-col gap-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className={cn(
                        "block rounded-md px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-gold-500/15 hover:text-gold-300"
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
                className="btn btn-primary mt-4 w-full uppercase tracking-wider"
              >
                Book an Event
              </Link>
            </nav>
          </div>,
          document.body
        )}
    </div>
  );
}
