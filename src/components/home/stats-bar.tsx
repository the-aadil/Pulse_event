import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";

const stats = [
  { value: "500+", label: "Events Delivered" },
  { value: "9+", label: "Years of Experience" },
  { value: "50k+", label: "Happy Guests" },
  { value: "4.9★", label: "Average Rating" },
];

export function StatsBar() {
  return (
    <section className="relative border-t border-b border-gold-500/30 bg-[#0b0c10] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)] animate-pulse" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            variant="up"
            delay={i * 100}
            className="text-center"
          >
            <p className="font-display text-3xl font-semibold text-slate-100 sm:text-4xl">
              <CountUp value={stat.value} delay={i * 180} />
            </p>
            <p className="mt-1.5 text-sm font-medium text-gold-400/70">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
