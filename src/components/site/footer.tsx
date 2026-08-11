import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { SITE_CONFIG } from "@/lib/config";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/icons";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Our Events" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
  { href: "/book", label: "Book an Event" },
];

const services = [
  "Birthday Parties",
  "Wedding Ceremonies",
  "Corporate Events",
  "Carnival & Casino Themes",
  "Bollywood Nights",
  "Baby Showers",
  "Catering & Activities",
];

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="gold-rule" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo dark />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/60">
              We craft memories that make hearts skip a beat — birthdays, weddings,
              corporate galas and themed celebrations across Pune and beyond.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={SITE_CONFIG.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-cream/15 text-cream/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-400"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-cream/15 text-cream/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-400"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-cream/15 text-cream/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-400"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/70 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              What We Do
            </h3>
            <ul className="mt-3 space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/events"
                    className="text-sm text-cream/70 transition-colors hover:text-gold-400"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              Get in Touch
            </h3>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone1}`}
                  className="flex items-start gap-3 text-sm text-cream/70 transition-colors hover:text-gold-400"
                >
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>
                    {SITE_CONFIG.phone1}
                    <br />
                    {SITE_CONFIG.phone2}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-start gap-3 text-sm text-cream/70 transition-colors hover:text-gold-400"
                >
                  <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span className="break-all">{SITE_CONFIG.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-cream/70">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-cream/70">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{SITE_CONFIG.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-5 sm:flex-row">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-xs text-cream/40">Crafted with care in Pune</p>
        </div>
      </div>
    </footer>
  );
}
