import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { PhoneIcon, ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { FloatingBubbles } from "@/components/motion/floating-bubbles";
import { FloatingDotsCanvas } from "@/components/motion/floating-dots-canvas";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0b0c10] text-slate-100">
      {/* Pure-CSS GPU-accelerated floating bubbles */}
      <FloatingBubbles count={8} />

      {/* Ambient gold glow orbs */}
      <div className="animate-glow pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold-500/10 blur-3xl" />
      <div className="animate-glow pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-amber-500/8 blur-3xl [animation-delay:3s]" />

      {/* High-Performance HTML5 Canvas floating dots (Zero DOM overhead) */}
      <FloatingDotsCanvas particleCount={40} />

      {/* Drifting ambient shapes */}
      <div className="animate-drift pointer-events-none absolute right-[10%] top-[25%] h-24 w-24 rounded-full border border-gold-500/5 [animation-delay:1s]" />
      <div className="animate-drift pointer-events-none absolute left-[8%] bottom-[20%] h-32 w-32 rounded-full border border-gold-400/5 [animation-delay:4s]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-20 lg:px-8">
        <Reveal
          variant="up"
          className="inline-flex flex-wrap items-center justify-center gap-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold-300"
        >
          <span aria-hidden className="hidden h-px w-8 bg-gold-400 sm:block" />
          Crafting unforgettable memories in Pune
          <span aria-hidden className="hidden h-px w-8 bg-gold-400 sm:block" />
        </Reveal>

        <Reveal variant="up" delay={100}>
          <h1 className="animate-text-glow font-display mt-8 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
            Celebrations that make{" "}
            <em className="italic text-gold-300">hearts skip a beat</em>
          </h1>
        </Reveal>


        <Reveal variant="up" delay={300} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/book" className="btn btn-primary btn-shine">
            Book an Event
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link href="/events" className="btn btn-light-outline">
            Explore Events
          </Link>
        </Reveal>

        <Reveal variant="up" delay={400} className="mt-14 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <a
            href={`tel:${SITE_CONFIG.phone1}`}
            className="group inline-flex items-center gap-3 text-sm text-slate-300 transition-colors hover:text-gold-300"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/30 transition-all group-hover:border-gold-400 group-hover:shadow-[0_0_12px_rgba(212,175,55,0.3)]">
              <PhoneIcon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">
                Call us anytime
              </span>
              <span className="text-base font-semibold">
                {SITE_CONFIG.phone1}
              </span>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
