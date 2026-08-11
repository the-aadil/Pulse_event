import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";

const eventTypes = [
  {
    slug: "birthday-party",
    name: "Birthday Party",
    tagline: "Theme parties that make you feel like a kid again",
    description:
      "From intimate cake-cuttings to grand milestone bashes, we design every birthday celebration around the birthday star. Our team handles decor, entertainment, games, catering and photography so you only have to enjoy the moment.",
    priceFrom: 15000,
    capacity: 500,
    image: "/images/birthday-party.svg",
    featured: true,
    sortOrder: 10,
  },
  {
    slug: "wedding-ceremony",
    name: "Wedding Ceremony",
    tagline: "Grand celebrations for your once-in-a-lifetime day",
    description:
      "Weddings are a family affair and we treat them that way. Mandap decor, bridal stage, lighting, live music, choreography, catering and guest management — a single team that turns your dream wedding into reality, from mehendi to vidai.",
    priceFrom: 100000,
    capacity: 2000,
    image: "/images/wedding-ceremony.svg",
    featured: true,
    sortOrder: 20,
  },
  {
    slug: "casino-nights-theme",
    name: "Casino Nights Theme",
    tagline: "Bring Las Vegas glamour to your party",
    description:
      "Roulette, blackjack, poker and more, complete with professional croupiers, vintage decor and dramatic lighting. Perfect for corporate galas, bachelorette nights and high-energy private parties.",
    priceFrom: 25000,
    capacity: 600,
    image: "/images/casino-nights-theme.svg",
    featured: true,
    sortOrder: 30,
  },
  {
    slug: "carnival-theme",
    name: "Carnival Theme",
    tagline: "Colourful fun-fair experiences for all ages",
    description:
      "Rides, stalls, games, popcorn machines and a riot of colour. Our carnival setups create a festive street-fair atmosphere that delights children and adults alike at schools, societies and corporate family days.",
    priceFrom: 20000,
    capacity: 1000,
    image: "/images/carnival-theme.svg",
    featured: false,
    sortOrder: 40,
  },
  {
    slug: "baby-shower",
    name: "Baby Shower",
    tagline: "Adorable celebrations for your bundle of joy",
    description:
      "Soft pastels, dreamy themes and heart-warming details. We arrange everything from the cake and games to photo backdrops and return gifts, creating a warm and cosy celebration for the growing family.",
    priceFrom: 12000,
    capacity: 200,
    image: "/images/baby-shower.svg",
    featured: false,
    sortOrder: 50,
  },
  {
    slug: "bollywood-theme",
    name: "Bollywood Theme",
    tagline: "Dance, drama and pure Bollywood glamour",
    description:
      "Bollywood nights bring the glamour of the silver screen to your event. Choreographed performances, DJ nights, flower-garland decor and vibrant lighting that keeps your guests on the dance floor all night.",
    priceFrom: 22000,
    capacity: 800,
    image: "/images/bollywood-theme.svg",
    featured: true,
    sortOrder: 60,
  },
  {
    slug: "games-activities",
    name: "Games & Activities",
    tagline: "Fun and engagement for every kind of crowd",
    description:
      "From laser tag and archery to quiz nights and DIY craft zones, our curated games and activities keep every guest engaged. Ideal add-ons for corporate offsites, school fests and private parties.",
    priceFrom: 10000,
    capacity: 500,
    image: "/images/games-activities.svg",
    featured: false,
    sortOrder: 70,
  },
  {
    slug: "catering-services",
    name: "Catering Services",
    tagline: "Culinary experiences that everyone remembers",
    description:
      "Live counters, multi-cuisine buffets, themed food stalls and dessert bars prepared by trusted chefs. Hygiene, taste and presentation come first, with menus tailored to your event and budget.",
    priceFrom: 350,
    capacity: 5000,
    image: "/images/catering-services.svg",
    featured: false,
    sortOrder: 80,
  },
  {
    slug: "corporate-events",
    name: "Corporate Events",
    tagline: "Conferences, launches and team celebrations done right",
    description:
      "Annual days, product launches, team offsites and town halls — we bring the polish and planning corporate events demand, with stage production, branding, hospitality and seamless coordination.",
    priceFrom: 30000,
    capacity: 1500,
    image: "/images/corporate-events.svg",
    featured: false,
    sortOrder: 90,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@pulseevent.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Pulse@Admin#2026";

  const existingAdmin = await db.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.adminUser.create({
      data: {
        name: "Pulse Admin",
        email: adminEmail,
        passwordHash,
        isSuperAdmin: true,
      },
    });
    console.log(`Created admin user: ${adminEmail}`);
    if (!process.env.ADMIN_PASSWORD) {
      console.warn(
        "Using default admin password. Set ADMIN_PASSWORD env var before deploying to production."
      );
    }
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  let created = 0;
  for (const event of eventTypes) {
    const existing = await db.eventType.findUnique({ where: { slug: event.slug } });
    if (!existing) {
      await db.eventType.create({ data: event });
      created += 1;
    }
  }
  console.log(`Seeded event types. Created: ${created}, already present: ${eventTypes.length - created}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
