import Image from "next/image";
import Link from "next/link";
import { galleryItems } from "@/lib/gallery";
import { SectionHeading } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRightIcon } from "@/components/icons";

export function GalleryPreview() {
  const preview = [
    ...galleryItems.filter((item) => item.category === "Weddings").slice(0, 2),
    ...galleryItems.filter((item) => item.category === "Birthdays").slice(0, 2),
    ...galleryItems.filter((item) => item.category === "Games").slice(0, 2),
  ];
  return (
    <section className="bg-[#0b0c10] py-16 text-cream sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="up">
          <SectionHeading
            dark
            eyebrow="Our Portfolio"
            title="A glimpse into the magic we create"
            description="Every event is a blank canvas. We take pride in filling it with vibrant colors, joyous music, and memories that last a lifetime."
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-6 px-2 sm:px-0 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((item, i) => (
            <Reveal key={item.src} variant="up" delay={(i % 3) * 100} className="h-full">
              <Link
                href="/gallery"
                className="group relative block aspect-[4/3] overflow-hidden rounded-lg border-[2px] border-[#d4af37]"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10]/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-gold-300">{item.category}</p>
                  <p className="text-xs text-cream/70">{item.alt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal variant="fade" delay={150} className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-md border border-gold-500/30 px-6 py-3 text-base font-medium text-cream/90 transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            See the full gallery
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
