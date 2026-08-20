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
import { ProfileAvatar } from "@/components/admin/profile-avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: TicketIcon },
  { href: "/admin/enquiries", label: "Enquiries", icon: InboxIcon },
  { href: "/admin/events", label: "Events", icon: PartyPopperIcon },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

/** Inline logo that matches the public site exactly — heartbeat SVG + wordmark */
function AdminLogo() {
  return (
    <Link
      href="/admin"
      className="flex items-center"
      aria-label="Pulse Event Admin"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1050 430"
        className="h-8 w-auto"
        aria-label="Pulse Event Logo"
      >
        <defs>
          <style>{`
            .admin-pulse-stroke {
              stroke: #FFB400;
              stroke-width: 28;
              stroke-linecap: round;
              stroke-linejoin: round;
              fill: none;
              filter: drop-shadow(0 0 10px rgba(255,180,0,0.7)) drop-shadow(0 0 20px rgba(255,180,0,0.35));
            }
            .admin-logo-text {
              font-family: 'Playfair Display', 'Didot', 'Times New Roman', serif;
              font-size: 150px;
              font-weight: 700;
              fill: #f8fafc;
            }
            .admin-logo-sub {
              font-family: 'Playfair Display', 'Didot', 'Times New Roman', serif;
              font-size: 150px;
              font-weight: 700;
              letter-spacing: 0.05em;
              fill: #f8fafc;
            }
          `}</style>
        </defs>
        <g>
          <path
            className="admin-pulse-stroke"
            d="M 35,235 L 85,235 C 100,235 115,220 115,205 L 115,135 C 115,110 170,110 170,135 L 170,325 C 170,358 225,358 225,325 L 225,155 C 225,130 280,130 280,155 L 280,220 C 280,235 300,235 335,235 C 425,235 425,55 335,55 L 170,55"
          />
          <text x="450" y="205" className="admin-logo-text">ulse</text>
          <text x="380" y="340" className="admin-logo-sub">event</text>
        </g>
      </svg>
    </Link>
  );
}

export function AdminNav({
  user,
}: {
  user: { id?: string; name: string; email: string; updatedAt?: Date | string | number };
}) {
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
    <nav
      className="sticky top-0 z-50 w-full border-b border-gold-500/30 bg-[#08090c]/95 shadow-lg backdrop-blur-2xl"
      aria-label="Admin navigation"
    >
      {/* Bottom gold gradient rule — identical to public header */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent"
        aria-hidden
      />

      {/* Main row */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <AdminLogo />

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "text-gold-300 font-semibold drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]"
                    : "text-slate-300 hover:text-gold-200"
                )}
                aria-current={active ? "page" : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                {active && (
                  <span
                    className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-gold-500 via-yellow-300 to-gold-500 shadow-[0_0_8px_#eab308]"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: user avatar + user info + logout */}
        <div className="flex items-center gap-3">
          {user.id ? (
            <ProfileAvatar
              userId={user.id}
              name={user.name}
              updatedAt={user.updatedAt}
              size="sm"
            />
          ) : null}
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
            <p className="text-[11px] text-slate-400 leading-tight">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={pending}
            className="btn btn-light-outline btn-sm flex items-center gap-1.5"
            aria-label="Sign out of admin panel"
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">
              {pending ? "Signing out…" : "Logout"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile tab strip */}
      <div
        className="flex items-center gap-1 overflow-x-auto border-t border-gold-500/20 px-4 pb-2 pt-1 lg:hidden"
        role="tablist"
      >
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              role="tab"
              aria-selected={active}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "text-gold-300 font-semibold"
                  : "text-slate-400 hover:text-gold-200"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {active && (
                <span
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-gold-500 via-yellow-300 to-gold-500"
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
