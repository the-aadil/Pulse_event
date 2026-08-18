import type { Metadata } from "next";
import Link from "next/link";
import { getBookingsByStatus } from "@/lib/data";
import { BookingRowActions } from "@/components/admin/booking-actions";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

const filters = ["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;

const filterStyles: Record<string, string> = {
  active: "bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40",
  inactive: "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:bg-white/8 hover:text-slate-200",
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = (filters as readonly string[]).includes(status ?? "ALL")
    ? (status as (typeof filters)[number])
    : "ALL";
  const bookings = await getBookingsByStatus(active);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-heading">Bookings</h1>
          <p className="admin-subheading">
            {bookings.length} booking{bookings.length === 1 ? "" : "s"}
            {active !== "ALL" ? ` · ${active}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <Link
              key={f}
              href={f === "ALL" ? "/admin/bookings" : `/admin/bookings?status=${f}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                active === f ? filterStyles.active : filterStyles.inactive
              )}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-4xl" aria-hidden>📭</p>
          <p className="mt-3 font-semibold text-slate-200">No bookings found</p>
          <p className="mt-1 text-sm text-slate-500">
            There are no bookings{active !== "ALL" ? ` with status ${active}` : ""} yet.
          </p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full text-left">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Guests</th>
                  <th>Received</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="align-top">
                    <td>
                      <p className="font-semibold text-slate-200">{b.name}</p>
                      <p className="cell-muted">
                        <a href={`tel:${b.phone}`} className="hover:text-gold-400 transition-colors">
                          {b.phone}
                        </a>
                        {b.city ? ` · ${b.city}` : ""}
                      </p>
                      <p className="cell-muted mt-0.5 break-all">
                        <a href={`mailto:${b.email}`} className="hover:text-gold-400 transition-colors">
                          {b.email}
                        </a>
                      </p>
                    </td>
                    <td className="capitalize">{b.eventType.replace(/-/g, " ")}</td>
                    <td className="whitespace-nowrap">{b.eventDate}</td>
                    <td>{b.guests}</td>
                    <td className="whitespace-nowrap">
                      <span className="cell-muted">{formatDateTime(b.createdAt)}</span>
                    </td>
                    <td>
                      <BookingRowActions bookingId={b.id} status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
