"use client";

import { useTransition, useState } from "react";
import { updateBookingStatus, deleteBooking } from "@/app/actions";
import { TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const statuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
};

export function BookingRowActions({ bookingId, status }: { bookingId: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState(status);

  function onStatusChange(value: string) {
    setSelected(value);
    setMessage(null);
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, value);
      setMessage(result.message);
    });
  }

  function onDelete() {
    if (!window.confirm("Delete this booking permanently? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteBooking(bookingId);
      if (result.status === "error") setMessage(result.message);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <select
          value={selected}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={pending}
          className={cn(
            "rounded-lg border px-2.5 py-1.5 text-xs font-semibold focus:outline-none disabled:opacity-50",
            statusStyles[selected] ?? statusStyles.PENDING
          )}
          aria-label="Update booking status"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={onDelete}
          disabled={pending}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
          aria-label="Delete booking"
          title="Delete booking"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      {message && (
        <span className="text-[11px] font-medium text-ink/50">{message}</span>
      )}
    </div>
  );
}
