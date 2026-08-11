import type { Metadata } from "next";
import { SiteShell, Container, PageHeader } from "@/components/site/shell";
import { BookingForm } from "@/components/forms/booking-form";
import { Reveal } from "@/components/motion/reveal";
import { getActiveEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book an Event",
  description:
    "Tell us about your event and our team will reach out within a few hours with ideas, packages and a custom quote. Pulse Event, Pune.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; style?: string }>;
}) {
  const events = await getActiveEvents();
  const { type, style } = await searchParams;
  const preselected = type && events.some((e) => e.slug === type) ? type : undefined;
  const initialStyle = style?.trim() ? style.slice(0, 200) : undefined;

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Let's get started"
        title="Book your event"
        description="Tell us about your event and our team will reach out within a few hours with ideas, packages and a custom quote."
      />

      <section className="bg-cream py-16">
        <Container className="max-w-3xl">
          <Reveal variant="up" className="rounded-lg border border-gold-200/70 bg-white p-6 shadow-sm sm:p-10">
            <BookingForm
              key={initialStyle ?? "default"}
              events={events}
              preselectedSlug={preselected}
              initialStyle={initialStyle}
            />
          </Reveal>
        </Container>
      </section>
    </SiteShell>
  );
}
