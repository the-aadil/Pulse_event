import Link from "next/link";
import type { EventType } from "@/generated/prisma/client";
import { EventCard } from "@/components/site/event-card";
import { SectionHeading } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { ArrowRightIcon } from "@/components/icons";

export function FeaturedEvents({ events }: { events: EventType[] }) {
  return (
    <section className="bg-[#0b0c10] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="up">
          <SectionHeading
            dark
            eyebrow="Our Expertise"
            title="Experiences designed to inspire"
            description="Share your vision with us, and watch as we weave creativity, passion, and precision into an unforgettable celebration."
          />
        </Reveal>
        <Stagger
          gap={140}
          itemClassName="h-full"
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Stagger>
        <Reveal variant="fade" delay={150} className="mt-14 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-xl border border-gold-500/40 bg-gold-950/30 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all hover:scale-105 hover:border-gold-400 hover:bg-gold-500 hover:text-slate-950"
          >
            View all events
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
