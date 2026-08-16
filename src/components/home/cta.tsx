import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { Reveal } from "@/components/motion/reveal";
import { PhoneIcon, ArrowRightIcon } from "@/components/icons";

export function CTA() {
  return (
    <section className="bg-[#0b0c10] pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="fade">
          <div className="relative overflow-hidden rounded-2xl border border-gold-500/30 bg-[#12141c] px-6 py-16 text-center text-slate-100 sm:px-12 sm:py-20 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
            <div className="animate-glow pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="animate-glow pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl [animation-delay:3s]" />
            <div className="relative">
              <p className="mx-auto flex w-fit flex-wrap items-center justify-center gap-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                <span aria-hidden className="hidden h-px w-8 bg-gold-400 sm:block" />
                Your next chapter
                <span aria-hidden className="hidden h-px w-8 bg-gold-400 sm:block" />
              </p>
              <h2 className="font-display mx-auto mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
                Ready to create something unforgettable?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                Share your ideas with us, and we&apos;ll craft a bespoke celebration that perfectly matches your vision.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all hover:scale-105 active:scale-95"
                >
                  Book Your Event
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:${SITE_CONFIG.phone1}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold-500/40 bg-gold-950/20 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-300 transition-all hover:border-gold-300 hover:bg-gold-500 hover:text-slate-950"
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
