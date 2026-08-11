import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { PhoneIcon, ArrowRightIcon } from "@/components/icons";

export function CTA() {
  return (
    <section className="bg-cream pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="fade">
          <div className="relative overflow-hidden rounded-lg border border-gold-500/25 bg-ink px-6 py-16 text-center text-cream sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />
            <div className="animate-glow pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
            <div className="animate-glow pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-wine-500/15 blur-3xl [animation-delay:3s]" />
            <div className="relative">
              <p className="mx-auto flex w-fit flex-wrap items-center justify-center gap-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
                <span aria-hidden className="hidden h-px w-8 bg-gold-400 sm:block" />
                Your next chapter
                <span aria-hidden className="hidden h-px w-8 bg-gold-400 sm:block" />
              </p>
              <h2 className="font-display mx-auto mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to create something unforgettable?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream/70">
                Share your ideas with us, and we&apos;ll craft a bespoke celebration that perfectly matches your vision.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/book"
                  className="btn btn-primary btn-shine"
                >
                  Book Your Event
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:${SITE_CONFIG.phone1}`}
                  className="btn btn-light-outline"
                >
                  <PhoneIcon className="h-4 w-4" />
                  {SITE_CONFIG.phone1}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
