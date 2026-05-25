Testing infrastructure notes

- Vitest is already configured via vitest.config.ts with a Node environment. Script `pnpm test` runs Vitest.
- React Testing Library (RTL) is not yet installed; recommend adding @testing-library/react and @testing-library/jest-dom when writing component tests.
- Playwright: Next.js experimental testmode includes Playwright support; no project-level Playwright config present. Recommend adding a minimal playwright.config.ts when end-to-end tests are required.

Minimal recommendations to enable full stack locally:
1. Install RTL and Playwright when ready:
   pnpm add -D @testing-library/react @testing-library/jest-dom playwright
2. Add a simple jest-like helper for DOM tests (setupTests.ts) to import matchers.
3. Keep Vitest config as-is to avoid Next build time resolution of Vitest.

This repo already has unit tests under src/lib/cache. The build remains passing with current test infra.
