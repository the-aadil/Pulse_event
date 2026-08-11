import { SiteShell } from "@/components/site/shell";
import { Hero } from "@/components/home/hero";
import { StatsBar } from "@/components/home/stats-bar";
import { FeaturedEvents } from "@/components/home/featured-events";
import { Services } from "@/components/home/services";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Testimonials } from "@/components/home/testimonials";
import { CTA } from "@/components/home/cta";
import { getFeaturedEvents } from "@/lib/data";

export const revalidate = 300;

export default async function Home() {
  const events = await getFeaturedEvents();

  return (
    <SiteShell>
      <Hero />
      <StatsBar />
      <FeaturedEvents events={events} />
      <Services />
      <GalleryPreview />
      <Testimonials />
      <CTA />
    </SiteShell>
  );
}
