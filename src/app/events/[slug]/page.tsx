import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell, Container } from "@/components/site/shell";
import { getEventBySlug, getActiveEvents } from "@/lib/data";
import { EventCard } from "@/components/site/event-card";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { formatINR } from "@/lib/utils";
import { UsersRoundIcon, WalletIcon, CalendarIcon, ArrowRightIcon, CheckIcon } from "@/components/icons";
import { SITE_CONFIG } from "@/lib/config";

export const revalidate = 300;

export async function generateStaticParams() {
  const events = await getActiveEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return { title: "Event not found" };
  }
  return {
    title: event.name,
    description: event.tagline ?? event.description.slice(0, 160),
    openGraph: {
      title: `${event.name} | ${SITE_CONFIG.name}`,
      description: event.tagline ?? event.description.slice(0, 160),
      images: event.image ? [{ url: event.image }] : undefined,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    notFound();
  }

  const otherEvents = (await getActiveEvents())
    .filter((e) => e.id !== event.id)
    .slice(0, 3);
  const price = formatINR(event.priceFrom);

  return (
    <SiteShell>
      <section className="bg-[#0b0c10] text-slate-100 py-12 sm:py-16">
        <Container>
          <Reveal variant="fade" as="nav" className="mb-8 text-sm text-slate-400" >
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition-colors hover:text-gold-300">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/events" className="transition-colors hover:text-gold-300">
                  Events
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-gold-300">{event.name}</li>
            </ol>
          </Reveal>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal variant="left" className="relative overflow-hidden rounded-lg border border-gold-500/20 shadow-lg">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.name}
                  width={800}
                  height={600}
                  className="h-auto w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-slate-900">
                  <span className="font-display text-7xl font-bold text-gold-400">
                    {event.name.charAt(0)}
                  </span>
                </div>
              )}
            </Reveal>

            <Reveal variant="right" delay={100}>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
                {event.name}
              </h1>
              {event.tagline && (
                <p className="mt-3 text-lg font-medium text-gold-400">
                  {event.tagline}
                </p>
              )}
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                {event.description}
              </p>

              <Stagger gap={150} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {price && (
                  <div className="flex items-center gap-3 rounded-lg border border-gold-500/20 bg-[#12141c] p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold-500/40 bg-gold-950/40 text-gold-400">
                      <WalletIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gold-400/80">
                        Starting at
                      </p>
                      <p className="text-lg font-bold text-slate-100">{price}</p>
                    </div>
                  </div>
                )}
                {event.capacity && (
                  <div className="flex items-center gap-3 rounded-lg border border-gold-500/20 bg-[#12141c] p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold-500/40 bg-gold-950/40 text-gold-400">
                      <UsersRoundIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gold-400/80">
                        Capacity
                      </p>
                      <p className="text-lg font-bold text-slate-100">
                        Up to {event.capacity.toLocaleString("en-IN")} guests
                      </p>
                    </div>
                  </div>
                )}
              </Stagger>

              <ul className="mt-6 space-y-2.5">
                {[
                  "Dedicated event manager from start to finish",
                  "Customisable theme, decor and budget",
                  "Vendors, permissions and logistics handled",
                  "Transparent pricing with zero hidden costs",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {point}
                  </li>
                ))}
              </ul>

              <Reveal variant="up" delay={200} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/book?type=${event.slug}`}
                  className="btn btn-primary"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Book this event
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-outline"
                >
                  Ask a question
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Reveal>
            </Reveal>
          </div>
        </Container>
      </section>

      {otherEvents.length > 0 && (
        <section className="bg-[#08090c] py-16">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-gold-300 sm:text-3xl">
              You may also like
            </h2>
            <Stagger
              gap={140}
              itemClassName="h-full"
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {otherEvents.map((other) => (
                <EventCard key={other.id} event={other} />
              ))}
            </Stagger>
          </Container>
        </section>
      )}
    </SiteShell>
  );
}
