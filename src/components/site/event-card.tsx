import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, UsersRoundIcon } from "@/components/icons";
import { formatINR } from "@/lib/utils";
import type { EventType } from "@/generated/prisma/client";

export function EventCard({ event }: { event: EventType }) {
  const price = formatINR(event.priceFrom);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-gold-200/50 bg-white shadow-sm hover:border-gold-400"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-sand">
            <span className="font-display text-5xl font-bold text-gold-600">
              {event.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        {event.capacity && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-cream backdrop-blur-md shadow-lg border border-white/10">
            <UsersRoundIcon className="h-3.5 w-3.5 text-gold-400" />
            Up to {event.capacity.toLocaleString("en-IN")} guests
          </span>
        )}
        {price && (
          <span className="absolute bottom-4 left-4 rounded-full bg-gold-500/90 backdrop-blur-md border border-gold-400/50 px-3 py-1.5 text-xs font-bold tracking-wide text-ink shadow-xl">
            From {price}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-gold-700">
          {event.name}
        </h3>
        {event.tagline && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">
            {event.tagline}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 border-t border-gold-200/70 pt-4 text-sm font-semibold text-gold-700 transition-colors group-hover:text-gold-600">
          Explore
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
