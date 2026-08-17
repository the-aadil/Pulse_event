import { Container } from "@/components/site/shell";

export default function BookLoading() {
  return (
    <section className="bg-[#0b0c10] py-14 sm:py-18">
      <Container maxWidth="max-w-3xl">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gold-500/10" />
          <div className="mx-auto mt-4 h-10 w-56 animate-pulse rounded bg-white/5" />
        </div>
        <div className="mx-auto mt-10 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg border border-white/5 bg-white/[0.02]"
            />
          ))}
          <div className="h-28 animate-pulse rounded-lg border border-white/5 bg-white/[0.02]" />
          <div className="h-12 w-40 animate-pulse rounded-lg bg-gold-500/10" />
        </div>
      </Container>
    </section>
  );
}
