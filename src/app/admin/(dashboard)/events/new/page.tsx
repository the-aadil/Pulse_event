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
          className="text-sm font-semibold text-brand-700 hover:underline"
        >
          ← Back to events
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">Create a new event</h1>
        <p className="mt-1 text-sm text-ink/60">
          The event will appear on the website immediately after saving.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <EventForm />
      </div>
    </div>
  );
}
