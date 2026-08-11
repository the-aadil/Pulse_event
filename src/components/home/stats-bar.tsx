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
    <section className="border-y border-gold-500/20 bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            variant="up"
            delay={i * 100}
            className="text-center"
          >
            <p className="font-display text-3xl font-semibold text-white sm:text-4xl">
              <CountUp value={stat.value} delay={i * 180} />
            </p>
            <p className="mt-1.5 text-sm font-medium text-white/60">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
