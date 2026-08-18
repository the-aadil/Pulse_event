"use client";

import { useTransition, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateBookingStatus, deleteBooking } from "@/app/actions";
import { TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const statuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;

const statusStyles: Record<string, string> = {
  PENDING:   "bg-amber-500/15 text-amber-300 border-amber-500/30",
  CONFIRMED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-red-500/15 text-red-300 border-red-500/30",
  COMPLETED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
};

export function BookingRowActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [selected, setSelected] = useState(status);

  const onStatusChange = useCallback(
    (value: string) => {
      setSelected(value);
      setMessage(null);
      setIsError(false);
      startTransition(async () => {
        const result = await updateBookingStatus(bookingId, value);
        if (result.status === "error") {
          setIsError(true);
          setMessage(result.message ?? "Failed to update.");
        } else {
          setMessage("Saved.");
        }
      });
    },
    [bookingId]
  );

  const onDelete = useCallback(() => {
    if (!window.confirm("Delete this booking permanently? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteBooking(bookingId);
      if (result.status === "error") {
        setIsError(true);
        setMessage(result.message ?? "Failed to delete.");
      } else {
        router.refresh();
      }
    });
  }, [bookingId, router]);

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <select
          value={selected}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={pending}
          aria-label="Update booking status"
          className={cn(
            "cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all",
            "bg-transparent focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-0 disabled:opacity-50",
            statusStyles[selected] ?? statusStyles.PENDING
          )}
          style={{ colorScheme: "dark" }}
        >
          {statuses.map((s) => (
            <option key={s} value={s} style={{ background: "#12141c", color: "#f1f5f9" }}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <button
          onClick={onDelete}
          disabled={pending}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50"
          aria-label="Delete booking"
          title="Delete permanently"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      {message && (
        <span
          className={cn(
            "text-[11px] font-medium",
            isError ? "text-red-400" : "text-emerald-400"
          )}
        >
          {message}
        </span>
      )}
    </div>
  );
}
