import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    /* Use the site's dark background so the nav blends seamlessly */
    <div className="flex min-h-screen flex-col" style={{ background: "#0b0c10" }}>
      <AdminNav user={user} />
      {/* Content area uses a slightly lighter dark card background */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
