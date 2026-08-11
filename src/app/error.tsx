"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-cream px-4 py-20">
      <div className="w-full max-w-md rounded-lg border border-gold-200/70 bg-white p-8 text-center shadow-sm">
        <p className="font-display text-6xl font-semibold text-gold-600" aria-hidden>
          !
        </p>
        <h2 className="font-display mt-4 text-2xl font-semibold text-ink">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          An unexpected error occurred while loading this page. Please try again —
          the celebration continues.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => unstable_retry()} className="btn btn-dark">
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
