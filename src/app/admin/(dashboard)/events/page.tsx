import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAdminEvents } from "@/lib/data";
import { EventDeleteButton } from "@/components/admin/event-delete";
import { formatINR } from "@/lib/utils";
import { PlusIcon, PencilIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Events",
  robots: { index: false, follow: false },
};

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Events</h1>
          <p className="mt-1 text-sm text-ink/60">
            {events.length} event{events.length === 1 ? "" : "s"} — create, edit or
            remove event packages.
          </p>
        </div>
        <Link href="/admin/events/new" className="btn btn-dark btn-sm">
          <PlusIcon className="h-4 w-4" />
          New event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-4xl" aria-hidden>
            🎪
          </p>
          <p className="mt-3 font-semibold text-ink">No events yet</p>
          <p className="mt-1 text-sm text-ink/50">
            Create your first event package to show it on the website.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Capacity</th>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => (
                  <tr key={event.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                          {event.image ? (
                            <Image
                              src={event.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{event.name}</p>
                          <p className="text-xs text-ink/45">
                            /events/{event.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                      {formatINR(event.priceFrom) ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink/80">
                      {event.capacity?.toLocaleString("en-IN") ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink/80">{event.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          event.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500",
                          event.featured && "bg-brand-50 text-brand-700"
                        )}
                      >
                        {event.featured
                          ? "Featured"
                          : event.active
                            ? "Active"
                            : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-ink/60 transition-colors hover:bg-slate-50"
                          aria-label={`Edit ${event.name}`}
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <EventDeleteButton eventId={event.id} />
                      </div>
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
