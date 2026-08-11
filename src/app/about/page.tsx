import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell, Container, SectionHeading, PageHeader } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { CTA } from "@/components/home/cta";
import { CheckIcon, ArrowRightIcon, SparklesIcon, UsersRoundIcon, ShieldCheckIcon } from "@/components/icons";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Us | Pulse Event",
  description:
    "Pulse Event is a Pune-based event management company crafting birthdays, weddings, corporate events and themed celebrations for over 9 years.",
};

const values = [
  {
    icon: SparklesIcon,
    title: "Heart in every detail",
    description:
      "We obsess over the small things — the lighting, the seating, the first song — because that's what guests remember.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Reliability you can bank on",
    description:
      "Deadlines are sacred. If we say it will be ready by 6 pm, it will be ready by 6 pm. Your celebration depends on it.",
  },
  {
    icon: UsersRoundIcon,
    title: "Transparent always",
    description:
      "Clear quotes, honest advice and no surprise charges. We'd rather win your next event than profit from your last one.",
  },
];

const owner = {
  name: "Your Name",
  role: "Founder & Creative Director",
  bio: "With over a decade of experience in event management, I started Pulse Event to bring world-class celebrations to Pune. My philosophy is simple: treat every event as if it were my own family's celebration. I personally oversee our major projects to ensure that every detail, from floral arrangements to lighting, is absolutely perfect.",
  image: "/images/founder_enhanced.jpg",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Our story"
        title="About Pulse Event"
        description="We turn ordinary occasions into unforgettable celebrations — with passion, precision and a love for great parties."
      />

      {/* Founder Section */}
      <section className="bg-white py-16 sm:py-24">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* Text Side (Left) */}
          <Reveal variant="fade" className="order-2 lg:order-1">
            <SectionHeading
              align="left"
              eyebrow="Meet the Founder"
              title="The vision behind Pulse Event"
            />
            <h3 className="font-display mt-8 text-2xl font-bold text-ink">{owner.name}</h3>
            <p className="mt-1 text-gold-600 font-medium tracking-wide uppercase text-sm">{owner.role}</p>
            <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
              "{owner.bio}"
            </p>
            <div className="mt-8">
              <Link href="/contact" className="btn btn-outline border-gold-300 text-gold-700 hover:bg-gold-50">
                Speak directly with me
              </Link>
            </div>
          </Reveal>

          {/* Image Side (Right) */}
          <Reveal variant="fade" delay={100} className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-gold-200/70 shadow-xl sm:h-96 sm:w-96">
              <Image
                src={owner.image}
                alt={owner.name}
                fill
                className="object-cover object-top"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Story Section */}
      <section className="bg-cream py-16 sm:py-24">
        <Container className="mx-auto max-w-4xl text-center">
          <Reveal variant="fade">
            <SectionHeading
              align="center"
              eyebrow="Our story"
              title="Born from a love of great parties"
              description={`What started in Pune as a small team planning friends' birthdays has grown into one of Pune's most loved event companies. We've delivered countless events — from intimate baby showers to 2,000-guest weddings — and every single one gets the same energy, care and precision.`}
            />
          </Reveal>

          <Reveal variant="fade" delay={100}>
            <Stagger gap={120} className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="card-lift flex flex-col items-center text-center gap-4 rounded-xl border border-gold-200/70 bg-white p-6 hover:border-gold-300"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold-300/60 bg-gold-50 text-gold-700">
                    <value.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{value.description}</p>
                  </div>
                </div>
              ))}
            </Stagger>
          </Reveal>

          <Reveal variant="fade" delay={200} className="mt-12 flex justify-center">
            <Link href="/contact" className="btn btn-primary btn-shine">
              Get in touch
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </Container>
      </section>


      <CTA />
    </SiteShell>
  );
}
