import { Container } from "@/components/site/shell";

export default function GalleryLoading() {
  return (
    <section className="bg-[#0b0c10] py-14 sm:py-18">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gold-500/10" />
          <div className="mx-auto mt-4 h-10 w-48 animate-pulse rounded bg-white/5" />
        </div>
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
