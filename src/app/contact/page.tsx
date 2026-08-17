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

      <section className="bg-[#0b0c10] py-16 sm:py-20 text-slate-100">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
          <Stagger
            as="div"
            gap={140}
            className="space-y-4"
          >
            {contactCards.map((card) => {
              const content = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gold-500/40 bg-gold-950/40 text-gold-400">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-400/80">
                      {card.label}
                    </p>
                    <p className="mt-0.5 break-words text-sm font-semibold text-slate-100">
                      {card.value}
                    </p>
                  </div>
                </>
              );
              const classes =
                "card-lift flex items-center gap-4 rounded-xl border border-gold-500/20 bg-[#12141c] p-4 hover:border-gold-400 hover:bg-[#181a24] transition-all";
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

        </div>

          <Reveal variant="up" delay={150} className="rounded-2xl border border-gold-500/20 bg-[#12141c] p-6 shadow-xl sm:p-8 lg:col-span-3">
            <h2 className="font-display text-2xl font-semibold text-gold-300">Send us a message</h2>
            <p className="mt-1 text-sm text-slate-400">
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
