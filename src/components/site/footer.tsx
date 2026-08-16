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

export function Footer() {
  return (
    <footer className="relative bg-[#0b0c10] text-slate-100 overflow-hidden border-t border-gold-500/20">
      {/* Delicate Gold Top Border */}
      <div className="gold-rule" aria-hidden />

      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gold-500/20 bg-[#12141c]/50 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-12 sm:items-center">
            
            {/* BRAND COLUMN — Left side */}
            <div className="sm:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
              <Logo dark />
              <p className="text-xs leading-relaxed text-cream/60 max-w-xs font-sans">
                Premium event planning &amp; decoration in Pune. Turning your vision into timeless celebrations.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={SITE_CONFIG.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold-500/20 bg-cream/5 text-cream/70 transition-all duration-300 hover:scale-110 hover:border-gold-400 hover:bg-gold-500/20 hover:text-gold-300 hover:shadow-lg hover:shadow-gold-500/10"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                </a>
                <a
                  href={SITE_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold-500/20 bg-cream/5 text-cream/70 transition-all duration-300 hover:scale-110 hover:border-gold-400 hover:bg-gold-500/20 hover:text-gold-300 hover:shadow-lg hover:shadow-gold-500/10"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href={SITE_CONFIG.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold-500/20 bg-cream/5 text-cream/70 transition-all duration-300 hover:scale-110 hover:border-gold-400 hover:bg-gold-500/20 hover:text-gold-300 hover:shadow-lg hover:shadow-gold-500/10"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="hidden sm:block sm:col-span-1 flex justify-center">
              <div className="h-28 w-px bg-gradient-to-b from-transparent via-gold-500/30 to-transparent" />
            </div>

            {/* CONTACT DETAILS COLUMN — Right side */}
            <div className="sm:col-span-6 flex flex-col items-center sm:items-start text-center sm:text-left">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-gold-400">
                Get in Touch
              </p>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`tel:${SITE_CONFIG.phone1}`}
                    className="group inline-flex items-center gap-3 text-xs sm:text-sm text-cream/75 transition-colors hover:text-gold-300"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold-500/20 bg-cream/5 text-gold-400 transition-colors group-hover:border-gold-400/40 group-hover:bg-gold-500/10">
                      <PhoneIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium tracking-wide">{SITE_CONFIG.phone1}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="group inline-flex items-center gap-3 text-xs sm:text-sm text-cream/75 transition-colors hover:text-gold-300"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gold-500/20 bg-cream/5 text-gold-400 transition-colors group-hover:border-gold-400/40 group-hover:bg-gold-500/10">
                      <MailIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium">{SITE_CONFIG.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.google.com/?q=NIBM+Road+Pune"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-xs sm:text-sm text-cream/75 transition-colors hover:text-gold-300"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gold-500/20 bg-cream/5 text-gold-400 transition-colors group-hover:border-gold-400/40 group-hover:bg-gold-500/10">
                      <MapPinIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium">{SITE_CONFIG.address}</span>
                  </a>
                </li>
                <li className="inline-flex items-center gap-3 text-xs sm:text-sm text-cream/75">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gold-500/20 bg-cream/5 text-gold-400">
                    <ClockIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium">{SITE_CONFIG.hours}</span>
                </li>
              </ul>
            </div>

          </div>

          {/* SUB-FOOTER BOTTOM BAR */}
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-cream/10 pt-5 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-cream/40">
              © {new Date().getFullYear()}{" "}
              <span className="font-medium text-cream/70">{SITE_CONFIG.name}</span>. All rights reserved.
            </p>
            <p className="text-xs text-cream/40 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-400" />
              Crafted with care in Pune
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
