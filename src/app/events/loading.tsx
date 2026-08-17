import { Container } from "@/components/site/shell";

export default function EventsLoading() {
  return (
    <section className="bg-[#0b0c10] py-14 sm:py-18">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gold-500/10" />
          <div className="mx-auto mt-4 h-10 w-48 animate-pulse rounded bg-white/5" />
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
