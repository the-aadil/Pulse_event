import type { Metadata } from "next";
import Link from "next/link";
import {
  getDashboardStats,
  getRecentBookings,
  getEnquiries,
} from "@/lib/data";
import { formatDateTime, formatINR } from "@/lib/utils";
import { TicketIcon, InboxIcon, UsersRoundIcon, AlertTriangleIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  const [stats, recentBookings, recentEnquiries] = await Promise.all([
    getDashboardStats(),
    getRecentBookings(6),
    getEnquiries("NEW"),
  ]);

  const cards = [
    {
      label: "Total bookings",
      value: stats.totalBookings,
      icon: TicketIcon,
      accent: "bg-brand-50 text-brand-700",
      href: "/admin/bookings",
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      icon: AlertTriangleIcon,
      accent: "bg-amber-50 text-amber-600",
      href: "/admin/bookings?status=PENDING",
    },
    {
      label: "Confirmed",
      value: stats.confirmedBookings,
      icon: UsersRoundIcon,
      accent: "bg-emerald-50 text-emerald-600",
      href: "/admin/bookings?status=CONFIRMED",
    },
    {
      label: "New enquiries",
      value: stats.unreadEnquiries,
      icon: InboxIcon,
      accent: "bg-accent-50 text-accent-600",
      href: "/admin/enquiries",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">
          Welcome back. Here&apos;s what&apos;s happening at Pulse Event.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.accent}`}>
                <card.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-ink">{card.value}</p>
            <p className="mt-1 text-sm font-medium text-ink/60">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Recent bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              View all
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="mt-6 text-sm text-ink/50">
              No bookings yet. Share the site and watch them roll in!
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {recentBookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {b.name} · {b.eventType.replace(/-/g, " ")}
                    </p>
                    <p className="text-xs text-ink/50">
                      {formatDateTime(b.createdAt)} · {b.guests} guests
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      b.status === "CONFIRMED"
                        ? "bg-emerald-50 text-emerald-700"
                        : b.status === "CANCELLED"
                          ? "bg-red-50 text-red-600"
                          : b.status === "COMPLETED"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">New enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              View all
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="mt-6 text-sm text-ink/50">
              No new enquiries. You&apos;re all caught up!
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="py-3">
                  <p className="truncate text-sm font-semibold text-ink">
                    {e.name}
                    {e.subject ? ` — ${e.subject}` : ""}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink/50">
                    {e.message}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink/40">
                    {formatDateTime(e.createdAt)} · {e.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-ink">Quick facts</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-2xl font-extrabold text-ink">
              {stats.totalGuests.toLocaleString("en-IN")}
            </p>
            <p className="text-xs font-medium text-ink/60">
              Total guests across all bookings
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-2xl font-extrabold text-ink">
              {formatINR(stats.totalBookings * 15000) ?? "—"}
            </p>
            <p className="text-xs font-medium text-ink/60">
              Indicative pipeline (est. ₹15k avg)
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-2xl font-extrabold text-ink">
              {stats.pendingBookings}
            </p>
            <p className="text-xs font-medium text-ink/60">
              Bookings awaiting your reply
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
