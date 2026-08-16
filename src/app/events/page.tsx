import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell, Container, PageHeader } from "@/components/site/shell";
import { EventCard } from "@/components/site/event-card";
import { Stagger } from "@/components/motion/stagger";
import { CTA } from "@/components/home/cta";
import { getActiveEvents } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Events",
  description:
    "Explore our full range of event management services — birthday parties, weddings, corporate events, casino nights, carnival themes, baby showers and more.",
};

export default async function EventsPage() {
  const events = await getActiveEvents();

  return (
    <SiteShell>
      <PageHeader
        eyebrow="What we offer"
        title="Our events & services"
        description="Whatever the occasion, we have a package (or a blank canvas) for it. Explore what we offer and let's make it yours."
      />

      <section className="bg-cream py-16 sm:py-20">
        <Container>
          {events.length > 0 ? (
            <Stagger
              gap={130}
              itemClassName="h-full"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </Stagger>
          ) : (
            <div className="py-20 text-center">
              <p className="text-5xl" aria-hidden>
                🎪
              </p>
              <h2 className="mt-4 text-2xl font-bold text-ink">
                New events are coming soon
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
                We&apos;re curating our next set of themes. Meanwhile, tell us what
                you have in mind and we&apos;ll make it happen.
              </p>
              <Link href="/book" className="btn btn-primary mt-6">
                Book a custom event
              </Link>
            </div>
          )}
        </Container>
      </section>

      <CTA />
    </SiteShell>
  );
}
