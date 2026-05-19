Task 28 — CDN + image optimization (actions & findings)

What I changed
- Added preconnect and dns-prefetch hints to src/app/layout.tsx for fonts.googleapis.com, fonts.gstatic.com, accounts.spotify.com and vercel.com. This helps browser establish connections early for critical origins.
- Added conservative Next Image config to next.config.ts: remotePatterns for *.vercel.app and i.scdn.co and allowed domains for images.unsplash.com and cdn.sanity.io. Device sizes and imageSizes tuned to typical breakpoints.

Why minimal edits
- The codebase does not use next/image components (no <Image /> usage found). The landing/dashboard primarily uses CSS/UI placeholders and dynamic WebGL canvas. Therefore lazy-loading per-img attributes were not added because there are no <img> tags to update in critical components.

Verification
- lsp_diagnostics ran on modified files — no diagnostics.
- pnpm build completed successfully (Next.js build succeeded). Build warned about images.domains deprecation (kept for backward compatibility).

Risks & notes
- Kept domains array for backward compatibility; Next warns to prefer remotePatterns. This is intentional to remain conservative.
- If external image origins are added later, update next.config.ts remotePatterns accordingly.

Next steps (optional)
- If you want aggressive image optimization, convert existing <img> usages to next/image with explicit width/height and priority flags for critical images, and add loading="lazy" where appropriate.
