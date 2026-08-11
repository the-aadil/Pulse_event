import type { Metadata } from "next";
import Link from "next/link";
import { getEnquiries } from "@/lib/data";
import { EnquiryRowActions } from "@/components/admin/enquiry-actions";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enquiries",
  robots: { index: false, follow: false },
};

const filters = ["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"] as const;

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = (filters as readonly string[]).includes(status ?? "ALL")
    ? (status as (typeof filters)[number])
    : "ALL";
  const enquiries = await getEnquiries(active);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Enquiries</h1>
          <p className="mt-1 text-sm text-ink/60">
            {enquiries.length} enquiry{enquiries.length === 1 ? "" : "s"}
            {active !== "ALL" ? ` in ${active}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <Link
              key={f}
              href={f === "ALL" ? "/admin/enquiries" : `/admin/enquiries?status=${f}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                active === f
                  ? "bg-brand-600 text-white"
                  : "bg-white text-ink/60 ring-1 ring-slate-200 hover:bg-slate-50"
              )}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-4xl" aria-hidden>
            📭
          </p>
          <p className="mt-3 font-semibold text-ink">No enquiries found</p>
          <p className="mt-1 text-sm text-ink/50">
            There are no enquiries{active !== "ALL" ? ` with status ${active}` : ""} yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <article
              key={e.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-ink">{e.name}</h2>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                        e.status === "NEW"
                          ? "bg-accent-50 text-accent-700"
                          : e.status === "READ"
                            ? "bg-blue-50 text-blue-700"
                            : e.status === "REPLIED"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {e.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {e.subject ? (
                      <span className="font-semibold text-ink/80">
                        {e.subject}
                        <span className="mx-1.5 text-ink/30">·</span>
                      </span>
                    ) : null}
                    <span className="text-ink/50">{formatDateTime(e.createdAt)}</span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                    <a href={`mailto:${e.email}`} className="hover:underline">
                      {e.email}
                    </a>
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="hover:underline">
                        {e.phone}
                      </a>
                    )}
                  </div>
                </div>
                <EnquiryRowActions enquiryId={e.id} status={e.status} />
              </div>
              <p className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-ink/75">
                {e.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
