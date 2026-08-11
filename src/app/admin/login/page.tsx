import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/site/logo";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-gold-200/30 bg-white p-8 shadow-2xl">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="mt-6 text-center text-2xl font-semibold text-ink">
            Admin panel
          </h1>
          <p className="mt-1 text-center text-sm text-ink/60">
            Sign in to manage bookings, enquiries and events.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-white/60">
          <Link href="/" className="underline transition-colors hover:text-white">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
