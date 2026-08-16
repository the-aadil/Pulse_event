import type { Metadata } from "next";
import { SiteShell, Container, PageHeader } from "@/components/site/shell";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { CTA } from "@/components/home/cta";
import { galleryItems, galleryCategories, PAGE_SIZE } from "@/lib/gallery";

const baseDescription =
  "A look back at some of the celebrations we've had the pleasure of bringing to life — birthdays, weddings, baby showers and game days across Pune. Tap any photo to view it full size.";

type GallerySearchParams = { category?: string; page?: string };

function parseGalleryParams(sp: GallerySearchParams | undefined) {
  const category =
    sp?.category && galleryCategories.includes(sp.category)
      ? sp.category
      : null;
  const filtered = category
    ? galleryItems.filter((item) => item.category === category)
    : galleryItems;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.max(1, Math.min(totalPages, Number(sp?.page) || 1));
  return { category, page, totalPages };
}

function galleryUrl(category: string | null, page: number) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/gallery?${qs}` : "/gallery";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<GallerySearchParams>;
}): Promise<Metadata> {
  const { category, page } = parseGalleryParams(await searchParams);
  return {
    title: "Gallery",
    description: baseDescription,
    openGraph: {
      title: "Gallery | Pulse Event",
      description: baseDescription,
      url: galleryUrl(category, page),
    },
    alternates: {
      canonical: galleryUrl(category, page),
    },
  };
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams?: Promise<GallerySearchParams>;
}) {
  const { category, page } = parseGalleryParams(await searchParams);

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Our work"
        title="Our gallery"
        description="A look back at some of the celebrations we've had the pleasure of bringing to life — filter by occasion and tap any photo to view it full size."
      />

      <section className="bg-[#0b0c10] py-16 sm:py-20">
        <Container>
          <GalleryGrid
            key={`${category ?? "all"}-${page}`}
            items={galleryItems}
            initialCategory={category}
            initialPage={page}
          />
        </Container>
      </section>

      <CTA />
    </SiteShell>
  );
}
