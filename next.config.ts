import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["@prisma/adapter-neon", "@neondatabase/serverless"],
  images: {
    // WebP only: AVIF encoding blocks the optimizer for ~0.5-2s per unique
    // image on first request (12 gallery cards = visible queue). WebP
    // delivers several times faster with a modest size penalty.
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
    // Finer steps keep srcset candidates close to actual slot sizes,
    // avoiding oversized downloads between 828 -> 1200.
    deviceSizes: [480, 640, 750, 828, 960, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
    // 60 = lightweight tier for grid thumbnails, 75 = detail views.
    qualities: [60, 75],
    localPatterns: [
      {
        pathname: "/images/gallery/**",
      },
      {
        pathname: "/images/**",
      },
      {
        pathname: "/uploads/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
