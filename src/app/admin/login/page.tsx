import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/site/logo";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login — Pulse Event",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    /* Match the exact dark background of the public site */
    <div
      className="flex min-h-screen min-h-dvh items-center justify-center px-4 py-12"
      style={{ background: "#08090c" }}
    >
      {/* Subtle radial glow behind the card */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,180,0,0.12) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="overflow-hidden rounded-2xl shadow-2xl"
          style={{
            background: "#12141c",
            border: "1px solid rgba(255,180,0,0.18)",
          }}
        >
          {/* Top gold gradient rule — same as public header */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, #FFB400 50%, transparent)",
            }}
            aria-hidden
          />

          <div className="px-8 py-10">
            {/* Logo */}
            <div className="flex justify-center">
              <Logo />
            </div>

            {/* Heading */}
            <div className="mt-8 text-center">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-100">
                Admin panel
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Sign in to manage bookings, enquiries and events.
              </p>
            </div>

            {/* Form */}
            <div className="mt-8">
              <LoginForm />
            </div>
          </div>

          {/* Bottom gold gradient rule */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,180,0,0.3) 50%, transparent)",
            }}
            aria-hidden
          />
        </div>

        {/* Back link */}
        <p className="mt-5 text-center text-xs text-slate-500">
          <Link
            href="/"
            className="font-medium text-slate-400 underline underline-offset-2 transition-colors hover:text-gold-300"
          >
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
