"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { adminLogout } from "@/app/actions";
import {
  LayoutDashboardIcon,
  TicketIcon,
  InboxIcon,
  PartyPopperIcon,
  LogOutIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/bookings", label: "Bookings", icon: TicketIcon },
  { href: "/admin/enquiries", label: "Enquiries", icon: InboxIcon },
  { href: "/admin/events", label: "Events", icon: PartyPopperIcon },
];

export function AdminNav({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await adminLogout();
      router.push("/admin/login");
      router.refresh();
    });
  }

  return (
    <nav className="bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-gold-400 to-gold-600 font-display text-sm font-bold text-white">
            P
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Pulse Event</p>
            <p className="text-[11px] text-white/50">Admin panel</p>
          </div>
        </div>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold">{user.name}</p>
            <p className="text-[11px] text-white/50">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={pending}
            className="btn btn-light-outline btn-sm"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
