import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "framer-motion",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "three-stdlib",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https://accounts.spotify.com https://api.spotify.com https://generativelanguage.googleapis.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://cdn.jsdelivr.net https://fonts.gstatic.com https://ws.audioscrobbler.com; font-src 'self' data: https://cdn.jsdelivr.net https://fonts.gstatic.com; worker-src 'self' blob:;" },
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
    remotePatterns: [
      { protocol: "https", hostname: "*.vercel.app" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "yt3.googleusercontent.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
    ],
    deviceSizes: [320, 420, 768, 1024, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

const merged = Object.assign({}, nextConfig, imageConfig);

export default withSentryConfig(merged, {
  org: "resona",
  project: "resona",
  silent: !process.env.CI,
  sourcemaps: { disable: false },
});
