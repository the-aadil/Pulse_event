import { StarIcon } from "@/components/icons";
import { SectionHeading } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";

const testimonials = [
  {
    name: "Rohan & Priya",
    event: "Wedding · Pune",
    quote:
      "Pulse Event turned our wedding into a fairytale. Every guest kept saying it was the best wedding they'd ever been to. The team managed 800 guests flawlessly.",
  },
  {
    name: "Meera Shah",
    event: "Birthday Party · NIBM Road",
    quote:
      "They built a carnival theme for my daughter's 7th birthday that blew everyone's mind. Kids didn't want to leave! Super organised and so thoughtful with details.",
  },
  {
    name: "Ankit Desai",
    event: "Corporate Gala · Pune",
    quote:
      "Our annual gala with a casino night theme was a massive hit. Professional, punctual and creative. Our leadership has already booked them for next year.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="up">
          <SectionHeading
            eyebrow="Client Stories"
            title="Love notes from our clients"
            description="The most beautiful part of our work is the joy we leave behind. Here's what our clients have to say."
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              as="figure"
              variant="up"
              delay={i * 100}
              className="card-lift relative flex flex-col overflow-hidden rounded-lg border border-gold-200/70 bg-cream p-7 hover:border-gold-300"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-4 right-3 font-display text-8xl font-bold text-gold-200/60"
              >
                &ldquo;
              </span>
              <div className="flex gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <StarIcon
                    key={j}
                    className="h-4 w-4 text-gold-500 transition-transform duration-300 hover:scale-125"
                  />
                ))}
              </div>
              <blockquote className="relative mt-5 flex-1 text-sm leading-relaxed text-ink/75">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-300/70 bg-gold-50 font-display text-base font-semibold text-gold-700">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-soft">{t.event}</p>
                </div>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
