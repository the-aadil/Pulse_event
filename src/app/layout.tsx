import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE_CONFIG.name} | Event Management Company in Pune`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Pulse Event plans and executes unforgettable events — birthday parties, weddings, corporate events, casino nights, carnival themes and more. Based in Pune, serving celebrations of every size.",
  keywords: [
    "event management",
    "event planner",
    "wedding planner Pune",
    "birthday party planning",
    "corporate events Pune",
    "carnival theme",
    "casino night",
    "Pulse Event",
  ],
  openGraph: {
    title: `${SITE_CONFIG.name} | Event Management Company in Pune`,
    description:
      "Memories that make hearts skip a beat. Plan birthdays, weddings, corporate events and more with Pulse Event, Pune.",
    url: "/",
    siteName: SITE_CONFIG.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Event Management Company in Pune`,
    description:
      "Memories that make hearts skip a beat. Plan birthdays, weddings, corporate events and more with Pulse Event, Pune.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_CONFIG.name,
    description:
      "Pulse Event plans and executes unforgettable events — birthday parties, weddings, corporate events, casino nights, carnival themes and more in Pune.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    telephone: `+91${SITE_CONFIG.phone1}`,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address,
      addressLocality: "Pune",
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 09:00-21:00",
    sameAs: [SITE_CONFIG.socials.instagram, SITE_CONFIG.socials.facebook],
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
