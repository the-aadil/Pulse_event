import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { PhoneIcon, ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      {/* Ambient glow */}
      <div className="animate-glow pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold-500/15 blur-3xl" />
      <div className="animate-glow pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-wine-500/15 blur-3xl [animation-delay:3s]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

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
          <h1 className="font-display mt-8 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
            Celebrations that make{" "}
            <em className="italic text-gold-300">hearts skip a beat</em>
          </h1>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-cream/70 sm:text-lg">
            We believe your special moments deserve to be nothing short of magical. From intimate gatherings to grand weddings, we handle every detail with love and precision—so you can simply show up, celebrate, and soak in the joy.
          </p>
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
            className="group inline-flex items-center gap-3 text-sm text-cream/80 transition-colors hover:text-gold-300"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20">
              <PhoneIcon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.2em] text-cream/50">
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
