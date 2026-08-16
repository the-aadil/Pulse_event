import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell, Container, SectionHeading, PageHeader } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { CTA } from "@/components/home/cta";
import { ArrowRightIcon, SparklesIcon, UsersRoundIcon, ShieldCheckIcon } from "@/components/icons";

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
      <section className="bg-[#0b0c10] py-16 sm:py-24 text-slate-100">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* Text Side (Left) */}
          <Reveal variant="fade" className="order-2 lg:order-1">
            <SectionHeading
              dark
              align="left"
              eyebrow="Meet the Founder"
              title="The vision behind Pulse Event"
            />
            <h3 className="font-display mt-8 text-2xl font-bold text-gold-300">{owner.name}</h3>
            <p className="mt-1 text-gold-400 font-medium tracking-wide uppercase text-sm">{owner.role}</p>
            <p className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg">
              &ldquo;{owner.bio}&rdquo;
            </p>
            <div className="mt-8">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-gold-400/50 bg-gold-950/30 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-300 transition-all hover:bg-gold-500 hover:text-slate-950">
                Speak directly with me
              </Link>
            </div>
          </Reveal>

          {/* Image Side (Right) */}
          <Reveal variant="fade" delay={100} className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-gold-500/40 shadow-[0_0_30px_rgba(212,175,55,0.25)] sm:h-96 sm:w-96">
              <Image
                src={owner.image}
                alt={owner.name}
                fill
                sizes="(min-width: 640px) 384px, 288px"
                className="object-cover object-top"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Story Section */}
      <section className="bg-[#08090c] py-16 sm:py-24 text-slate-100">
        <Container maxWidth="max-w-4xl" className="text-center">
          <Reveal variant="fade">
            <SectionHeading
              dark
              align="center"
              eyebrow="Our story"
              title="Born from a love of great parties"
              description={`What started in Pune as a small team planning friends' birthdays has grown into one of Pune's most loved event companies. We've delivered countless events — from intimate baby showers to 2,000-guest weddings — and every single one gets the same energy, care and precision.`}
            />
          </Reveal>
        </Container>
      </section>

      {/* Values Section */}
      <section className="bg-[#0b0c10] py-16 sm:py-24 text-slate-100">
        <Container>
          <Reveal variant="up">
            <SectionHeading
              dark
              eyebrow="What we stand for"
              title="Principles that guide every celebration"
            />
          </Reveal>
          <Stagger
            gap={120}
            className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gold-500/20 bg-[#12141c] p-8 shadow-xl hover:border-gold-400 hover:bg-[#181a24] transition-all duration-300"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/40 bg-gold-950/40 text-gold-400">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display mt-6 text-xl font-semibold text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </Stagger>
        </Container>
      </section>

      <CTA />
    </SiteShell>
  );
}
