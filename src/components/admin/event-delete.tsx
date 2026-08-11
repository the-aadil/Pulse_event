"use client";

import { useTransition, useState } from "react";
import { deleteEvent } from "@/app/actions";
import { TrashIcon } from "@/components/icons";

export function EventDeleteButton({ eventId }: { eventId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onDelete() {
    if (
      !window.confirm(
        "Delete this event permanently? This removes it from the website and cannot be undone."
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteEvent(eventId);
      if (result.status === "error") setMessage(result.message);
    });
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        onClick={onDelete}
        disabled={pending}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
        aria-label="Delete event"
        title="Delete event"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
      {message && <span className="text-[11px] font-medium text-ink/50">{message}</span>}
    </span>
  );
}
