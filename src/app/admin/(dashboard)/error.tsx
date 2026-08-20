"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminDashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Admin] Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
      <div className="admin-card w-full max-w-md p-8 text-center shadow-2xl">
        <p className="font-display text-5xl font-semibold text-amber-400" aria-hidden>
          ⚠️
        </p>
        <h2 className="admin-heading mt-4 text-xl font-bold">
          Admin Dashboard Error
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          An error occurred while loading dashboard records. You can retry or return to the main overview.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => unstable_retry()}
            className="btn btn-primary btn-sm cursor-pointer"
          >
            Retry
          </button>
          <Link href="/admin" className="btn btn-outline btn-sm">
            Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
