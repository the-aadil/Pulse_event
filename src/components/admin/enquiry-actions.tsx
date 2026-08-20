"use client";

import { useTransition, useState, useCallback, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { updateEnquiryStatus, deleteEnquiry } from "@/app/actions";
import { TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const statuses = ["NEW", "READ", "REPLIED", "ARCHIVED"] as const;

const statusStyles: Record<string, string> = {
  NEW:      "bg-gold-500/15 text-gold-300 border-gold-500/30",
  READ:     "bg-blue-500/15 text-blue-300 border-blue-500/30",
  REPLIED:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  ARCHIVED: "bg-white/8 text-slate-400 border-white/15",
};

export function EnquiryRowActions({
  enquiryId,
  status,
}: {
  enquiryId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    status,
    (_current, newStatus: string) => newStatus
  );

  const onStatusChange = useCallback(
    (value: string) => {
      setMessage(null);
      setIsError(false);
      startTransition(async () => {
        setOptimisticStatus(value);
        const result = await updateEnquiryStatus(enquiryId, value);
        if (result.status === "error") {
          setIsError(true);
          setMessage(result.message ?? "Failed to update.");
        } else {
          setMessage("Saved.");
        }
      });
    },
    [enquiryId, setOptimisticStatus]
  );

  const onDelete = useCallback(() => {
    if (!window.confirm("Delete this enquiry permanently? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteEnquiry(enquiryId);
      if (result.status === "error") {
        setIsError(true);
        setMessage(result.message ?? "Failed to delete.");
      } else {
        router.refresh();
      }
    });
  }, [enquiryId, router]);

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <select
          value={optimisticStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={pending}
          aria-label="Update enquiry status"
          className={cn(
            "cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all",
            "bg-transparent focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-0 disabled:opacity-50",
            statusStyles[optimisticStatus] ?? statusStyles.ARCHIVED
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
          aria-label="Delete enquiry"
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
