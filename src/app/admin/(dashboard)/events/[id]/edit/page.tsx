import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";
import { getEventById } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Event",
  robots: { index: false, follow: false },
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
        >
          ← Back to events
        </Link>
        <h1 className="admin-heading mt-2">Edit {event.name}</h1>
        <p className="admin-subheading">
          Changes go live on the website as soon as you save.
        </p>
      </div>
      <div className="admin-card p-6 sm:p-8">
        <EventForm event={event} />
      </div>
    </div>
  );
}
