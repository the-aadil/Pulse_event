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
          <h1 className="text-2xl font-bold text-ink">Bookings</h1>
          <p className="mt-1 text-sm text-ink/60">
            {bookings.length} booking{bookings.length === 1 ? "" : "s"}
            {active !== "ALL" ? ` in ${active}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <Link
              key={f}
              href={f === "ALL" ? "/admin/bookings" : `/admin/bookings?status=${f}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                active === f
                  ? "bg-brand-600 text-white"
                  : "bg-white text-ink/60 ring-1 ring-slate-200 hover:bg-slate-50"
              )}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-4xl" aria-hidden>
            📭
          </p>
          <p className="mt-3 font-semibold text-ink">No bookings found</p>
          <p className="mt-1 text-sm text-ink/50">
            There are no bookings{active !== "ALL" ? ` with status ${active}` : ""} yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Guests</th>
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{b.name}</p>
                      <p className="text-xs text-ink/50">
                        <a href={`tel:${b.phone}`} className="hover:underline">
                          {b.phone}
                        </a>
                        {b.city ? ` · ${b.city}` : ""}
                      </p>
                      <p className="mt-0.5 break-all text-xs text-ink/40">
                        <a href={`mailto:${b.email}`} className="hover:underline">
                          {b.email}
                        </a>
                      </p>
                    </td>
                    <td className="px-4 py-3 capitalize text-ink/80">
                      {b.eventType.replace(/-/g, " ")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink/80">{b.eventDate}</td>
                    <td className="px-4 py-3 text-ink/80">{b.guests}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-ink/50">
                      {formatDateTime(b.createdAt)}
                    </td>
                    <td className="px-4 py-3">
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
