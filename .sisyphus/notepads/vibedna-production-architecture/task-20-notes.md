Appended notes for Task 20: shared hooks and small UI primitives.

- Implemented SSR-safe useReducedMotion (uses matchMedia guard and defaults on server).
- Implemented useWebGL that checks canvas.getContext for webgl/experimental-webgl.
- Added LoadingSkeleton that composes existing Skeleton component and supports variants.
- Added EmptyState, ErrorState (with retry button), and WebGLFallback simple 2D canvas.
- Tests: basic smoke tests for hooks and components using @testing-library/react. Kept tests minimal to avoid heavy DOM requirements.

Notes/Decisions:
- Followed existing Skeleton/Card patterns; kept APIs minimal and composable.
- Avoided new deps; relied on built-in matchMedia and canvas APIs.
- Tests assume JSDOM environment from Vitest; webgl detection may return false in JSDOM which is acceptable.

Fixes applied:
- Adjusted vitest config to use jsdom and include .test.tsx files.
- Added src/test/setupTests.ts to import @testing-library/jest-dom.
- Added minimal devDependencies for @testing-library/react, @testing-library/user-event, and @testing-library/jest-dom to package.json so tests type-check and run in the CI/dev environment.

Rationale:
- The repo's vitest config originally targeted a node environment and only matched .test.ts files. The new Task 20 tests are .tsx and rely on DOM helpers and jest-dom matchers; switching to jsdom and adding setup imports is the minimal safe fix.

Next steps/notes:
- After installing dev dependencies (pnpm install), run `pnpm test` to verify. I kept changes minimal and local to test infra; no component/hook behavior was altered.
