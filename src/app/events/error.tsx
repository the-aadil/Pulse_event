"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function EventsError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Events] Segment error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#0b0c10] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gold-500/20 bg-[#12141c] p-8 text-center shadow-xl">
        <p className="font-display text-5xl font-semibold text-gold-400" aria-hidden>
          🎪
        </p>
        <h2 className="font-display mt-4 text-2xl font-semibold text-slate-100">
          Events unavailable
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          We encountered an issue loading our event experiences. Please try again.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => unstable_retry()}
            className="btn btn-primary cursor-pointer"
          >
            Retry
          </button>
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
