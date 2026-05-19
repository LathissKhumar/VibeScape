import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://accounts.spotify.com https://api.spotify.com https://generativelanguage.googleapis.com; font-src 'self' data:;" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
        ],
      },
    ];
  },
};

// Image optimization / remote patterns for CDN usage
// Keep conservative allowlist to avoid unsafe remote fetching.
const imageConfig = {
  images: {
    // allow Vercel's domains and common external providers we use
    // prefer remotePatterns over domains (domains kept for backward-compatibility)
    domains: ["images.unsplash.com", "cdn.sanity.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co", // spotify content images
      },
    ],
    // optional: device sizes used by the app
    deviceSizes: [320, 420, 768, 1024, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

const merged = Object.assign({}, nextConfig, imageConfig);

export default merged;
