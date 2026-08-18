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

const filterStyles: Record<string, string> = {
  active: "bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40",
  inactive: "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:bg-white/8 hover:text-slate-200",
};

const statusBadge: Record<string, string> = {
  NEW: "bg-gold-500/15 text-gold-300 ring-1 ring-gold-500/30",
  READ: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  REPLIED: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  ARCHIVED: "bg-white/8 text-slate-400 ring-1 ring-white/10",
};

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
          <h1 className="admin-heading">Enquiries</h1>
          <p className="admin-subheading">
            {enquiries.length} enquiry{enquiries.length === 1 ? "" : "s"}
            {active !== "ALL" ? ` · ${active}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <Link
              key={f}
              href={f === "ALL" ? "/admin/enquiries" : `/admin/enquiries?status=${f}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                active === f ? filterStyles.active : filterStyles.inactive
              )}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-4xl" aria-hidden>📭</p>
          <p className="mt-3 font-semibold text-slate-200">No enquiries found</p>
          <p className="mt-1 text-sm text-slate-500">
            There are no enquiries{active !== "ALL" ? ` with status ${active}` : ""} yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <article key={e.id} className="admin-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-slate-100">{e.name}</h2>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                        statusBadge[e.status] ?? statusBadge.ARCHIVED
                      )}
                    >
                      {e.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {e.subject ? (
                      <span className="font-semibold text-slate-300">
                        {e.subject}
                        <span className="mx-1.5 text-slate-600">·</span>
                      </span>
                    ) : null}
                    <span>{formatDateTime(e.createdAt)}</span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <a href={`mailto:${e.email}`} className="hover:text-gold-400 transition-colors">
                      {e.email}
                    </a>
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="hover:text-gold-400 transition-colors">
                        {e.phone}
                      </a>
                    )}
                  </div>
                </div>
                <EnquiryRowActions enquiryId={e.id} status={e.status} />
              </div>
              {/* Message body */}
              <div className="admin-gold-rule mt-4" />
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-white/[0.04] p-4 text-sm leading-relaxed text-slate-300">
                {e.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
