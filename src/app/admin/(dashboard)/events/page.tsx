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
          <h1 className="admin-heading">Events</h1>
          <p className="admin-subheading">
            {events.length} event{events.length === 1 ? "" : "s"} — create, edit or remove packages.
          </p>
        </div>
        <Link href="/admin/events/new" className="btn btn-primary btn-sm">
          <PlusIcon className="h-4 w-4" />
          New event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-4xl" aria-hidden>🎪</p>
          <p className="mt-3 font-semibold text-slate-200">No events yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first event package to show it on the website.
          </p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full text-left">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="align-middle">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-white/8">
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
                          <p className="font-semibold text-slate-200">{event.name}</p>
                          <p className="cell-muted">/events/{event.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">
                      {formatINR(event.priceFrom) ?? "—"}
                    </td>
                    <td>{event.capacity?.toLocaleString("en-IN") ?? "—"}</td>
                    <td>{event.sortOrder}</td>
                    <td>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          event.featured
                            ? "bg-gold-500/15 text-gold-300 ring-1 ring-gold-500/30"
                            : event.active
                              ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                              : "bg-white/8 text-slate-500 ring-1 ring-white/10"
                        )}
                      >
                        {event.featured ? "Featured" : event.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-gold-500/40 hover:text-gold-300"
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
