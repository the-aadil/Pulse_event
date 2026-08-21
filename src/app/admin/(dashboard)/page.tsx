import type { Metadata } from "next";
import Link from "next/link";
import {
  getDashboardStats,
  getRecentBookings,
  getEnquiries,
} from "@/lib/data";
import { formatDateTime, formatINR } from "@/lib/utils";
import {
  TicketIcon,
  InboxIcon,
  UsersRoundIcon,
  AlertTriangleIcon,
} from "@/components/icons";
import { OwnerPhotoUpload } from "@/components/admin/owner-photo-upload";
import { getOwnerPhotoSrc } from "@/app/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const statusBadge: Record<string, string> = {
  CONFIRMED: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  CANCELLED: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
  COMPLETED: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  PENDING: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
};

export default async function AdminDashboard() {
  const [stats, recentBookings, recentEnquiries, ownerPhotoSrc] = await Promise.all([
    getDashboardStats(),
    getRecentBookings(6),
    getEnquiries("NEW"),
    getOwnerPhotoSrc(),
  ]);

  const cards = [
    {
      label: "Total bookings",
      value: stats.totalBookings,
      icon: TicketIcon,
      iconBg: "bg-gold-500/15 text-gold-300",
      href: "/admin/bookings",
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      icon: AlertTriangleIcon,
      iconBg: "bg-amber-500/15 text-amber-300",
      href: "/admin/bookings?status=PENDING",
    },
    {
      label: "Confirmed",
      value: stats.confirmedBookings,
      icon: UsersRoundIcon,
      iconBg: "bg-emerald-500/15 text-emerald-300",
      href: "/admin/bookings?status=CONFIRMED",
    },
    {
      label: "New enquiries",
      value: stats.unreadEnquiries,
      icon: InboxIcon,
      iconBg: "bg-blue-500/15 text-blue-300",
      href: "/admin/enquiries",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="admin-heading">Dashboard</h1>
        <p className="admin-subheading">
          Welcome back. Here&apos;s what&apos;s happening at Pulse Event.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="admin-card admin-card-hover block p-5"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <card.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="admin-stat-value mt-4">{card.value}</p>
            <p className="admin-stat-label">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Owner photo upload */}
      <OwnerPhotoUpload currentSrc={ownerPhotoSrc} />

      {/* Recent tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent bookings */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">Recent bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="admin-gold-rule mt-4" />
          {recentBookings.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">
              No bookings yet. Share the site and watch them roll in!
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-white/5">
              {recentBookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-200">
                      {b.name} · {b.eventType.replace(/-/g, " ")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(b.createdAt)} · {b.guests} guests{b.city ? ` · 📍 ${b.city}` : ""}
                    </p>
                    {b.message && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-gold-400/90 italic">
                        &ldquo;{b.message}&rdquo;
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      statusBadge[b.status] ?? statusBadge.PENDING
                    }`}
                  >
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* New enquiries */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">New enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="admin-gold-rule mt-4" />
          {recentEnquiries.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">
              No new enquiries. You&apos;re all caught up!
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-white/5">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="py-3">
                  <p className="truncate text-sm font-semibold text-slate-200">
                    {e.name}
                    {e.subject ? ` — ${e.subject}` : ""}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{e.message}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {formatDateTime(e.createdAt)} · {e.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick facts */}
      <div className="admin-card p-6">
        <h2 className="text-base font-bold text-slate-100">Quick facts</h2>
        <div className="admin-gold-rule mt-4" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              value: stats.totalGuests.toLocaleString("en-IN"),
              label: "Total guests across all bookings",
            },
            {
              value: formatINR(stats.totalBookings * 15000) ?? "—",
              label: "Indicative pipeline (est. ₹15k avg)",
            },
            {
              value: stats.pendingBookings,
              label: "Bookings awaiting your reply",
            },
          ].map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl border border-white/6 bg-white/[0.03] p-4"
            >
              <p className="admin-stat-value">{fact.value}</p>
              <p className="admin-stat-label">{fact.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
