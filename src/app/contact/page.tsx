import type { Metadata } from "next";
import { SiteShell, Container, PageHeader } from "@/components/site/shell";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Pulse Event, Pune. Call, WhatsApp, email or drop by — we're here to plan your next celebration.",
};

const contactCards = [
  {
    icon: PhoneIcon,
    label: "Call us",
    value: `${SITE_CONFIG.phone1}`,
    href: `tel:${SITE_CONFIG.phone1}`,
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "Chat instantly",
    href: SITE_CONFIG.socials.whatsapp,
  },
  {
    icon: MailIcon,
    label: "Email",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: MapPinIcon,
    label: "Visit us",
    value: SITE_CONFIG.address,
    href: "https://maps.google.com/?q=" + encodeURIComponent(SITE_CONFIG.address),
  },
  {
    icon: ClockIcon,
    label: "Hours",
    value: SITE_CONFIG.hours,
  },
];

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Say hello"
        title="Get in touch"
        description="Questions, ideas or a date to save? We'd love to hear from you."
      />

      <section className="bg-cream py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <Stagger
            as="div"
            gap={140}
            className="space-y-4 lg:col-span-2"
          >
            {contactCards.map((card) => {
              const content = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gold-300/60 bg-gold-50 text-gold-700">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      {card.label}
                    </p>
                    <p className="mt-0.5 break-words text-sm font-semibold text-ink">
                      {card.value}
                    </p>
                  </div>
                </>
              );
              const classes =
                "card-lift flex items-center gap-4 rounded-lg border border-gold-200/70 bg-white p-4 hover:border-gold-300";
              return card.href ? (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={classes}
                >
                  {content}
                </a>
              ) : (
                <div key={card.label} className={classes}>
                  {content}
                </div>
              );
            })}
          </Stagger>

          <Reveal variant="up" delay={150} className="rounded-lg border border-gold-200/70 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h2 className="font-display text-2xl font-semibold text-ink">Send us a message</h2>
            <p className="mt-1 text-sm text-ink/60">
              We reply to every message within 24 hours on working days.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Reveal>
        </Container>
      </section>
    </SiteShell>
  );
}
