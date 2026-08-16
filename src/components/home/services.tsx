import {
  PartyPopperIcon,
  WalletIcon,
  ShieldCheckIcon,
  UsersRoundIcon,
  SparklesIcon,
  TicketIcon,
} from "@/components/icons";
import { SectionHeading } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";

const services = [
  {
    icon: SparklesIcon,
    title: "Complete Event Design & Planning",
    description:
      "From the initial spark of an idea to the final farewell, you get one dedicated manager to ensure your vision comes to life flawlessly.",
  },
  {
    icon: UsersRoundIcon,
    title: "Memorable Entertainment",
    description:
      "Live bands, talented DJs, dancers, and engaging emcees handpicked to keep the energy high and every guest smiling.",
  },
  {
    icon: WalletIcon,
    title: "Exquisite Decor & Dining",
    description:
      "Beautiful floral arrangements, bespoke aesthetics, and multi-cuisine menus curated to match your taste and style.",
  },
  {
    icon: TicketIcon,
    title: "Flawless Execution",
    description:
      "We handle the heavy lifting—vendor coordination, permits, transport, and guest management—so you don't have to worry about a thing.",
  },
  {
    icon: PartyPopperIcon,
    title: "Immersive Themed Events",
    description:
      "Whether it's a magical winter wonderland or a vibrant Bollywood night, we design breathtaking experiences built around your unique story.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Honest, Transparent Pricing",
    description:
      "No surprises, no hidden fees. We provide clear, straightforward quotes and flexible packages that respect your investment.",
  },
];

export function Services() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="up">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="A seamless experience, tailored just for you"
            description="Planning an event shouldn't be stressful. We bring together everything you need, thoughtfully curating each detail so you can simply enjoy the moment."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} variant="up" delay={(i % 3) * 100} className="h-full">
              <div className="card-lift group relative h-full overflow-hidden rounded-2xl border border-gold-200/50 bg-white p-8 hover:border-gold-400">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl border border-gold-300/60 bg-gold-50 text-gold-700 transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-ink group-hover:shadow-lg">
                  <service.icon className="h-7 w-7" />
                </span>
                <h3 className="font-display relative mt-6 text-2xl font-semibold text-ink transition-colors group-hover:text-gold-700">
                  {service.title}
                </h3>
                <p className="relative mt-3 text-base leading-relaxed text-ink-soft">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
