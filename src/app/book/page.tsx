import type { Metadata } from "next";
import { SiteShell, Container, PageHeader } from "@/components/site/shell";
import { BookingForm } from "@/components/forms/booking-form";
import { Reveal } from "@/components/motion/reveal";
import { getActiveEvents } from "@/lib/data";
import {
  ShieldCheckIcon,
  ClockIcon,
  PhoneIcon,
} from "@/components/icons";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Book an Event",
  description:
    "Tell us about your event and our team will reach out within a few hours with ideas, packages and a custom quote. Pulse Event, Pune.",
};

const trustPoints = [
  {
    icon: ClockIcon,
    label: "Fast Response",
    desc: "We reply within a few hours",
  },
  {
    icon: ShieldCheckIcon,
    label: "No Commitment",
    desc: "Free consultation, zero pressure",
  },
  {
    icon: PhoneIcon,
    label: "Personal Touch",
    desc: "A dedicated planner handles your event",
  },
];

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; style?: string }>;
}) {
  const events = await getActiveEvents();
  const { type, style } = await searchParams;
  const preselected =
    type && events.some((e) => e.slug === type) ? type : undefined;
  const initialStyle = style?.trim() ? style.slice(0, 200) : undefined;

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Let's get started"
        title="Book your event"
        description="Tell us about your event and our team will reach out within a few hours with ideas, packages and a custom quote."
      />

      {/* Trust indicators strip */}
      <section className="border-b border-gold-500/20 bg-[#08090c]">
        <Container>
          <div className="flex flex-col divide-y divide-gold-500/10 sm:flex-row sm:divide-x sm:divide-y-0">
            {trustPoints.map((point) => (
              <div
                key={point.label}
                className="flex flex-1 items-center gap-3 px-4 py-5 sm:justify-center sm:px-6"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold-500/40 bg-gold-950/40">
                  <point.icon className="h-4 w-4 text-gold-600" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {point.label}
                  </p>
                  <p className="text-xs text-slate-400">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Form section */}
      <section className="bg-[#0b0c10] py-14 pb-20 sm:py-20 sm:pb-28">
        <Container maxWidth="max-w-3xl">
          <Reveal
            variant="up"
            className="overflow-hidden rounded-2xl border border-gold-500/20 bg-[#12141c] shadow-xl"
          >
            {/* Card header bar */}
            <div className="border-b border-gold-500/10 bg-gradient-to-r from-gold-950/40 to-[#12141c] px-6 py-5 sm:px-10">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                Booking Request
              </p>
              <h2 className="font-display mt-1 text-xl font-semibold text-slate-100">
                Fill in the details below
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                All fields marked{" "}
                <span className="text-wine-600 font-semibold">*</span> are
                required.
              </p>
            </div>

            {/* The form */}
            <div className="px-6 py-8 sm:px-10">
              <BookingForm
                key={initialStyle ?? "default"}
                events={events}
                preselectedSlug={preselected}
                initialStyle={initialStyle}
              />
            </div>
          </Reveal>

          {/* Privacy note */}
          <Reveal variant="up" delay={150}>
            <p className="mt-5 text-center text-xs text-slate-500 leading-relaxed">
              🔒 Your information is private and never shared with third
              parties. By submitting you agree to be contacted by the Pulse
              Event team.
            </p>
          </Reveal>
        </Container>
      </section>
    </SiteShell>
  );
}
