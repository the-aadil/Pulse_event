import type { Metadata } from "next";
import Link from "next/link";
import { EventForm } from "@/components/admin/event-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Event",
  robots: { index: false, follow: false },
};

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
        >
          ← Back to events
        </Link>
        <h1 className="admin-heading mt-2">Create a new event</h1>
        <p className="admin-subheading">
          The event will appear on the website immediately after saving.
        </p>
      </div>
      <div className="admin-card p-6 sm:p-8">
        <EventForm />
      </div>
    </div>
  );
}
