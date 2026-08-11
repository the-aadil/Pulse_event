import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "public", "images");
mkdirSync(outDir, { recursive: true });

const INK_TOP = "#27231D";
const INK_BOTTOM = "#1A1713";
const CREAM = "#F7F1E6";
const GOLD = "#C9A227";

const events = [
  {
    slug: "birthday-party",
    name: "Birthday Party",
    accent: "#C9A227",
    blurb: "Theme parties for every age",
  },
  {
    slug: "wedding-ceremony",
    name: "Wedding Ceremony",
    accent: "#E5CF9F",
    blurb: "Grand celebrations of love",
  },
  {
    slug: "casino-nights-theme",
    name: "Casino Nights Theme",
    accent: "#2E7D6E",
    blurb: "Vegas glamour in the city",
  },
  {
    slug: "carnival-theme",
    name: "Carnival Theme",
    accent: "#C1693C",
    blurb: "Colourful fun-fairs and games",
  },
  {
    slug: "baby-shower",
    name: "Baby Shower",
    accent: "#C98BA0",
    blurb: "Soft, adorable little moments",
  },
  {
    slug: "bollywood-theme",
    name: "Bollywood Theme",
    accent: "#8E3B46",
    blurb: "Dance, drama and glamour",
  },
  {
    slug: "games-activities",
    name: "Games & Activities",
    accent: "#2E7D6E",
    blurb: "Fun zones for every guest",
  },
  {
    slug: "catering-services",
    name: "Catering Services",
    accent: "#B0712E",
    blurb: "Menus that steal the show",
  },
  {
    slug: "corporate-events",
    name: "Corporate Events",
    accent: "#5A6068",
    blurb: "Business, done beautifully",
  },
];

function monogram(name) {
  const letters = name.replace(/[^A-Za-z]/g, "");
  return (letters.charAt(0) || "P").toUpperCase();
}

function svg(e) {
  const glowX = e.accent.toLowerCase() === "#8e3b46" ? "78%" : "22%";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${INK_TOP}"/>
      <stop offset="100%" stop-color="${INK_BOTTOM}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${glowX}" cy="28%" r="62%">
      <stop offset="0%" stop-color="${e.accent}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${e.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="goldGlow" cx="80%" cy="85%" r="45%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect width="800" height="600" fill="url(#glow)"/>
  <rect width="800" height="600" fill="url(#goldGlow)"/>
  <g fill="none" stroke="${GOLD}" stroke-opacity="0.25" stroke-width="1.5">
    <circle cx="400" cy="300" r="150"/>
    <circle cx="400" cy="300" r="210"/>
  </g>
  <g fill="${GOLD}" fill-opacity="0.5">
    <circle cx="400" cy="90" r="3"/>
    <circle cx="140" cy="240" r="2.5"/>
    <circle cx="680" cy="200" r="3"/>
    <circle cx="610" cy="440" r="2.5"/>
    <circle cx="200" cy="470" r="3"/>
  </g>
  <text x="400" y="315" font-family="Georgia, 'Times New Roman', serif" font-size="150" font-weight="700" fill="${GOLD}" text-anchor="middle">${monogram(e.name)}</text>
  <line x1="300" y1="360" x2="500" y2="360" stroke="${GOLD}" stroke-opacity="0.7" stroke-width="1"/>
  <text x="400" y="415" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="600" fill="${CREAM}" text-anchor="middle" letter-spacing="1">${e.name}</text>
  <text x="400" y="455" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="400" fill="${CREAM}" fill-opacity="0.65" text-anchor="middle">${e.blurb}</text>
</svg>`;
}

for (const e of events) {
  const file = join(outDir, `${e.slug}.svg`);
  writeFileSync(file, svg(e));
  console.log(`wrote ${file}`);
}

const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#23201A"/>
      <stop offset="55%" stop-color="#1C1915"/>
      <stop offset="100%" stop-color="#15120F"/>
    </linearGradient>
    <radialGradient id="gold" cx="75%" cy="30%" r="55%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="wine" cx="20%" cy="85%" r="50%">
      <stop offset="0%" stop-color="#8E3B46" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#8E3B46" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#gold)"/>
  <rect width="1600" height="900" fill="url(#wine)"/>
  <g fill="none" stroke="${GOLD}" stroke-opacity="0.18" stroke-width="1.5">
    <circle cx="1150" cy="450" r="320"/>
    <circle cx="1150" cy="450" r="430"/>
  </g>
  <g fill="${GOLD}" fill-opacity="0.6">
    <circle cx="1150" cy="160" r="4"/>
    <circle cx="900" cy="240" r="3"/>
    <circle cx="1400" cy="300" r="3.5"/>
    <circle cx="1300" cy="120" r="2.5"/>
    <circle cx="980" cy="150" r="2.5"/>
    <circle cx="1520" cy="520" r="3"/>
    <circle cx="820" cy="620" r="3"/>
  </g>
  <g font-family="Georgia, 'Times New Roman', serif">
    <text x="400" y="430" font-size="150" font-weight="700" fill="${CREAM}" letter-spacing="4">PULSE</text>
    <text x="400" y="520" font-size="72" font-weight="600" fill="${GOLD}" letter-spacing="14">EVENT</text>
  </g>
  <line x1="300" y1="570" x2="500" y2="570" stroke="${GOLD}" stroke-opacity="0.7" stroke-width="1.5"/>
  <text x="400" y="630" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="400" fill="${CREAM}" fill-opacity="0.7" text-anchor="middle" letter-spacing="1">Memories that make hearts skip a beat</text>
</svg>`;

writeFileSync(join(outDir, "hero.svg"), hero);
console.log(`wrote ${join(outDir, "hero.svg")}`);

const pattern = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <g fill="none" stroke="${GOLD}" stroke-width="1" stroke-opacity="0.5">
    <circle cx="400" cy="400" r="180"/>
    <circle cx="400" cy="400" r="320"/>
    <circle cx="400" cy="400" r="460"/>
  </g>
  <g fill="${GOLD}" fill-opacity="0.6">
    <circle cx="400" cy="220" r="3"/>
    <circle cx="220" cy="400" r="3"/>
    <circle cx="580" cy="400" r="3"/>
    <circle cx="400" cy="580" r="3"/>
    <circle cx="273" cy="273" r="2.5"/>
    <circle cx="527" cy="273" r="2.5"/>
    <circle cx="273" cy="527" r="2.5"/>
    <circle cx="527" cy="527" r="2.5"/>
  </g>
</svg>`;

writeFileSync(join(outDir, "pattern.svg"), pattern);
console.log(`wrote ${join(outDir, "pattern.svg")}`);
