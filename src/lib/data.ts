import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { BookingStatus, EnquiryStatus } from "@/generated/prisma/enums";

const FALLBACK_EVENTS = [
  {
    id: "evt-birthday-party",
    slug: "birthday-party",
    name: "Birthday Party",
    tagline: "Theme parties that make you feel like a kid again",
    description:
      "From intimate cake-cuttings to grand milestone bashes, we design every birthday celebration around the birthday star. Our team handles decor, entertainment, games, catering and photography so you only have to enjoy the moment.",
    priceFrom: 15000,
    capacity: 500,
    image: "/images/birthday-party.svg",
    featured: true,
    active: true,
    sortOrder: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "evt-wedding-ceremony",
    slug: "wedding-ceremony",
    name: "Wedding Ceremony",
    tagline: "Grand celebrations for your once-in-a-lifetime day",
    description:
      "Weddings are a family affair and we treat them that way. Mandap decor, bridal stage, lighting, live music, choreography, catering and guest management — a single team that turns your dream wedding into reality, from mehendi to vidai.",
    priceFrom: 100000,
    capacity: 2000,
    image: "/images/wedding-ceremony.svg",
    featured: true,
    active: true,
    sortOrder: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "evt-casino-nights-theme",
    slug: "casino-nights-theme",
    name: "Casino Nights Theme",
    tagline: "Bring Las Vegas glamour to your party",
    description:
      "Roulette, blackjack, poker and more, complete with professional croupiers, vintage decor and dramatic lighting. Perfect for corporate galas, bachelorette nights and high-energy private parties.",
    priceFrom: 25000,
    capacity: 600,
    image: "/images/casino-nights-theme.svg",
    featured: true,
    active: true,
    sortOrder: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "evt-carnival-theme",
    slug: "carnival-theme",
    name: "Carnival Theme",
    tagline: "Vibrant stalls, games, pop treats and non-stop energy",
    description:
      "Game booths, popcorn & cotton candy machines, mascot artists, photo booths and festive tents that turn any venue into an amusement park.",
    priceFrom: 20000,
    capacity: 800,
    image: "/images/carnival-theme.svg",
    featured: true,
    active: true,
    sortOrder: 40,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "evt-corporate-events",
    slug: "corporate-events",
    name: "Corporate Events",
    tagline: "Conferences, launches and team celebrations done right",
    description:
      "Annual days, product launches, team offsites and town halls — we bring the polish and planning corporate events demand, with stage production, branding, hospitality and seamless coordination.",
    priceFrom: 30000,
    capacity: 1500,
    image: "/images/corporate-events.svg",
    featured: false,
    active: true,
    sortOrder: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** Database query timeout wrapper for resilient error boundaries */
async function withDbTimeout<T>(promise: Promise<T>, timeoutMs = 4000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Database query timed out")), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

// ── Cached public data accessors with tag-based invalidation ───────

export const getActiveEvents = unstable_cache(
  async () => {
    try {
      return await withDbTimeout(
        db.eventType.findMany({
          where: { active: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        })
      );
    } catch (error) {
      console.warn("[Data] Failed to fetch active events from database, using fallback data:", error);
      return FALLBACK_EVENTS.filter((e) => e.active);
    }
  },
  ["active-events-cache"],
  { revalidate: 300, tags: ["events"] }
);

export const getFeaturedEvents = unstable_cache(
  async () => {
    try {
      return await withDbTimeout(
        db.eventType.findMany({
          where: { active: true, featured: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        })
      );
    } catch (error) {
      console.warn("[Data] Failed to fetch featured events from database, using fallback data:", error);
      return FALLBACK_EVENTS.filter((e) => e.active && e.featured);
    }
  },
  ["featured-events-cache"],
  { revalidate: 300, tags: ["events", "featured-events"] }
);

export async function getEventBySlug(slug: string) {
  const cachedFn = unstable_cache(
    async (s: string) => {
      try {
        const event = await withDbTimeout(
          db.eventType.findFirst({
            where: { slug: s, active: true },
          })
        );
        if (event) return event;
      } catch (error) {
        console.warn(`[Data] Failed to fetch event by slug "${s}", using fallback:`, error);
      }
      return FALLBACK_EVENTS.find((e) => e.slug === s && e.active) ?? null;
    },
    [`event-slug-${slug}`],
    { revalidate: 300, tags: ["events", `event-${slug}`] }
  );

  return cachedFn(slug);
}

export async function getAdminEvents() {
  try {
    return await withDbTimeout(
      db.eventType.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      })
    );
  } catch (error) {
    console.warn("[Data] Failed to fetch admin events from database, using fallback:", error);
    return FALLBACK_EVENTS;
  }
}

export async function getEventById(id: string) {
  try {
    const event = await withDbTimeout(
      db.eventType.findUnique({ where: { id } })
    );
    if (event) return event;
  } catch (error) {
    console.warn(`[Data] Failed to fetch event by ID "${id}", using fallback:`, error);
  }
  return FALLBACK_EVENTS.find((e) => e.id === id) ?? null;
}

export async function getRecentBookings(limit = 8) {
  try {
    return await withDbTimeout(
      db.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      })
    );
  } catch (error) {
    console.warn("[Data] Failed to fetch recent bookings:", error);
    return [];
  }
}

export async function getBookingsByStatus(status: BookingStatus | "ALL") {
  try {
    return await withDbTimeout(
      db.booking.findMany({
        where: status === "ALL" ? {} : { status },
        orderBy: { createdAt: "desc" },
      })
    );
  } catch (error) {
    console.warn("[Data] Failed to fetch bookings by status:", error);
    return [];
  }
}

export async function getEnquiries(status: EnquiryStatus | "ALL" = "ALL") {
  try {
    return await withDbTimeout(
      db.enquiry.findMany({
        where: status === "ALL" ? {} : { status },
        orderBy: { createdAt: "desc" },
      })
    );
  } catch (error) {
    console.warn("[Data] Failed to fetch enquiries:", error);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const [totalBookings, pendingBookings, confirmedBookings, totalEnquiries, unreadEnquiries, totalGuests] =
      await withDbTimeout(
        Promise.all([
          db.booking.count(),
          db.booking.count({ where: { status: "PENDING" } }),
          db.booking.count({ where: { status: "CONFIRMED" } }),
          db.enquiry.count(),
          db.enquiry.count({ where: { status: "NEW" } }),
          db.booking.aggregate({ _sum: { guests: true } }),
        ])
      );

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalEnquiries,
      unreadEnquiries,
      totalGuests: totalGuests._sum.guests ?? 0,
    };
  } catch (error) {
    console.warn("[Data] Failed to fetch dashboard stats from database:", error);
    return {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      totalEnquiries: 0,
      unreadEnquiries: 0,
      totalGuests: 0,
    };
  }
}
