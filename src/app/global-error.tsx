"use client";

import Link from "next/link";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-cream">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-lg border border-gold-200/70 bg-white p-8 text-center shadow-sm">
            <p className="font-display text-6xl font-semibold text-gold-600" aria-hidden>
              !
            </p>
            <h2 className="font-display mt-4 text-2xl font-semibold text-ink">
              Something went very wrong
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              We hit a snag while setting up this page. Try again, or head back
              home.
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
      </body>
    </html>
  );
}
