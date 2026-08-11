import Link from "next/link";
import { Logo } from "@/components/site/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 py-20 text-cream">
      <Logo dark />
      <p className="font-display mt-10 text-7xl font-semibold tracking-tight text-gold-400">
        404
      </p>
      <h1 className="font-display mt-4 text-2xl font-semibold sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-cream/65">
        The page you&apos;re looking for doesn&apos;t exist — maybe it was moved,
        or it&apos;s still being decorated for the big day.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
