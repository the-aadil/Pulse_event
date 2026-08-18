"use client";

import { useTransition, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/app/actions";
import { TrashIcon } from "@/components/icons";

export function EventDeleteButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onDelete = useCallback(() => {
    if (
      !window.confirm(
        "Delete this event permanently? It will be removed from the website immediately."
      )
    ) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteEvent(eventId);
      if (result.status === "error") {
        setError(result.message ?? "Failed to delete.");
      } else {
        router.refresh();
      }
    });
  }, [eventId, router]);

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        onClick={onDelete}
        disabled={pending}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50"
        aria-label="Delete event"
        title="Delete permanently"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
      {error && (
        <span className="text-[11px] font-medium text-red-400">{error}</span>
      )}
    </span>
  );
}
