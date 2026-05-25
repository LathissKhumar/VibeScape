Task 21: Landing page section split + redesign

## What was done
- Split monolithic `src/app/page.tsx` into 5 section components under `src/components/landing/`:
  - `HeroSection.tsx` — Hero with CTA buttons, respects reduced motion
  - `ArchetypePreviewSection.tsx` — 3 archetype cards with icon mapping
  - `GalaxyPreviewSection.tsx` — Galaxy preview with feature list and neural mapping badge
  - `LandingNav.tsx` — Desktop nav + mobile Sheet hamburger menu, uses `useMediaQuery`
  - `FooterSection.tsx` — Footer with branding and links
- Refactored `src/app/page.tsx` to import and compose the 5 sections, keeping `Starfield` background
- Added `@/` path alias to `vitest.config.ts` (was missing, causing test resolution failures)
- Added 23 new tests across 5 test files (HeroSection: 5, ArchetypePreviewSection: 5, GalaxyPreviewSection: 6, LandingNav: 4, FooterSection: 3)
- All 64 tests pass, `pnpm build` succeeds

## Decisions
- Used `useMediaQuery` in LandingNav instead of CSS-only `hidden md:flex` for the desktop/mobile split to enable testable behavior
- Created `ArchetypeIcon` helper component to work around lucide-react strict className typing with dynamic Tailwind classes
- Preserved exact visual output — no design changes, only decomposition
- Did not touch dashboard/recommendation code
- No new dependencies added

## Issues encountered
- Vitest lacked `@/` path alias resolution — added `resolve.alias` to vitest.config.ts
- `vi.resetModules()` + `require()` pattern fails in ESM/Vitest for mobile/desktop viewport switching tests — simplified to single-viewport tests
- Lucide-react icons have strict className prop types that reject dynamic template literal strings — extracted to typed `ArchetypeIcon` wrapper with explicit `React.ComponentType<{ className: string }>` cast

## Files changed
- `src/app/page.tsx` — refactored to use section components
- `src/components/landing/HeroSection.tsx` — new
- `src/components/landing/ArchetypePreviewSection.tsx` — new
- `src/components/landing/GalaxyPreviewSection.tsx` — new
- `src/components/landing/LandingNav.tsx` — new
- `src/components/landing/FooterSection.tsx` — new
- `src/components/landing/__tests__/HeroSection.test.tsx` — new
- `src/components/landing/__tests__/ArchetypePreviewSection.test.tsx` — new
- `src/components/landing/__tests__/GalaxyPreviewSection.test.tsx` — new
- `src/components/landing/__tests__/LandingNav.test.tsx` — new
- `src/components/landing/__tests__/FooterSection.test.tsx` — new
- `vitest.config.ts` — added resolve.alias for `@/` path
