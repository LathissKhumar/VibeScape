# VibeDNA UI/UX Complete Restructure

## TL;DR

> **Quick Summary**: Complete UI/UX restructure of VibeDNA into a hackathon-winning experience combining Spotify Wrapped aesthetics, a personality engine, and a social identity platform. Landing page + dashboard redesigned in parallel, 3D galaxy enhanced with full treatment, shareable personality cards, friend comparison, and listening timeline — all built with TDD (Vitest + Playwright) and lucide-react as the standardized icon system.

> **Deliverables**:
> - Cinematic landing page with hero, archetype showcase, galaxy preview, smooth scroll
> - Personality engine dashboard with "3AM sadness spikes" heatmap, radar chart, bento grid
> - Enhanced 3D galaxy with bloom, orbital navigation, genre constellations, click-to-focus
> - Shareable personality card with PNG export + OG-ready layout
> - Friend comparison (lite — share URLs, no backend)
> - Listening timeline: genre evolution + emotional transitions (procedural data)
> - Full mobile adaptation + accessibility + graceful WebGL fallback

> **Estimated Effort**: XL
> **Parallel Execution**: YES — 6 waves
> **Critical Path**: Test infra → Icon standardization → Hooks/Utils → Landing + Dashboard → Galaxy → Features → Polish → Final QA

---

## Context

### Original Request
"Complete UI/UX restructure of VibeDNA into a hackathon-winning product. Use shadcn MCP server, react-bits, visual engineering agents, and frontend-ui-ux skill. Must feel like 'Spotify Wrapped + Personality Engine + Social Identity Platform.' Current UI rejected entirely — not incremental polish."

### Interview Summary
**Key Discussions**:
- User wants "Spotify Wrapped + Personality Engine + Social Identity Platform" aesthetic
- "Surprise me" on design direction (creative freedom to combine Spotify Wrapped, Apple/Vercel minimalism, experimental Awwwards)
- Landing page + Dashboard to be restructured in parallel (same wave)
- TDD with Vitest + React Testing Library + Playwright
- Desktop-first with mobile adaptation
- Full galaxy treatment (8+ hours) with graceful WebGL fallback
- Standardize on lucide-react, remove material-symbols-outlined

**Research Findings**:
- Full codebase audit completed (3 explore agents): UI audit, data pipeline audit, shadcn integration audit
- Data pipeline is solid — no changes needed to src/lib/ (spotify, gemini, auth) or dashboard/page.tsx
- 12 shadcn/ui components installed (base-nova style) and actively used
- Globals.css has neon palette + glassmorphism foundations + CSS variable mappings
- framer-motion, recharts, three.js, @react-three/fiber already in dependencies
- Galaxy already dynamically imported (code-split)
- Material symbols used alongside lucide-react — needs standardization
- No test infrastructure exists — must be set up
- No empty/error/loading states — must be built
- No hooks directory — must be created

### Metis Review
**Identified Gaps** (addressed):
- No test infra → Sprint 0 task: install Vitest + RTL + Playwright
- Mixed icon systems → Standardize on lucide-react
- No mobile strategy → Desktop-first with adaptation
- Galaxy unbounded → Full treatment but time-boxed to 8+ hours
- No empty/error/loading states → Built into every component task
- No performance baseline → Lighthouse measurement in Sprint 0
- WebGL issues → Graceful degradation with 2D canvas fallback
- "Surprise me" risk → Design direction established via mood board exploration

---

## Work Objectives

### Core Objective
Restructure VibeDNA's entire UI/UX into a hackathon-winning product delivering a "memorable emotional experience" combining Spotify Wrapped bold visuals, personality engine identity, and social platform shareability.

### Concrete Deliverables
- Landing page: cinematic hero, archetype showcase, galaxy preview, smooth scroll sections, responsive mobile nav
- Dashboard: personality hero, "3AM sadness spikes" heatmap, audio features radar, artist cards, AI insights sheet, bento grid layout
- 3D Galaxy: bloom post-processing, orbital navigation, click-to-focus, genre constellations, artist info popups, animated connections
- Shareable personality card: branded export with PNG download, OG-ready layout
- Friend comparison: share URL flow, compare view with mock data
- Listening timeline: genre evolution graph, emotional transitions, procedural data from audio features
- Full test suite: Vitest unit/integration tests + Playwright E2E for all components
- Accessibility: keyboard navigation, ARIA labels, color contrast, prefers-reduced-motion

### Definition of Done
- [ ] All pages render without errors (pnpm build compiles, pnpm dev serves HTTP 200)
- [ ] All Vitest tests pass (bun test or vitest run — 100% pass)
- [ ] All Playwright E2E scenarios pass
- [ ] Lighthouse: 90+ Performance, 90+ Accessibility, 90+ Best Practices on desktop
- [ ] No material-symbols-outlined usage remains in codebase
- [ ] All components have: loading state, empty state, error state
- [ ] prefers-reduced-motion respected across all animations
- [ ] WebGL detection works; 2D canvas fallback renders when WebGL unavailable
- [ ] All evidence files exist in .sisyphus/evidence/

### Must Have
- Landing page is visually stunning (cinematic hero, smooth scroll, archetype preview)
- Dashboard feels like a personalized "Spotify Wrapped" permanent experience
- 3D Galaxy with bloom, orbital navigation, genre constellations
- Shareable personality card export works
- All components have loading/empty/error states
- All tests pass
- lucide-react only (no material-symbols)

### Must NOT Have (Guardrails)
- No changes to src/lib/spotify.ts, gemini.ts, auth.ts (data pipeline is solid)
- No changes to src/app/dashboard/page.tsx (server orchestration)
- No new npm packages without explicit review
- No real payment/auth/social backend features (Premium button stays placeholder)
- No replacement of Three.js rendering architecture
- No removal of @base-ui/react
- No real historical data collection (procedural/atmospheric is fine)
- No building of real friend request/messaging system
- No exceeding defined time budgets without pausing and asking

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (being set up in Sprint 0)
- **Automated tests**: TDD (tests first)
- **Framework**: Vitest + React Testing Library + Playwright
- **TDD**: Every task follows RED (failing test) → GREEN (minimal impl) → REFACTOR

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Library/Module**: Use Bash (bun repl) — Import, call functions, compare output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — Start Immediately, MAX PARALLEL):
├── Task 1: Test infra setup (Vitest + RTL + Playwright) [quick]
├── Task 2: Icon system standardization (material-symbols → lucide-react) [quick]
├── Task 3: Shared hooks (useMediaQuery, useReducedMotion, useWebGL) [quick]
├── Task 4: Utility components (LoadingSkeleton, EmptyState, ErrorState, WebGLFallback) [quick]
├── Task 5: Design system audit (CSS variable mapping stabilization) [quick]
└── Task 6: Baseline performance measurement + Lighthouse report [quick]

Wave 2 (Landing Page + Dashboard — PARALLEL WAVES):
├── Task 7: Split landing page into section components [unspecified-high]
├── Task 8: Hero section — cinematic redesign [visual-engineering]
├── Task 9: Archetype cards showcase redesign [visual-engineering]
├── Task 10: Galaxy preview section redesign [visual-engineering]
├── Task 11: Mobile navigation + responsive layout [unspecified-high]
└── Task 12: Smooth scroll + entrance animations [visual-engineering]

Wave 3 (Dashboard — PARALLEL with Wave 2):
├── Task 13: Split DashboardClient into section components [unspecified-high]
├── Task 14: Personality engine hero redesign [visual-engineering]
├── Task 15: Listening heatmap "3AM sadness spikes" redesign [visual-engineering]
├── Task 16: Audio features radar chart redesign [visual-engineering]
├── Task 17: Artist cards redesign [visual-engineering]
├── Task 18: AI insights sheet redesign [visual-engineering]
└── Task 19: Dashboard loading/empty/error states [unspecified-high]

Wave 4 (Galaxy Enhancement — after Waves 2+3):
├── Task 20: WebGL detection + graceful 2D canvas fallback [unspecified-high]
├── Task 21: Bloom post-processing + particle trails [visual-engineering]
├── Task 22: Click-to-focus + artist info popup [visual-engineering]
├── Task 23: Genre constellations + orbital navigation [visual-engineering]
└── Task 24: Camera transitions + animated artist connections [visual-engineering]

Wave 5 (Features — PARALLEL):
├── Task 25: Shareable personality card enhancement [visual-engineering]
├── Task 26: Friend comparison (lite — no backend) [unspecified-high]
└── Task 27: Listening timeline (genre evolution + emotional transitions) [visual-engineering]

Wave 6 (Polish + Cross-Cutting):
├── Task 28: Micro-interactions + entrance animations [visual-engineering]
├── Task 29: prefers-reduced-motion support across all animations [quick]
├── Task 30: Accessibility pass (keyboard, ARIA, color contrast) [unspecified-high]
├── Task 31: Responsive design pass (mobile + tablet verification) [unspecified-high]
└── Task 32: Performance optimization + bundle audit [unspecified-high]

Critical Path: Task 1 → Task 2→3→4→5→6 → Tasks 7→12 + 13→19 → Tasks 20→24 → Tasks 25→27 → Tasks 28→32 → F1→F4
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 7 (Wave 1)
```

### Dependency Matrix (abbreviated)

- **1-6**: None — 7-32, 1
- **7**: 1, 2, 3, 4, 5 — 8-12, 2
- **8-12**: 7 — 20-32, 2
- **13**: 1, 2, 3, 4, 5 — 14-19, 3
- **14-19**: 13 — 20-32, 3
- **20-24**: 7-19 — 25-32, 4
- **25-27**: 20-24 — 28-32, 5
- **28-32**: 25-27 — F1-F4, 6
- **F1-F4**: 28-32 — DONE, Final

---

## TODOs

- [x] 1. Test infrastructure setup (Vitest + RTL + Playwright)

  **What to do**:
  - Install Vitest, @testing-library/react, @testing-library/jest-dom, @vitejs/plugin-react, jsdom
  - Install Playwright + @playwright/test + npx playwright install (chromium)
  - Create `vitest.config.ts` with react plugin, jsdom environment, path alias (@/ → src/)
  - Create `src/test/test-utils.tsx` with custom render wrapper (Providers, TooltipProvider, SessionProvider mock)
  - Create `src/test/setup.ts` with jest-dom matchers, vitest global mocks for next/navigation, next-auth
  - Add test scripts to package.json: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:e2e": "playwright test"`
  - Create `playwright.config.ts` with baseURL, webServer config pointing to `pnpm dev`
  - Verify setup: create a smoke test that renders a button and asserts it exists
  - Run `vitest run` — must pass

  **Must NOT do**:
  - Do not install Jest (vitest is already decided)
  - Do not add test files for components that don't exist yet (smoke test only)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward configuration task — install packages, write config files, create test utilities. No creative or complex logic needed.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5, 6)
  - **Blocks**: Tasks 7, 13, and all subsequent TDD tasks
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/components/ui/button.tsx` — Use as first smoke test target (simple component to verify test setup)
  - `package.json` — Add test scripts alongside existing scripts
  - `components.json` — Confirm `@/` alias to match

  **Acceptance Criteria**:
  - [ ] Test file created: `src/test/test-utils.tsx` — custom render with all providers
  - [ ] Test file created: `src/test/setup.ts` — vitest setup with jest-dom matchers
  - [ ] Config file created: `vitest.config.ts` — react plugin, jsdom, path aliases
  - [ ] Config file created: `playwright.config.ts` — chromium, webServer, baseURL
  - [ ] `pnpm vitest run` → PASS (at least 1 smoke test)
  - [ ] `npx playwright install --with-deps chromium` → succeeds

  **QA Scenarios**:
  ```
  Scenario: Vitest runs and smoke test passes
    Tool: Bash
    Preconditions: vitest.config.ts, test-utils.tsx, setup.ts exist
    Steps:
      1. Run `pnpm vitest run --reporter=verbose`
      2. Check output contains "PASS" or "Tests 1 passed"
    Expected Result: Exit code 0, all tests pass
    Failure Indicators: Exit code non-zero, "FAIL" in output
    Evidence: .sisyphus/evidence/task-1-vitest-smoke.txt

  Scenario: Playwright can launch browser
    Tool: Bash
    Preconditions: playwright.config.ts exists, chromium installed
    Steps:
      1. Run `npx playwright install --with-deps chromium 2>&1 | tail -5`
      2. Check output confirms chromium installed
    Expected Result: Chromium installed successfully, no errors
    Failure Indicators: Exit code non-zero, installation errors
    Evidence: .sisyphus/evidence/task-1-playwright-install.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-1-vitest-smoke.txt`
  - [ ] `.sisyphus/evidence/task-1-playwright-install.txt`

  **Commit**: YES
  - Message: `test(setup): configure Vitest + RTL + Playwright for TDD workflow`
  - Files: `vitest.config.ts`, `playwright.config.ts`, `src/test/*`, `package.json`

- [x] 2. Icon system standardization (material-symbols → lucide-react)

  **What to do**:
  - Search entire codebase for `material-symbols-outlined` references in:
    - `src/app/page.tsx` — landing page icons (menu, close, chevron, etc.)
    - `src/app/dashboard/DashboardClient.tsx` — dashboard icons (share, explore, fingerprint, close, logout, premium, star, etc.)
    - `src/components/` — any component using material-symbols
    - `src/app/layout.tsx` — any Google Fonts import for material-symbols
  - For each usage, replace `<span class="material-symbols-outlined">icon_name</span>` with the equivalent lucide-react icon component
  - Remove any Google Fonts CSS import for "Material Symbols Outlined" from layout.tsx or globals.css
  - Ensure no remaining material-symbols references in any file
  - Verify build compiles and icons render correctly

  **Must NOT do**:
  - Do not add the @lucide/lab or any experimental lucide packages
  - Do not change any functionality — icon-for-icon replacement only

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward find-and-replace with visual verification. No complex logic.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5, 6)
  - **Blocks**: Tasks 7, 13 (all new components use lucide-react exclusively)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/app/page.tsx` — Primary target for icon replacement
  - `src/app/dashboard/DashboardClient.tsx` — Secondary target
  - `src/app/layout.tsx` — Check for Google Fonts import for material-symbols
  - `src/app/globals.css` — Check for material-symbols font-face or import

  **Acceptance Criteria**:
  - [ ] Zero instances of `material-symbols-outlined` remain in the codebase (grep returns 0)
  - [ ] Zero instances of `Material Symbols` remain in globals.css or layout.tsx
  - [ ] `pnpm build` compiles successfully
  - [ ] Landing page renders all icons correctly (Playwright visual check)

  **QA Scenarios**:
  ```
  Scenario: No material-symbols-outlined references remain
    Tool: Bash
    Preconditions: All files in codebase
    Steps:
      1. Run `grep -r "material-symbols-outlined" src/ --include="*.tsx" --include="*.ts" --include="*.css" || true`
      2. Check output is empty
    Expected Result: No references found, grep returns empty
    Failure Indicators: Any file still references material-symbols
    Evidence: .sisyphus/evidence/task-2-no-material-symbols.txt

  Scenario: Build compiles successfully
    Tool: Bash
    Preconditions: All icon replacements done
    Steps:
      1. Run `pnpm build 2>&1 | tail -20`
      2. Check for build errors
    Expected Result: "Compiled successfully" or equivalent
    Failure Indicators: Build errors related to missing icons
    Evidence: .sisyphus/evidence/task-2-build-success.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-2-no-material-symbols.txt`
  - [ ] `.sisyphus/evidence/task-2-build-success.txt`

  **Commit**: YES
  - Message: `refactor(icons): replace material-symbols-outlined with lucide-react throughout`
  - Files: All modified `.tsx`, `.css` files

- [x] 3. Create shared hooks (useMediaQuery, useReducedMotion, useWebGL)

  **What to do**:
  - Create `src/hooks/` directory (doesn't exist yet)
  - Create `src/hooks/useMediaQuery.ts`:
    - Accept a query string, return boolean
    - Listen for matchMedia change events
    - Handle SSR safely (default to false on server)
  - Create `src/hooks/useReducedMotion.ts`:
    - Use `prefers-reduced-motion` media query via useMediaQuery
    - Return boolean (true = user prefers reduced motion)
  - Create `src/hooks/useWebGL.ts`:
    - Try creating a WebGL context on a temporary canvas
    - Return `{ supported: boolean, renderer: 'webgl' | 'webgl2' | 'none' }`
    - Handle SSR (no window object)
  - Update `components.json` to confirm `hooks` alias works (or create barrel index.ts)
  - Test each hook with a Vitest test (mock matchMedia, mock navigator)

  **Must NOT do**:
  - Do not add external dependencies (these are pure React hooks)
  - Do not create hooks for features not yet planned

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small, focused utility hooks with clear interfaces. Standard React patterns.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5, 6)
  - **Blocks**: Tasks 7 (landing section components use hooks), Task 20 (useWebGL needed)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `components.json` — hooks alias already points to `@/hooks`
  - `src/lib/utils.ts` — Follow same utility pattern (pure, no side effects)

  **Acceptance Criteria**:
  - [ ] `src/hooks/useMediaQuery.ts` created with test
  - [ ] `src/hooks/useReducedMotion.ts` created with test
  - [ ] `src/hooks/useWebGL.ts` created with test
  - [ ] `src/hooks/index.ts` barrel export created
  - [ ] `vitest run` → PASS (all hook tests)

  **QA Scenarios**:
  ```
  Scenario: useMediaQuery returns correct value for known query
    Tool: Bash (vitest)
    Preconditions: Hook files exist
    Steps:
      1. Run `pnpm vitest run src/hooks/ --reporter=verbose 2>&1`
      2. Check tests pass
    Expected Result: All hook tests pass
    Failure Indicators: Test failures for any hook
    Evidence: .sisyphus/evidence/task-3-hooks-tests.txt

  Scenario: useWebGL detects WebGL support
    Tool: Bash (vitest)
    Preconditions: useWebGL.ts with proper WebGL detection
    Steps:
      1. Run `pnpm vitest run src/hooks/useWebGL.test.ts --reporter=verbose 2>&1`
      2. Check test verifies detection logic
    Expected Result: WebGL detection test passes
    Failure Indicators: Test failure if detection logic broken
    Evidence: .sisyphus/evidence/task-3-webgl-test.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-3-hooks-tests.txt`

  **Commit**: YES (groups with Task 4)
  - Message: `feat(hooks): add useMediaQuery, useReducedMotion, useWebGL shared hooks`

- [x] 4. Utility components (LoadingSkeleton, EmptyState, ErrorState, WebGLFallback)

  **What to do**:
  - Create `src/components/ui/loading-skeleton.tsx`:
    - Reusable skeleton component with variants (card, text, chart, hero)
    - Uses shadcn Skeleton as base, adds animation variants
  - Create `src/components/ui/empty-state.tsx`:
    - Accept `icon`, `title`, `description`, `action` (optional button) props
    - Centered layout with subtle animation
    - Uses lucide-react for icon
  - Create `src/components/ui/error-state.tsx`:
    - Accept `title`, `message`, `retryAction` (optional callback) props
    - Error-themed styling (red-tinted glass card)
    - Retry button with loading state
  - Create `src/components/WebGLFallback.tsx`:
    - Static 2D canvas visualization that mimics galaxy aesthetics
    - Accept same props as Galaxy (artists array)
    - Use Canvas 2D API to draw orbiting dots, glow effects
  - Write Vitest tests for each component (render, accept props, empty variants)
  - Write Playwright E2E test verifying visual rendering

  **Must NOT do**:
  - Do not add complex logic to these components (they're UI shells)
  - Do not build the actual Galaxy 2D fallback with full feature parity (that's Task 20)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple presentational components with clear interfaces. Standard React patterns.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5, 6)
  - **Blocks**: Tasks 7, 13, 19, 20 (all depend on these utility components)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/components/ui/skeleton.tsx` — Base skeleton to extend
  - `src/components/ui/card.tsx` — Card styling patterns to follow
  - `src/app/globals.css` — Glassmorphism and neon token classes

  **Acceptance Criteria**:
  - [ ] `src/components/ui/loading-skeleton.tsx` created with test
  - [ ] `src/components/ui/empty-state.tsx` created with test
  - [ ] `src/components/ui/error-state.tsx` created with test
  - [ ] `src/components/WebGLFallback.tsx` created with test
  - [ ] `vitest run` → PASS (all 4+ tests)
  - [ ] Components use lucide-react icons (no material-symbols)

  **QA Scenarios**:
  ```
  Scenario: LoadingSkeleton renders with correct variant
    Tool: Bash (vitest)
    Preconditions: Component files exist
    Steps:
      1. Run `pnpm vitest run src/components/ui/loading-skeleton.test.tsx --reporter=verbose`
      2. Check test for card variant passes
    Expected Result: Skeleton renders with animate-pulse class
    Failure Indicators: Render fails, wrong CSS class
    Evidence: .sisyphus/evidence/task-4-skeleton-test.txt

  Scenario: EmptyState renders with title and description
    Tool: Bash (vitest)
    Preconditions: Component files exist
    Steps:
      1. Run `pnpm vitest run src/components/ui/empty-state.test.tsx --reporter=verbose`
      2. Check test verifies title text and icon
    Expected Result: Title renders, icon renders, description renders
    Failure Indicators: Missing text, missing icon
    Evidence: .sisyphus/evidence/task-4-emptystate-test.txt

  Scenario: ErrorState shows retry button and handles click
    Tool: Bash (vitest)
    Preconditions: Component files exist
    Steps:
      1. Run `pnpm vitest run src/components/ui/error-state.test.tsx --reporter=verbose`
      2. Check retry callback test passes
    Expected Result: Retry button click triggers callback
    Failure Indicators: Callback not called, button missing
    Evidence: .sisyphus/evidence/task-4-errorstate-test.txt

  Scenario: WebGLFallback renders 2D canvas
    Tool: Bash (vitest)
    Preconditions: WebGLFallback.tsx exists
    Steps:
      1. Run `pnpm vitest run src/components/WebGLFallback.test.tsx --reporter=verbose`
      2. Check canvas element renders
    Expected Result: Canvas element in DOM, no errors
    Failure Indicators: Missing canvas, render error
    Evidence: .sisyphus/evidence/task-4-webglfallback-test.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-4-skeleton-test.txt`
  - [ ] `.sisyphus/evidence/task-4-emptystate-test.txt`
  - [ ] `.sisyphus/evidence/task-4-errorstate-test.txt`
  - [ ] `.sisyphus/evidence/task-4-webglfallback-test.txt`

  **Commit**: YES (groups with Task 3)
  - Message: `feat(ui): add LoadingSkeleton, EmptyState, ErrorState, WebGLFallback components`
  - Files: `src/components/ui/loading-skeleton.tsx`, `src/components/ui/empty-state.tsx`, `src/components/ui/error-state.tsx`, `src/components/WebGLFallback.tsx`

- [x] 5. Design system audit — CSS variable mapping stabilization

  **What to do**:
  - Audit `src/app/globals.css` for CSS variable mapping between VibeDNA tokens (@theme inline block) and shadcn/Radix CSS vars (:root/.dark block)
  - Identify any duplicate or conflicting variable definitions (e.g., `--color-border` vs `--border`, `--color-card` vs `--card`)
  - Create a `src/styles/tokens.css` file that clearly documents the canonical mapping:
    - VibeDNA token → shadcn variable → purpose
    - Color palette with hex values
    - Spacing/sizing tokens
  - Add JSDoc/comment documentation in globals.css explaining the relationship
  - Remove any unused CSS variables
  - Verify all shadcn components still reference correct variables
  - Run `pnpm build` to confirm no compilation issues

  **Must NOT do**:
  - Do not rename existing variables (would break live components)
  - Do not restructure the entire globals.css (keep changes minimal)
  - Do not add new CSS variables without clear need

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Documentation/audit task, not implementation. Read and analyze existing CSS.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 6)
  - **Blocks**: Tasks 7-32 (stable design tokens needed for all visual work)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/app/globals.css` — Full CSS variable audit needed
  - `src/components/ui/button.tsx:1-50` — Example of shadcn component using CSS variables
  - `src/components/ui/card.tsx` — Example of shadcn component using CSS variables
  - `components.json` — Verifies CSS variables enabled

  **Acceptance Criteria**:
  - [ ] `src/styles/tokens.css` created with documented variable mapping
  - [ ] globals.css comments updated explaining variable relationships
  - [ ] `pnpm build` → PASS
  - [ ] All shadcn components render with correct colors (visual check)

  **QA Scenarios**:
  ```
  Scenario: Design token documentation created
    Tool: Bash
    Preconditions: tokens.css exists
    Steps:
      1. Run `head -50 src/styles/tokens.css`
      2. Check it contains variable mappings
    Expected Result: Documented mapping of VibeDNA → shadcn variables
    Failure Indicators: File empty or missing
    Evidence: .sisyphus/evidence/task-5-tokens-doc.txt

  Scenario: Build compiles with stable tokens
    Tool: Bash
    Preconditions: All changes applied
    Steps:
      1. Run `pnpm build 2>&1 | tail -10`
    Expected Result: Build succeeds
    Failure Indicators: Build errors
    Evidence: .sisyphus/evidence/task-5-build.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-5-tokens-doc.txt`
  - [ ] `.sisyphus/evidence/task-5-build.txt`

  **Commit**: YES (groups with Task 6)
  - Message: `style(tokens): stabilize CSS variable mappings between VibeDNA and shadcn`

- [x] 6. Baseline performance measurement + Lighthouse report

  **What to do**:
  - Start the dev server (`pnpm dev`)
  - Run Lighthouse audit on landing page (/) — desktop + mobile
  - Run Lighthouse audit on dashboard (/dashboard) — desktop only (requires auth)
  - Record metrics: Performance, Accessibility, Best Practices, SEO scores
  - Record LCP, FID/INP, CLS, TBT
  - Measure bundle size: `npx next bundle-analyzer` or manual chunk inspection
  - Save report to `.sisyphus/evidence/baseline-lighthouse/`
  - Create a brief summary of findings — note the lowest-scoring areas

  **Must NOT do**:
  - Do not make any code changes (this is purely measurement)
  - Do not install lighthouse as a devDep (use Chrome DevTools or `npx lighthouse`)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Measurement/documentation task. Run tools, record output.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 5)
  - **Blocks**: Task 32 (performance optimization needs baseline)
  - **Blocked By**: Dev server must be running (can use `pnpm dev &` in background)

  **References**:
  - `next.config.ts` — Check current config for performance implications
  - `package.json` — Check for bundle analyzer scripts

  **Acceptance Criteria**:
  - [ ] Lighthouse report saved to `.sisyphus/evidence/baseline-lighthouse/`
  - [ ] Scores recorded for: Performance, Accessibility, Best Practices, SEO
  - [ ] Bundle size analysis completed
  - [ ] Summary of findings written

  **QA Scenarios**:
  ```
  Scenario: Lighthouse report exists
    Tool: Bash
    Preconditions: Dev server running
    Steps:
      1. Run `ls .sisyphus/evidence/baseline-lighthouse/`
      2. Check report files exist
    Expected Result: Lighthouse JSON/HTML reports present
    Failure Indicators: No files found
    Evidence: .sisyphus/evidence/task-6-baseline-exists.txt

  Scenario: Scores recorded in summary
    Tool: Bash
    Preconditions: Summary written
    Steps:
      1. Run `cat .sisyphus/evidence/baseline-lighthouse/summary.md`
      2. Check scores are present
    Expected Result: Performance, Accessibility, Best Practices, SEO scores listed
    Failure Indicators: Missing scores
    Evidence: .sisyphus/evidence/task-6-scores.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-6-baseline-exists.txt`
  - [ ] `.sisyphus/evidence/task-6-scores.txt`
  - [ ] `.sisyphus/evidence/baseline-lighthouse/` (full reports)

  **Commit**: YES (groups with Task 5)
  - Message: `chore(perf): baseline Lighthouse measurement and performance report`

- [x] 7. Split landing page (page.tsx) into section components

  **What to do**:
  - Read the current `src/app/page.tsx` (monolithic ~329 line client component)
  - Split into section components in `src/components/landing/`:
    - `HeroSection.tsx` — Hero with CTA (will be redesigned in Task 8)
    - `ArchetypePreviewSection.tsx` — Archetype card showcase (redesigned in Task 9)
    - `GalaxyPreviewSection.tsx` — Galaxy preview (redesigned in Task 10)
    - `FooterSection.tsx` — Footer content
    - `LandingNav.tsx` — Navigation bar (redesigned in Task 11)
  - Create `src/components/landing/index.ts` barrel export
  - Update `page.tsx` to import and compose these sections
  - Preserve all existing functionality (sign-in, navigation, mobile menu)
  - Write Vitest tests for each new component (render, display content)
  - Write Playwright test verifying all sections render on landing page

  **Must NOT do**:
  - Do not redesign the visual appearance (redesign happens in Tasks 8-12)
  - Do not change the auth/sign-in flow
  - Do not remove or alter existing functionality

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Non-trivial refactoring — splitting a monolith into well-structured sections while preserving functionality.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: NO (refactoring foundation for Tasks 8-12)
  - **Parallel Group**: Wave 2 (with Task 13 — dashboard split, parallel)
  - **Blocks**: Tasks 8, 9, 10, 11, 12
  - **Blocked By**: Tasks 1 (test infra), 2 (lucide icons), 3 (hooks), 4 (utility components)

  **References**:
  - `src/app/page.tsx` — The file to be split
  - `src/app/dashboard/DashboardClient.tsx` — Reference for client component patterns
  - `src/components/` — Existing component patterns to follow

  **Acceptance Criteria**:
  - [ ] `src/components/landing/` directory created with section components
  - [ ] `src/app/page.tsx` updated to compose section components
  - [ ] All existing functionality preserved (sign-in, mobile menu, Starfield)
  - [ ] `vitest run` → PASS (tests for each new component)
  - [ ] `pnpm build` → PASS

  **QA Scenarios**:
  ```
  Scenario: Landing page renders all sections
    Tool: Playwright
    Preconditions: Dev server running, not authenticated
    Steps:
      1. Navigate to http://localhost:3000
      2. Check page has hero section visible (title/CTA text)
      3. Scroll down — check archetype section visible
      4. Scroll further — check galaxy preview section visible
      5. Scroll to bottom — check footer visible
    Expected Result: All 4+ sections render in order
    Failure Indicators: Missing section, blank area, render error
    Evidence: .sisyphus/evidence/task-7-landing-sections.png

  Scenario: Mobile menu opens and closes
    Tool: Playwright
    Preconditions: Dev server running, viewport < 768px
    Steps:
      1. Navigate to http://localhost:3000
      2. Click hamburger menu button (mobile nav trigger)
      3. Check mobile nav panel is visible
      4. Click close button
      5. Check mobile nav panel is hidden
    Expected Result: Mobile nav toggles correctly
    Failure Indicators: Menu doesn't open/close
    Evidence: .sisyphus/evidence/task-7-mobile-menu.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-7-landing-sections.png`
  - [ ] `.sisyphus/evidence/task-7-mobile-menu.png`

  **Commit**: YES
  - Message: `refactor(landing): split monolithic page.tsx into section components`
  - Files: `src/app/page.tsx`, `src/components/landing/*`

- [x] 8. Hero section — cinematic redesign

  **What to do**:
  - Redesign `src/components/landing/HeroSection.tsx` as a cinematic hero:
    - Full-viewport height with gradient/glass overlay
    - Animated headline with staggered text reveal (framer-motion)
    - "VibeDNA" logo/brand mark with subtle animation
    - Subtitle with personality quiz teaser ("What's your music DNA?")
    - Primary CTA: "Discover Your VibeDNA" button (glass/neon style, native `<button>`, NOT shadcn Button)
    - Secondary CTA: "Explore Galaxy" smooth scroll link
    - Animated background particles or subtle 3D element
    - Starfield background (keep existing Starfield component integration)
  - Write Vitest test: renders headline, CTAs, brand mark
  - Write Playwright test: hero visible, CTA clickable, scrolls to next section
  - Design inspiration: Spotify Wrapped bold typography + Apple hero minimalism + VibeDNA neon aesthetic

  **Must NOT do**:
  - Do not use shadcn Button for gradient/glass CTAs (use native `<button>` with custom CSS)
  - Do not add autoplay video or heavy media assets
  - Do not change the sign-in/auth flow

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Creative visual design with animations, typography, layout composition.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: `playwright` — not needed for design work, testing separate

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 9, 10, 11, 12)
  - **Blocks**: None
  - **Blocked By**: Task 7 (section refactoring), Task 3 (hooks for animations), Tasks 1-4 (infra)

  **References**:
  - `src/app/globals.css` — Use neon palette, glassmorphism classes
  - `src/components/Starfield.tsx` — Background particle integration
  - `src/app/page.tsx` (current) — Reference existing hero content
  - Spotify Wrapped 2023/2024 design references (bold gradients, duotone)

  **Acceptance Criteria**:
  - [ ] HeroSection renders cinematic header with headline, brand, CTAs
  - [ ] Primary CTA uses native button with glass/neon styling (not shadcn Button)
  - [ ] Staggered text animation works on load
  - [ ] "Explore Galaxy" scrolls smoothly to next section
  - [ ] Starfield renders behind hero content
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Hero renders with all elements
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Check hero section is full viewport height
      3. Verify headline text is visible
      4. Verify "Discover Your VibeDNA" CTA button is visible
      5. Verify "Explore Galaxy" secondary link is visible
    Expected Result: Hero section with headline, CTAs, brand
    Failure Indicators: Missing elements, not full viewport
    Evidence: .sisyphus/evidence/task-8-hero-render.png

  Scenario: Staggered text animation plays
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait 2 seconds for animation to complete
      3. Check headline text has final opacity of 1
    Expected Result: Text animates to full visibility
    Failure Indicators: Text invisible after animation
    Evidence: .sisyphus/evidence/task-8-hero-animation.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-8-hero-render.png`
  - [ ] `.sisyphus/evidence/task-8-hero-animation.png`

  **Commit**: YES
  - Message: `feat(landing): cinematic hero section redesign`

- [x] 9. Archetype cards showcase redesign

  **What to do**:
  - Redesign `src/components/landing/ArchetypePreviewSection.tsx`:
    - Section title: "Discover Your Audio Archetype"
    - 3 featured archetype cards in a row (responsive grid)
    - Each card shows: archetype name, emoji/icon, short description, aura color swatch
    - Cards have hover effects (scale, glow, glass morph shift)
    - Subtle entrance animation on scroll (framer-motion)
    - Link/CTA to connect Spotify and discover personal archetype
    - Use shadcn Card as base with custom styling
  - Write Vitest test: renders 3 archetype cards, each with name and description
  - Write Playwright test: cards visible, hover triggers glow effect

  **Must NOT do**:
  - Do not fetch real personality data (this is a preview, static content)
  - Do not make cards clickable to authentication (keep separate CTA)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Card layout design with hover transitions, scroll animations, responsive grid.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 10, 11, 12)
  - **Blocks**: None
  - **Blocked By**: Task 7 (section refactoring)

  **References**:
  - `src/components/PersonalityCard.tsx` — Reference for archetype card patterns
  - `src/components/ui/card.tsx` — Base card component
  - `src/app/globals.css` — Glassmorphism, glow, neon classes

  **Acceptance Criteria**:
  - [ ] 3 archetype cards rendered in responsive grid
  - [ ] Each card has name, icon, description, color swatch
  - [ ] Hover effect: scale + glow on each card
  - [ ] Scroll-triggered entrance animation
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Three archetype cards render
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to archetype section
      3. Count visible archetype cards (querySelectorAll .archetype-card)
      4. Check each card has title text
    Expected Result: 3 cards visible, each with unique title
    Failure Indicators: Less than 3 cards, missing text
    Evidence: .sisyphus/evidence/task-9-archetype-cards.png

  Scenario: Hover triggers glow effect
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to archetype section
      3. Hover over first archetype card
      4. Check card has glow class or transform style
    Expected Result: Card visual change on hover
    Failure Indicators: No visual change detected
    Evidence: .sisyphus/evidence/task-9-archetype-hover.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-9-archetype-cards.png`
  - [ ] `.sisyphus/evidence/task-9-archetype-hover.png`

  **Commit**: YES
  - Message: `feat(landing): archetype cards showcase with hover effects`

- [x] 10. Galaxy preview section redesign

  **What to do**:
  - Redesign `src/components/landing/GalaxyPreviewSection.tsx`:
    - Section title: "Your Music, Visualized"
    - Embedded Galaxy component preview (smaller version, not full interactive)
    - Animated callout: "Each star is an artist. Each constellation is a genre."
    - "Explore Your Universe" CTA button linking to sign-in
    - Glass card container framing the preview
    - Subtle parallax or scroll-triggered reveal
  - Use dynamic import for Galaxy component (keep existing code-split pattern)
  - Write Vitest test: section renders with title and CTA
  - Write Playwright test: galaxy canvas renders, CTA visible

  **Must NOT do**:
  - Do not build a separate Galaxy instance (reuse existing Galaxy.tsx with different props)
  - Do not add full orbital navigation (that's Task 23)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Layout composition with 3D embed, parallax effects, animated typography.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 11, 12)
  - **Blocks**: None
  - **Blocked By**: Task 7 (section refactoring)

  **References**:
  - `src/components/Galaxy.tsx` — Reuse with smaller/limited mode
  - `src/app/page.tsx` — Existing galaxy preview content
  - `src/components/Starfield.tsx` — Background pattern

  **Acceptance Criteria**:
  - [ ] Galaxy preview section with title and description
  - [ ] Galaxy canvas renders (3D scene visible)
  - [ ] "Explore Your Universe" CTA present
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Galaxy preview section renders
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll to galaxy preview section
      3. Check section title "Your Music, Visualized" is visible
      4. Check Galaxy canvas element (canvas selector) is visible
      5. Check CTA button visible
    Expected Result: Title, 3D canvas, and CTA visible
    Failure Indicators: Missing canvas, missing CTA
    Evidence: .sisyphus/evidence/task-10-galaxy-preview.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-10-galaxy-preview.png`

  **Commit**: YES
  - Message: `feat(landing): galaxy preview section redesign`

- [x] 11. Mobile navigation + responsive layout

  **What to do**:
  - Redesign `src/components/landing/LandingNav.tsx`:
    - Fixed top navigation bar
    - Desktop: logo left, nav links center (Explore, Archetypes, Galaxy), CTA right
    - Mobile (<768px): logo left, hamburger right, sheet/drawer with nav links
    - Use shadcn Sheet component for mobile menu (existing)
    - Glassmorphism nav bar with blur backdrop
    - Active section highlighting on scroll (use useMediaQuery for responsive)
    - Smooth scroll to sections on link click
  - Ensure responsive layout for all landing page sections
  - Write Vitest test: desktop nav renders links, mobile hamburger toggles
  - Write Playwright test: responsive at desktop and mobile viewports

  **Must NOT do**:
  - Do not add authentication-required navigation items (this is public landing)
  - Do not replace the sign-in flow

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Responsive layout with navigation patterns, shadcn Sheet integration.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 10, 12)
  - **Blocks**: None
  - **Blocked By**: Task 7 (section refactoring)

  **References**:
  - `src/components/ui/sheet.tsx` — Mobile menu panel
  - `src/app/page.tsx` — Current nav implementation
  - `src/hooks/useMediaQuery.ts` — Responsive breakpoint detection

  **Acceptance Criteria**:
  - [ ] Desktop nav: logo + links + CTA visible at >=768px
  - [ ] Mobile nav: hamburger + sheet drawer at <768px
  - [ ] Glassmorphism styling with backdrop blur
  - [ ] Smooth scroll to sections on link click
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Desktop navigation renders
    Tool: Playwright
    Preconditions: Dev server running, viewport 1280x800
    Steps:
      1. Navigate to http://localhost:3000
      2. Check top nav bar is visible
      3. Check logo/brand is visible (left side)
      4. Check nav links visible (Explore, Archetypes, Galaxy)
      5. Check CTA button visible (right side)
    Expected Result: Full desktop nav with all elements
    Failure Indicators: Missing nav elements
    Evidence: .sisyphus/evidence/task-11-desktop-nav.png

  Scenario: Mobile navigation hamburger menu
    Tool: Playwright
    Preconditions: Dev server running, viewport 375x667
    Steps:
      1. Navigate to http://localhost:3000
      2. Check hamburger icon is visible (no desktop links)
      3. Click hamburger
      4. Check Sheet/drawer slides in with nav links
      5. Click a link
      6. Check sheet closes
    Expected Result: Mobile nav toggles correctly
    Failure Indicators: Menu doesn't open/close
    Evidence: .sisyphus/evidence/task-11-mobile-nav.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-11-desktop-nav.png`
  - [ ] `.sisyphus/evidence/task-11-mobile-nav.png`

  **Commit**: YES
  - Message: `feat(landing): mobile navigation and responsive layout`

- [x] 12. Smooth scroll + entrance animations

  **What to do**:
  - Add smooth scroll behavior to nav links (scroll to section by ID)
  - Add entrance animations to each landing section using framer-motion:
    - Hero: stagger children (title, subtitle, CTAs fade up)
    - Archetype section: cards fade in from bottom with stagger
    - Galaxy preview: fade in with slight scale
    - Footer: simple fade in
  - Use Intersection Observer via framer-motion's `whileInView` for scroll-triggered animations
  - Respect `prefers-reduced-motion` (use `useReducedMotion` hook)
  - Write Vitest test: animation variants defined correctly
  - Write Playwright test: animations trigger on scroll into view

  **Must NOT do**:
  - Do not add scroll-jacking or custom scroll behavior
  - Do not add heavy animation libraries (framer-motion already installed)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Scroll-triggered animations, staggered reveals, motion design.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 10, 11)
  - **Blocks**: None
  - **Blocked By**: Tasks 7, 8, 9, 10, 11 (sections must exist to animate them)

  **References**:
  - `src/hooks/useReducedMotion.ts` — Respect user preference
  - `src/app/dashboard/DashboardClient.tsx` — Existing framer-motion usage patterns
  - framer-motion docs: `whileInView`, `staggerChildren`, `useInView`

  **Acceptance Criteria**:
  - [ ] Hero section has staggered entrance animation
  - [ ] Archetype cards animate in on scroll
  - [ ] Galaxy preview animates on scroll
  - [ ] `prefers-reduced-motion` disables animations
  - [ ] Nav links smooth-scroll to correct sections
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Sections animate on scroll into view
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Hero animation visible (text fades up)
      3. Scroll to archetype section
      4. Check cards animate into view
      5. Scroll to galaxy preview
      6. Check section animates into view
    Expected Result: Each section animates when scrolled into viewport
    Failure Indicators: Sections appear without animation
    Evidence: .sisyphus/evidence/task-12-entrance-animations.mp4 (video capture)

  Scenario: Smooth scroll navigation works
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Click "Archetypes" nav link
      2. Check page scrolls to archetype section
      3. Check archetype section is in viewport
    Expected Result: Smooth scroll to target section
    Failure Indicators: Instant jump or wrong section
    Evidence: .sisyphus/evidence/task-12-smooth-scroll.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-12-entrance-animations.mp4`
  - [ ] `.sisyphus/evidence/task-12-smooth-scroll.png`

  **Commit**: YES
  - Message: `feat(landing): smooth scroll and entrance animations`

- [x] 13. Split DashboardClient into section components

  **What to do**:
  - Read the current `src/app/dashboard/DashboardClient.tsx` (~509 line monolithic client component)
  - Split into section components in `src/components/dashboard/`:
    - `DashboardNav.tsx` — Top navigation with personality context
    - `PersonalityHero.tsx` — Archetype hero section (redesigned Task 14)
    - `ListeningHeatmapSection.tsx` — Heatmap container (redesigned Task 15)
    - `AudioRadarSection.tsx` — Audio features radar (redesigned Task 16)
    - `ArtistCardsSection.tsx` — Top artist cards (redesigned Task 17)
    - `AIInsightsSheet.tsx` — AI insights sheet content (redesigned Task 18)
    - `DashboardBentoGrid.tsx` — Grid layout container
  - Create `src/components/dashboard/index.ts` barrel export
  - Update `DashboardClient.tsx` to import and compose these sections
  - Preserve all existing functionality (sign-out, sheet, 3D galaxy)
  - Write Vitest tests for each new component (render with mock props)
  - Write Playwright test verifying all sections render on dashboard

  **Must NOT do**:
  - Do not redesign the visual appearance (redesign happens in Tasks 14-19)
  - Do not change the data flow (props from server component)
  - Do not remove existing functionality

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Significant refactoring — splitting a 500+ line monolith while preserving all functionality.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Wave 2 — landing page)
  - **Parallel Group**: Wave 3 (with Tasks 14, 15, 16, 17, 18, 19)
  - **Blocks**: Tasks 14, 15, 16, 17, 18, 19
  - **Blocked By**: Tasks 1, 2, 3, 4 (test infra, icons, hooks, utilities)

  **References**:
  - `src/app/dashboard/DashboardClient.tsx` — The file to be split
  - `src/components/landing/` — Reference for section component pattern
  - `src/components/PersonalityCard.tsx` — Existing personality component

  **Acceptance Criteria**:
  - [ ] `src/components/dashboard/` directory created with section components
  - [ ] `DashboardClient.tsx` updated to compose section components
  - [ ] All existing functionality preserved (galaxy, sign-out, AI sheet)
  - [ ] `vitest run` → PASS
  - [ ] `pnpm build` → PASS

  **QA Scenarios**:
  ```
  Scenario: Dashboard renders all sections
    Tool: Playwright
    Preconditions: Dev server running, authenticated session
    Steps:
      1. Navigate to http://localhost:3000/dashboard
      2. Check personality hero section visible
      3. Check bento grid visible
      4. Check 3D galaxy canvas visible
      5. Check nav bar with sign-out button visible
    Expected Result: All dashboard sections render
    Failure Indicators: Missing section, blank area
    Evidence: .sisyphus/evidence/task-13-dashboard-sections.png

  Scenario: AI Insights sheet opens
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Click FAB/button to open AI insights
      3. Check sheet/drawer slides in with content
      4. Close sheet
    Expected Result: AI insights sheet opens and closes
    Failure Indicators: Sheet doesn't open
    Evidence: .sisyphus/evidence/task-13-ai-sheet.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-13-dashboard-sections.png`
  - [ ] `.sisyphus/evidence/task-13-ai-sheet.png`

  **Commit**: YES
  - Message: `refactor(dashboard): split DashboardClient into section components`
  - Files: `src/app/dashboard/DashboardClient.tsx`, `src/components/dashboard/*`

- [x] 14. Personality engine hero redesign

  **What to do**:
  - Redesign `src/components/dashboard/PersonalityHero.tsx`:
    - Large archetype name with animated gradient text
    - Aura color glow effect (pulsing ring/halo behind the archetype name)
    - Chaos index display with animated radial progress bar
    - Secondary trait shown as a badge/pill
    - 2-sentence summary with subtle fade-in
    - "Share Your VibeDNA" button (native `<button>`, NOT shadcn Button)
    - Responsive: full width on mobile, side-by-side on desktop
    - Use framer-motion entrance animations
  - Write Vitest test: renders with personality prop, displays all fields
  - Write Playwright test: hero visible, chaos index animates, share button works

  **Must NOT do**:
  - Do not use shadcn Button for the share CTA
  - Do not change the Personality type interface
  - Do not fetch or compute personality data (comes from props)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Animated hero section with gradient text, glow effects, progress animations.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 15, 16, 17, 18, 19)
  - **Blocks**: None
  - **Blocked By**: Task 13 (section refactoring), Task 3 (hooks)

  **References**:
  - `src/components/PersonalityCard.tsx` — Reference for existing personality display
  - `src/types/next-auth.ts` — Personality interface
  - `src/app/globals.css` — Aura color, neon glow classes

  **Acceptance Criteria**:
  - [ ] Archetype name displayed with gradient text animation
  - [ ] Aura color glow effect present (pulsing ring/halo)
  - [ ] Chaos index animated radial progress bar
  - [ ] Secondary trait badge/pill
  - [ ] Summary text displayed
  - [ ] Share button (native element) functional
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Personality hero displays all data
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Check archetype name text is visible
      3. Check chaos index progress bar is visible (percentage)
      4. Check secondary trait badge is visible
      5. Check summary text is visible (2 sentences)
    Expected Result: All personality fields render
    Failure Indicators: Missing archetype, missing chaos index
    Evidence: .sisyphus/evidence/task-14-personality-hero.png

  Scenario: Chaos index animates on load
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /dashboard
      2. Wait 1 second
      3. Check chaos index value animates from 0 to final percentage
    Expected Result: Progress bar fills to correct percentage
    Failure Indicators: No animation, stuck at 0
    Evidence: .sisyphus/evidence/task-14-chaos-animation.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-14-personality-hero.png`
  - [ ] `.sisyphus/evidence/task-14-chaos-animation.png`

  **Commit**: YES
  - Message: `feat(dashboard): personality engine hero redesign`

- [x] 15. Listening heatmap redesign ("3AM Sadness Spikes" style)

  **What to do**:
  - Redesign `src/components/dashboard/ListeningHeatmapSection.tsx`:
    - 7×24 heatmap grid (days × hours) with "3AM Sadness Spike" annotation
    - Cells colored by intensity (derived from audio features data)
    - Annotate notable patterns: "3AM Sadness Spike 🔮", "Monday Morning Energy 💫"
    - Time labels on X axis (0-23h), day labels on Y axis (Mon-Sun)
    - Tooltip on hover showing "Day, Hour: Intensity value"
    - Below heatmap: weekly pulse chart (CSS bars, one per day)
    - Donut chart showing "Morning/Afternoon/Evening/Night" listening distribution
    - Responsive: horizontal scroll on mobile, full grid on desktop
    - Use framer-motion for cell entrance animations (staggered)
    - Clear labeling: "Your Predicted Weekly Rhythm" (procedural data warning)
  - Write Vitest test: renders grid, annotations, distribution chart
  - Write Playwright test: cells render, hover tooltip works

  **Must NOT do**:
  - Do not claim data is real listening history (label as atmospheric)
  - Do not add real data collection pipeline

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex data visualization with animations, tooltips, multiple chart types.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 16, 17, 18, 19)
  - **Blocks**: None
  - **Blocked By**: Task 13 (section refactoring)

  **References**:
  - `src/components/ListeningHeatmap.tsx` — Current implementation
  - `src/components/AudioFeaturesChart.tsx` — Reference for data visualization patterns
  - `src/app/globals.css` — Color tokens for heat intensity

  **Acceptance Criteria**:
  - [ ] 7×24 heatmap grid renders (168 cells)
  - [ ] Cells colored by intensity (color gradient)
  - [ ] "3AM Sadness Spike" annotation visible
  - [ ] Tooltip shows on cell hover (day, hour, value)
  - [ ] Weekly pulse bars render below heatmap
  - [ ] Donut chart for listening distribution renders
  - [ ] Label indicates procedural data ("Your Predicted Weekly Rhythm")
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Heatmap grid renders with annotations
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Scroll to heatmap section
      3. Check 7x24 grid is visible (count cells)
      4. Check "3AM Sadness Spike" annotation text visible
      5. Hover over a cell — check tooltip appears
      6. Check weekly pulse bars visible below heatmap
    Expected Result: Full heatmap with annotations and charts
    Failure Indicators: Missing grid, missing annotation
    Evidence: .sisyphus/evidence/task-15-heatmap.png

  Scenario: Distribution donut chart renders
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /dashboard
      2. Scroll to heatmap section
      3. Check donut chart (Morning/Afternoon/Evening/Night) is visible
    Expected Result: Distribution chart visible
    Failure Indicators: Missing donut chart
    Evidence: .sisyphus/evidence/task-15-donut.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-15-heatmap.png`
  - [ ] `.sisyphus/evidence/task-15-donut.png`

  **Commit**: YES
  - Message: `feat(dashboard): listening heatmap with 3AM sadness spikes style`

- [x] 16. Audio features radar chart redesign

  **What to do**:
  - Redesign `src/components/dashboard/AudioRadarSection.tsx`:
    - Section title: "Your Sonic DNA"
    - Radar/spider chart showing 5 averaged audio features (Energy, Valence, Danceability, Acousticness, Instrumentalness)
    - Use Recharts RadarChart with custom styling
    - Stroke/fill color from personality aura color
    - Glass card container with subtle glow border
    - Animated radar fill on entrance (framer-motion + Recharts animation)
    - Tooltip on hover showing exact values
    - Responsive: full size on desktop, compact on mobile
    - Below radar: quick stat cards (highest trait, lowest trait, contrast)
  - Write Vitest test: renders with audio features prop, all axes visible
  - Write Playwright test: chart renders, tooltip works

  **Must NOT do**:
  - Do not replace Recharts with a different charting library
  - Do not add 3D radar visualization

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Data visualization design with Recharts integration, custom styling, animations.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15, 17, 18, 19)
  - **Blocks**: None
  - **Blocked By**: Task 13 (section refactoring)

  **References**:
  - `src/components/AudioFeaturesChart.tsx` — Current implementation
  - `src/app/globals.css` — Aura color, glass card classes

  **Acceptance Criteria**:
  - [ ] Radar chart with 5 axes (Energy, Valence, Danceability, Acousticness, Instrumentalness)
  - [ ] Chart colored by personality aura color
  - [ ] Glass card container with glow border
  - [ ] Tooltip with exact values on hover
  - [ ] Quick stat cards below radar
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Radar chart renders with 5 axes
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Scroll to "Your Sonic DNA" section
      3. Check radar chart SVG is visible
      4. Check 5 axis labels visible (Energy, Valence, etc.)
      5. Check glass card container visible
    Expected Result: Radar chart with all 5 axes
    Failure Indicators: Missing chart, fewer axes
    Evidence: .sisyphus/evidence/task-16-radar.png

  Scenario: Quick stat cards render below chart
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /dashboard
      2. Scroll to audio features section
      3. Check stat cards visible (highest trait, lowest trait, contrast)
    Expected Result: 3 stat cards visible
    Failure Indicators: Missing stat cards
    Evidence: .sisyphus/evidence/task-16-stat-cards.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-16-radar.png`
  - [ ] `.sisyphus/evidence/task-16-stat-cards.png`

  **Commit**: YES
  - Message: `feat(dashboard): audio features radar chart redesign`

- [x] 17. Artist cards redesign

  **What to do**:
  - Redesign `src/components/dashboard/ArtistCardsSection.tsx`:
    - Section title: "Your Top Artists"
    - Display top 3 artists in a row (responsive grid)
    - Each card shows:
      - Artist image with gentle zoom on hover
      - Artist name with truncation for long names
      - Genre badges (using shadcn Badge)
      - Brief audio trait (e.g., "High Energy", "Mellow Vibe")
    - Glass card styling with hover glow effect
    - Click on card opens artist in Spotify (external link)
    - Entrance animation with stagger (framer-motion)
    - Empty state when no artists: "Keep listening to discover your top artists"
  - Write Vitest test: renders 3 cards with images + names
  - Write Playwright test: cards visible, hover effect works

  **Must NOT do**:
  - Do not add artist detail page (keep as cards)
  - Do not fetch additional data beyond what's already in props

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Card design with images, hover effects, badges, responsive grid.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15, 16, 18, 19)
  - **Blocks**: None
  - **Blocked By**: Task 13 (section refactoring)

  **References**:
  - Existing artist rendering in DashboardClient.tsx
  - `src/components/ui/card.tsx` — Base card component
  - `src/components/ui/badge.tsx` — Genre badges

  **Acceptance Criteria**:
  - [ ] 3 artist cards rendered with images + names
  - [ ] Genre badges on each card
  - [ ] Hover: zoom on image, glow effect
  - [ ] Click opens artist in Spotify (external)
  - [ ] Entrance animation with stagger
  - [ ] Empty state when artists array empty
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Artist cards render with images
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Scroll to "Your Top Artists" section
      3. Check 3 artist cards visible
      4. Check each card has artist image (img tag)
      5. Check each card has artist name text
      6. Check genre badges visible
    Expected Result: 3 cards with images, names, badges
    Failure Indicators: Missing cards, missing images
    Evidence: .sisyphus/evidence/task-17-artist-cards.png

  Scenario: Hover effect on artist card
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /dashboard
      2. Scroll to artist section
      3. Hover over first artist card
      4. Check image scale transform applied
      5. Check glow effect added
    Expected Result: Visual hover effect triggers
    Failure Indicators: No visual change on hover
    Evidence: .sisyphus/evidence/task-17-artist-hover.png

  Scenario: Empty state for no artists
    Tool: Bash (unit test)
    Preconditions: ArtistCardsSection test file exists
    Steps:
      1. Run `pnpm vitest run src/components/dashboard/ArtistCardsSection.test.tsx --reporter=verbose`
      2. Check empty state test passes
    Expected Result: Empty state renders when empty array passed
    Failure Indicators: Test failure for empty state
    Evidence: .sisyphus/evidence/task-17-empty-state.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-17-artist-cards.png`
  - [ ] `.sisyphus/evidence/task-17-artist-hover.png`
  - [ ] `.sisyphus/evidence/task-17-empty-state.txt`

  **Commit**: YES
  - Message: `feat(dashboard): artist cards redesign`

- [x] 18. AI Insights sheet redesign

  **What to do**:
  - Redesign `src/components/dashboard/AIInsightsSheet.tsx`:
    - FAB button (bottom-right): glassmorphism circle with sparkle/star icon
    - Opens a shadcn Sheet (slide from right) containing:
      - Title: "Your AI Insights"
      - Personality summary with aura glow
      - Chaos index breakdown (what contributes to it)
      - "Your vibe is [archetype] because..." explanation card
      - Quick stat cards: top genre, mood trend, energy level
      - "Refresh Analysis" button (simulated — triggers reload)
    - Animated sheet entrance (slide + fade)
    - Row of stat cards with icons (lucide-react)
    - Write Vitest test: sheet opens, content renders with personality data
    - Write Playwright test: FAB visible, click opens sheet, content renders

  **Must NOT do**:
  - Do not add real-time AI re-analysis (simulated refresh only)
  - Do not change the sheet library (keep shadcn Sheet)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Sheet/drawer UI with animated content cards, stats layout, icon integration.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15, 16, 17, 19)
  - **Blocks**: None
  - **Blocked By**: Task 13 (section refactoring)

  **References**:
  - `src/components/ui/sheet.tsx` — Sheet primitives
  - `src/app/dashboard/DashboardClient.tsx` — Current AI insights implementation
  - `src/types/next-auth.ts` — Personality type for content

  **Acceptance Criteria**:
  - [ ] FAB button visible (bottom-right, glassmorphism)
  - [ ] Clicking FAB opens Sheet from right
  - [ ] Sheet contains: personality summary, chaos breakdown, explanation card, stat cards
  - [ ] Stat cards with lucide-react icons
  - [ ] "Refresh Analysis" button (simulated)
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: FAB opens AI Insights sheet
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Check FAB button visible (bottom right)
      3. Click FAB
      4. Check Sheet slides in from right
      5. Check "Your AI Insights" title visible
      6. Check personality summary visible
      7. Check stat cards visible
      8. Close sheet
    Expected Result: Sheet opens with all content
    Failure Indicators: FAB not visible, sheet doesn't open
    Evidence: .sisyphus/evidence/task-18-ai-sheet.png

  Scenario: Stat cards render with icons
    Tool: Playwright
    Preconditions: Sheet open
    Steps:
      1. Open AI Insights sheet
      2. Scroll to stat cards section
      3. Check each card has an icon (lucide-react SVG)
      4. Check each card has label and value
    Expected Result: 3+ stat cards with icons
    Failure Indicators: Missing icons, missing values
    Evidence: .sisyphus/evidence/task-18-stat-icons.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-18-ai-sheet.png`
  - [ ] `.sisyphus/evidence/task-18-stat-icons.png`

  **Commit**: YES
  - Message: `feat(dashboard): AI insights sheet redesign`

- [x] 19. Dashboard loading, empty, and error states

  **What to do**:
  - Add robust state handling to ALL dashboard sections:
    - **Loading state**: Each section shows LoadingSkeleton variant while data loads
    - **Empty state**: Section-specific EmptyState when data is null/empty:
      - No personality: "Connect and listen to unlock your archetype"
      - No artists: "Your top artists will appear as you listen more"
      - No audio features: "Audio analysis needs more listening data"
    - **Error state**: Section-specific ErrorState with retry capability
    - Add Suspense boundaries around data-dependent sections in DashboardClient
    - Add error boundaries for critical sections (Galaxy, heatmap, radar)
    - Create `src/components/dashboard/DashboardErrorBoundary.tsx`
    - Update `loading.tsx` to show refined skeleton matching new layout
    - Write Vitest tests for each state (loading, empty, error)
    - Write Playwright tests verifying states render correctly

  **Must NOT do**:
  - Do not change data fetching (states are client-side only)
  - Do not auto-retry on error (let user click retry)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Cross-cutting state management — error boundaries, Suspense, loading skeletons for all sections.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15, 16, 17, 18)
  - **Blocks**: None (but needed for completeness)
  - **Blocked By**: Tasks 13, 4 (section components + utility components must exist)

  **References**:
  - `src/app/dashboard/loading.tsx` — Current loading skeleton
  - `src/components/ui/loading-skeleton.tsx` — Created in Task 4
  - `src/components/ui/empty-state.tsx` — Created in Task 4
  - `src/components/ui/error-state.tsx` — Created in Task 4

  **Acceptance Criteria**:
  - [ ] Each dashboard section has LoadingSkeleton variant
  - [ ] Each section has EmptyState for null/empty data
  - [ ] Each section has ErrorState with retry button
  - [ ] ErrorBoundary wraps critical sections (Galaxy, heatmap, radar)
  - [ ] `loading.tsx` matches new dashboard layout
  - [ ] `vitest run` → PASS (loading, empty, error tests per section)

  **QA Scenarios**:
  ```
  Scenario: Loading skeleton renders during data fetch
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /dashboard
      2. Check loading skeleton visible for each section
      3. Wait for data to load
      4. Check skeleton replaced by actual content
    Expected Result: Skeleton → content transition
    Failure Indicators: Flash of missing content
    Evidence: .sisyphus/evidence/task-19-loading-state.png

  Scenario: Empty state renders for missing data
    Tool: Bash (unit test)
    Preconditions: Test file for empty state
    Steps:
      1. Run `pnpm vitest run src/components/dashboard/ --reporter=verbose -t "empty" 2>&1`
      2. Check empty state tests pass
    Expected Result: Empty state components render with correct messaging
    Failure Indicators: Test failures
    Evidence: .sisyphus/evidence/task-19-empty-tests.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-19-loading-state.png`
  - [ ] `.sisyphus/evidence/task-19-empty-tests.txt`

  **Commit**: YES (groups with Task 18)
  - Message: `feat(dashboard): loading, empty, and error states for all sections`
  - Files: All dashboard section component files

- [x] 20. WebGL detection + graceful 2D canvas fallback

  **What to do**:
  - Integrate `useWebGL` hook into Galaxy component:
    - On mount, detect WebGL support via `useWebGL()` hook
    - If WebGL NOT supported → render WebGLFallback component instead
    - If WebGL supported → render normal Three.js Galaxy
  - Refine `src/components/WebGLFallback.tsx` (created in Task 4):
    - Accept same data props as Galaxy (topArtists array)
    - Canvas 2D API visualization:
      - Draw orbiting dots (one per artist) with varying sizes
      - Glow effects using radial gradients
      - Subtle animation loop (requestAnimationFrame)
      - Color-coded by artist genre (if available)
    - Match Galaxy aesthetic: dark background, colored dots, glow
  - Add CSS transition between fallback and 3D views
  - Write Vitest test: WebGL detection logic
  - Write Playwright test: verify canvas fallback renders
    (may need to simulate WebGL-unavailable environment)

  **Must NOT do**:
  - Do not build a full 3D engine in 2D Canvas (keep it simple)
  - Do not remove the 3D Galaxy component

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Integration of detection logic with 2D Canvas fallback. Requires understanding both 3D and 2D rendering.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential with other galaxy tasks)
  - **Parallel Group**: Wave 4 (with Tasks 21, 22, 23, 24)
  - **Blocks**: None (foundation task for galaxy wave)
  - **Blocked By**: Tasks 3 (useWebGL hook), 4 (WebGLFallback component)

  **References**:
  - `src/hooks/useWebGL.ts` — WebGL detection hook (Task 3)
  - `src/components/Galaxy.tsx` — Three.js galaxy to integrate with
  - `src/components/WebGLFallback.tsx` — Canvas 2D fallback (Task 4)

  **Acceptance Criteria**:
  - [ ] Galaxy component detects WebGL support on mount
  - [ ] If WebGL supported: Three.js Galaxy renders
  - [ ] If WebGL not supported: 2D Canvas fallback renders
  - [ ] Fallback Canvas matches Galaxy aesthetic
  - [ ] Smooth transition between states
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Three.js Galaxy renders when WebGL available
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Check Three.js canvas element is present
      3. Check canvas has 3D content (not fallback)
    Expected Result: Three.js Galaxy visible
    Failure Indicators: Fallback rendered, no canvas
    Evidence: .sisyphus/evidence/task-20-webgl-galaxy.png

  Scenario: Fallback renders without WebGL (unit test)
    Tool: Bash (unit test)
    Preconditions: useWebGL mock returns false
    Steps:
      1. Run `pnpm vitest run src/components/WebGLFallback.test.tsx --reporter=verbose`
      2. Check fallback renders Canvas2D content
    Expected Result: Canvas 2D fallback renders correctly
    Failure Indicators: Test failure
    Evidence: .sisyphus/evidence/task-20-fallback-test.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-20-webgl-galaxy.png`
  - [ ] `.sisyphus/evidence/task-20-fallback-test.txt`

  **Commit**: YES
  - Message: `feat(galaxy): WebGL detection and graceful 2D canvas fallback`

- [x] 21. Bloom post-processing + particle trails

  **What to do**:
  - Add bloom (glow) post-processing to the Three.js Galaxy:
    - Install/unpkg `@react-three/postprocessing` (or use drei's `EffectComposer`)
    - Add `Bloom` effect with intensity/radius/luminanceThreshold tuned for neon aesthetic
    - Only stars above certain brightness get bloom glow
  - Add particle trails to orbiting artist planets:
    - Each planet leaves a faint trail as it orbits (using Points or LineGeometry)
    - Trail color matches planet color
    - Trail fades over time (opacity gradient)
  - Performance: limit bloom to certain objects, use lower resolution for trails
  - Write Vitest test: bloom configuration valid
  - Write Playwright test: visual comparison (bloom visible on bright stars)

  **Must NOT do**:
  - Do not add post-processing that drops framerate below 30fps on mid-range GPUs
  - Do not add `@react-three/postprocessing` if `drei`'s built-in EffectComposer suffices
  - Do not add SSR effects (not needed for this aesthetic)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Three.js post-processing, particle systems, visual effects engineering.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 20, 22, 23, 24)
  - **Blocks**: None
  - **Blocked By**: Task 20 (galaxy integration point)

  **References**:
  - `src/components/Galaxy.tsx` — Existing Three.js setup
  - drei/EffectComposer docs — `@react-three/postprocessing` or drei built-in
  - `src/components/Starfield.tsx` — Reference for particle patterns

  **Acceptance Criteria**:
  - [ ] Bloom post-processing adds glow to bright stars
  - [ ] Orbiting artist planets have visible particle trails
  - [ ] Performance maintains 30+ fps (no jank)
  - [ ] `pnpm build` → PASS
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Bloom glow visible on bright stars
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Verify Galaxy canvas renders with bloom
      3. Check bright stars have visible glow/bloom effect
      4. Check bloom doesn't wash out darker elements
    Expected Result: Selective bloom glow on bright objects
    Failure Indicators: No bloom visible, entire scene blown out
    Evidence: .sisyphus/evidence/task-21-bloom.png

  Scenario: Particle trails visible on orbiting planets
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /dashboard
      2. Wait 3 seconds for orbits to animate
      3. Check planets have trailing particles behind them
    Expected Result: Particle trails visible behind moving planets
    Failure Indicators: No trails, trails don't animate
    Evidence: .sisyphus/evidence/task-21-trails.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-21-bloom.png`
  - [ ] `.sisyphus/evidence/task-21-trails.png`

  **Commit**: YES
  - Message: `feat(galaxy): bloom post-processing and particle trails`

- [x] 22. Click-to-focus on planets + artist info popup

  **What to do**:
  - Make orbiting artist planets interactive:
    - Click on a planet → camera smoothly transitions to focus on it
    - Planet scales up slightly when focused
    - Show artist info popup (HTML overlay, not 3D text):
      - Artist name (with truncation)
      - Artist image (from Spotify data)
      - Genre badges
      - "Open in Spotify" button (external link)
    - Click elsewhere or press Escape → camera zooms back out to galaxy view
    - Smooth camera transition (3-second ease-in-out)
  - Use drei's `CameraControls` or custom OrbitControls for camera animation
  - Write Vitest test: click handler works on planet mesh
  - Write Playwright test: click planet → camera moves + popup appears

  **Must NOT do**:
  - Do not add raycasting that's too expensive (limit interactive objects)
  - Do not build a full 3D UI (keep info popup as HTML overlay)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Three.js interactivity (raycasting, camera animation), HTML overlay UI.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 20, 21, 23, 24)
  - **Blocks**: None
  - **Blocked By**: Task 20 (galaxy integration point)

  **References**:
  - `src/components/Galaxy.tsx` — Existing galaxy with planet objects
  - `src/components/ui/card.tsx` — Info popup card styling
  - `@react-three/drei` — `CameraControls` / `OrbitControls`

  **Acceptance Criteria**:
  - [ ] Clicking artist planet triggers camera focus animation
  - [ ] Artist info popup appears with name, image, genre badges, Spotify link
  - [ ] Escape or clicking elsewhere returns camera to galaxy view
  - [ ] Smooth camera transition (3s ease-in-out)
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Click planet shows info popup
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Wait for galaxy to load
      3. Click on an artist planet (canvas click at planet position)
      4. Wait for camera animation (~3s)
      5. Check artist info popup visible with name
      6. Check "Open in Spotify" button visible
    Expected Result: Camera focuses on planet, popup shows artist info
    Failure Indicators: No popup, no camera movement
    Evidence: .sisyphus/evidence/task-22-planet-click.png

  Scenario: Escape returns to galaxy view
    Tool: Playwright
    Preconditions: Planet focused with popup visible
    Steps:
      1. Press Escape key
      2. Wait for camera animation (~3s)
      3. Check popup is gone
      4. Check camera returned to original position
    Expected Result: Camera zooms out, popup closes
    Failure Indicators: Popup remains, camera doesn't move
    Evidence: .sisyphus/evidence/task-22-escape.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-22-planet-click.png`
  - [ ] `.sisyphus/evidence/task-22-escape.png`

  **Commit**: YES
  - Message: `feat(galaxy): click-to-focus on planets and artist info popup`

- [x] 23. Genre constellations + orbital navigation

  **What to do**:
  - Add genre-based constellation grouping to the galaxy:
    - Artists of same genre are grouped in same orbital region
    - Draw constellation lines between same-genre artists
    - Each genre group has a subtle color tint
    - Genre labels float near constellations (HTML overlay or 3D Text)
  - Add orbital navigation controls:
    - Left/right arrow keys or drag to rotate view
    - Scroll to zoom in/out
    - Genre filter buttons: show/hide constellations by genre
    - Auto-rotate toggle button
  - Create constellation mode toggle (view all / group by genre)
  - Write Vitest test: genre grouping logic correct
  - Write Playwright test: constellation lines visible, genre toggle works

  **Must NOT do**:
  - Do not make this a full space sim (keep the galaxy metaphor)
  - Do not add too many constellation lines (limit to top genres)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex 3D visualization with constellation lines, grouping logic, interactive controls.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 20, 21, 22, 24)
  - **Blocks**: None
  - **Blocked By**: Task 20 (galaxy integration point)

  **References**:
  - `src/components/Galaxy.tsx` — Existing galaxy with orbital patterns
  - Three.js `Line` / `LineBasicMaterial` — Constellation line rendering
  - `@react-three/drei` — `Text` for 3D genre labels

  **Acceptance Criteria**:
  - [ ] Genre constellations visible (lines between same-genre artists)
  - [ ] Constellation toggle switches between view modes
  - [ ] Genre filter buttons show/hide specific constellations
  - [ ] Orbital navigation: drag to rotate, scroll to zoom
  - [ ] Auto-rotate toggle works
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Genre constellation lines visible
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Wait for galaxy to load
      3. Toggle constellation mode on
      4. Check constellation lines visible between same-genre artists
      5. Check genre labels visible near constellations
    Expected Result: Constellation lines + labels visible
    Failure Indicators: No lines, no labels
    Evidence: .sisyphus/evidence/task-23-constellations.png

  Scenario: Genre filter toggles constellations
    Tool: Playwright
    Preconditions: Constellations visible
    Steps:
      1. Click genre filter button for specific genre
      2. Check that genre's constellation hides
      3. Click again — check it reappears
    Expected Result: Genre filter toggles constellation visibility
    Failure Indicators: Filter doesn't work, no visual change
    Evidence: .sisyphus/evidence/task-23-genre-filter.png

  Scenario: Auto-rotate toggle works
    Tool: Playwright
    Preconditions: Galaxy loaded
    Steps:
      1. Click auto-rotate toggle
      2. Wait 3 seconds — check galaxy is rotating
      3. Click toggle again
      4. Wait 2 seconds — check rotation stopped
    Expected Result: Auto-rotate toggles on/off
    Failure Indicators: Rotation doesn't change
    Evidence: .sisyphus/evidence/task-23-autorotate.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-23-constellations.png`
  - [ ] `.sisyphus/evidence/task-23-genre-filter.png`
  - [ ] `.sisyphus/evidence/task-23-autorotate.png`

  **Commit**: YES
  - Message: `feat(galaxy): genre constellations and orbital navigation`

- [x] 24. Camera transitions + animated artist connections

  **What to do**:
  - Add cinematic camera transitions:
    - On galaxy load: slow zoom-in from far away (dramatic entrance)
    - On genre filter change: camera orbits to best view of active constellations
    - On planet click: smooth fly-to (already started in Task 22)
    - On auto-rotate: gentle orbital drift
  - Add animated connections between related artists:
    - Artists with shared genres have pulsing connection lines
    - Lines animate (dash offset or pulse opacity)
    - Color-coded by genre group
    - Line width varies by similarity strength
  - Add subtle starfield depth parallax (stars at different depths move at different speeds)
  - Write Vitest test: camera animation triggers correctly
  - Write Playwright test: entrance zoom visible, connection lines pulse

  **Must NOT do**:
  - Do not add VR/AR camera modes
  - Do not add cinematic effects that cause motion sickness

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Cinematic camera work, animated 3D connections, parallax depth effects.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 20, 21, 22, 23)
  - **Blocks**: None
  - **Blocked By**: Tasks 21, 22, 23 (visual effects to integrate with)

  **References**:
  - `src/components/Galaxy.tsx` — Main galaxy implementation
  - `src/components/Starfield.tsx` — Starfield depth reference
  - drei `CameraControls` — Camera animation utilities

  **Acceptance Criteria**:
  - [ ] Dramatic zoom-in entrance animation on galaxy load
  - [ ] Camera orbits to show active constellations on filter change
  - [ ] Animated connection lines between related artists (pulsing)
  - [ ] Starfield depth parallax (multi-layer)
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Dramatic entrance animation plays
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /dashboard (fresh load)
      2. Record initial camera position
      3. Wait 3 seconds for entrance animation
      4. Check camera has moved closer (different position)
    Expected Result: Camera zooms from far away toward galaxy
    Failure Indicators: No camera movement, instant jump
    Evidence: .sisyphus/evidence/task-24-entrance.png

  Scenario: Connection lines pulse between related artists
    Tool: Playwright
    Preconditions: Galaxy loaded, constellation mode on
    Steps:
      1. Check connection lines visible between artists
      2. Wait 2 seconds
      3. Check line opacity/color has changed (animation playing)
    Expected Result: Animated pulsing connection lines
    Failure Indicators: Static lines, no animation
    Evidence: .sisyphus/evidence/task-24-connections.mp4
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-24-entrance.png`
  - [ ] `.sisyphus/evidence/task-24-connections.mp4`

  **Commit**: YES
  - Message: `feat(galaxy): camera transitions and animated artist connections`

- [x] 25. Shareable personality card enhancement

  **What to do**:
  - Enhance `src/components/PersonalityCard.tsx`:
    - Redesigned card layout with VibeDNA branding
    - Archetype name with gradient text + aura glow
    - Chaos index as animated radial bar (reuse from Task 14)
    - Secondary trait badge
    - Summary text
    - Top genres list (from artist data)
    - "VibeDNA" watermark/brand mark
    - Color theme selector (4-5 preset aura colors)
    - Download as PNG button (using html-to-image, already in deps)
    - Copy share text button: "I'm the [Archetype] archetype! 🎵 Discover yours at VibeDNA"
  - Add OG-image-ready layout (for future social share):
    - Fixed 1200×630 aspect ratio version
    - All text large and readable at thumbnail size
  - Write Vitest test: card renders all personality data
  - Write Playwright test: PNG download works, color selector switches theme

  **Must NOT do**:
  - Do not build an OG image generation server (client-side only for now)
  - Do not add social media API integration

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Card layout design with export functionality, color theming, branding.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 26, 27)
  - **Blocks**: None
  - **Blocked By**: Tasks 14 (personality hero provides reuse patterns)

  **References**:
  - `src/components/PersonalityCard.tsx` — Current implementation
  - `src/components/dashboard/PersonalityHero.tsx` — Reuse archetype display patterns
  - `html-to-image` (in deps) — PNG export library

  **Acceptance Criteria**:
  - [ ] Redesigned shareable card with branding
  - [ ] Chaos index radial bar (animated)
  - [ ] Color theme selector (4-5 presets)
  - [ ] PNG download button works (saves file)
  - [ ] Copy share text button works
  - [ ] OG-ready layout variant (1200×630)
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Share card renders all personality data
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Scroll to personality card section
      3. Check archetype name visible
      4. Check chaos index bar visible
      5. Check summary text visible
      6. Check top genres list visible
      7. Check VibeDNA branding visible
    Expected Result: Full personality card with all data
    Failure Indicators: Missing data fields
    Evidence: .sisyphus/evidence/task-25-share-card.png

  Scenario: PNG download works
    Tool: Playwright
    Preconditions: Card rendered
    Steps:
      1. Click "Download as PNG" button
      2. Check browser download dialog or file saved
      3. Verify downloaded file is PNG format
    Expected Result: PNG file downloads successfully
    Failure Indicators: No download, wrong format
    Evidence: .sisyphus/evidence/task-25-download.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-25-share-card.png`
  - [ ] `.sisyphus/evidence/task-25-download.png`

  **Commit**: YES
  - Message: `feat(share): shareable personality card with enhanced branding and export`

- [x] 26. Friend comparison (lite — no backend)

  **What to do**:
  - Create `src/components/dashboard/FriendComparison.tsx`:
    - Section: "Compare with Friends"
    - Share URL generation:
      - Encode personality data as URL parameters (archetype, chaosIndex, auraColor)
      - Generate shareable link: `/compare?data={encoded}`
    - Paste a friend's share URL → decode + display comparison:
      - Side-by-side archetype cards (you vs friend)
      - Comparison stats: "You're both [trait]" or "You're opposites!"
      - Chaos index comparison bar
      - Compatibility meter (simple algorithm based on archetype compatibility)
    - Mock data handler: if no URL provided, show a "Paste a friend's link" input
    - Example card: "Share your VibeDNA link with friends to compare!"
  - Create comparison page `src/app/compare/page.tsx` (client component):
    - Reads `data` from URL search params
    - Decodes and renders comparison view
  - Write Vitest test: URL encode/decode roundtrip, comparison logic
  - Write Playwright test: share URL generation, comparison page renders

  **Must NOT do**:
  - Do not build a backend for friend data storage
  - Do not add friend request/accept flow
  - Do not add real-time collaboration
  - Do not store shared data in a database

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: URL-based data sharing with comparison UI. New page route + comparison logic.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 25, 27)
  - **Blocks**: None
  - **Blocked By**: Task 14 (personality data structure)

  **References**:
  - `src/components/PersonalityCard.tsx` — Reference for archetype card reuse
  - `src/types/next-auth.ts` — Personality type for comparison
  - Next.js App Router `useSearchParams` — URL parameter handling

  **Acceptance Criteria**:
  - [ ] Share URL generation encodes personality data
  - [ ] `/compare` page decodes and renders comparison
  - [ ] Side-by-side archetype cards display
  - [ ] Compatibility meter shows match percentage
  - [ ] "Paste link" input works
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Share URL generation creates valid link
    Tool: Playwright
    Preconditions: Authenticated, personality data loaded
    Steps:
      1. Navigate to /dashboard
      2. Click "Share" button in friend comparison section
      3. Check generated URL contains encoded personality data
      4. Copy the URL
    Expected Result: Valid share URL generated
    Failure Indicators: Empty URL, no data encoded
    Evidence: .sisyphus/evidence/task-26-share-url.png

  Scenario: Comparison page renders with decoded data
    Tool: Playwright
    Preconditions: Share URL exists
    Steps:
      1. Navigate to the generated /compare?data=... URL
      2. Check two archetype cards visible (you + friend)
      3. Check compatibility meter visible
      4. Check chaos index comparison visible
    Expected Result: Comparison page with both profiles
    Failure Indicators: Missing cards, missing comparison data
    Evidence: .sisyphus/evidence/task-26-comparison.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-26-share-url.png`
  - [ ] `.sisyphus/evidence/task-26-comparison.png`

  **Commit**: YES
  - Message: `feat(compare): friend comparison lite with share URLs`

- [x] 27. Listening timeline (genre evolution + emotional transitions)

  **What to do**:
  - Create `src/components/dashboard/ListeningTimeline.tsx`:
    - Section title: "Your Listening Journey"
    - Genre evolution visualization:
      - Horizontal timeline with genre "epochs" (procedural from audio features)
      - Color-coded genre blocks with transition gradients
      - Label: "From [Genre] Phase → to [Genre] Phase"
    - Emotional transitions visualization:
      - Valence (positivity) trend line over "time" (procedural 12-month view)
      - Peaks and valleys annotated: "Peak Mood 📈", "Dip 📉"
      - Energy overlay on same chart (dual line or area)
    - Data is procedurally generated from current audio features (not real history)
    - Clear label: "Your projected listening journey based on your audio DNA"
    - Responsive: horizontal scroll on mobile, full width on desktop
  - Write Vitest test: timeline renders with genre blocks + trend lines
  - Write Playwright test: timeline visible, annotations render

  **Must NOT do**:
  - Do not claim data is real listening history (label as atmospheric projection)
  - Do not build real data collection pipeline
  - Do not make timeline interactive (no zoom/pan — keep it simple)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Timeline visualization with genre transitions, trend lines, annotations.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 25, 26)
  - **Blocks**: None
  - **Blocked By**: None (standalone component)

  **References**:
  - `src/components/ListeningHeatmap.tsx` — Reference for procedural data patterns
  - `src/components/dashboard/ListeningHeatmapSection.tsx` — Integration point
  - `src/types/next-auth.ts` — Audio features for data generation

  **Acceptance Criteria**:
  - [ ] Genre evolution timeline renders (color-coded genre blocks)
  - [ ] Valence trend line with annotations (peaks, valleys)
  - [ ] Energy overlay on same chart
  - [ ] Clear label indicating procedural data
  - [ ] Responsive: horizontal scroll on mobile
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Genre timeline renders with transitions
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Scroll to "Your Listening Journey" section
      3. Check genre blocks visible (color-coded)
      4. Check transition gradients between genres
      5. Check "From [Genre] → [Genre]" label
    Expected Result: Genre evolution timeline visible
    Failure Indicators: Missing blocks, no labels
    Evidence: .sisyphus/evidence/task-27-genre-timeline.png

  Scenario: Emotional trend lines render
    Tool: Playwright
    Preconditions: Timeline section visible
    Steps:
      1. Check valence trend line visible
      2. Check energy overlay visible (second line)
      3. Check annotation labels visible ("Peak Mood", "Dip")
    Expected Result: Trend lines with annotations
    Failure Indicators: Missing trend lines or annotations
    Evidence: .sisyphus/evidence/task-27-emotional-trends.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-27-genre-timeline.png`
  - [ ] `.sisyphus/evidence/task-27-emotional-trends.png`

  **Commit**: YES
  - Message: `feat(timeline): listening timeline with genre evolution and emotional transitions`

 - [x] 28. Micro-interactions + entrance animations

  **What to do**:
  - Add micro-interactions across the app:
    - Button hover: subtle scale + glow increase
    - Card hover: slight lift + shadow increase
    - Link hover: underline slide animation
    - Nav link active: glow indicator
    - CTA button: gentle pulse animation to attract attention
  - Add entrance animations:
    - Landing page sections: staggered fade-up on scroll (done in Task 12, verify)
    - Dashboard sections: staggered entrance on load
    - Cards within sections: stagger children
    - Galaxy section: fade in after canvas loads
    - Share button: gentle bounce/shine animation
  - Use framer-motion for all animations
  - Respect `prefers-reduced-motion` via `useReducedMotion` hook
  - Write Vitest test: animation variants defined, reduced motion respected
  - Write Playwright test: animations play on load/hover

  **Must NOT do**:
  - Do not add animations that cause layout shift
  - Do not add animations longer than 1 second (except entrances)
  - Do not add sound effects

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Fine-grained motion design — hover states, entrance sequences, framer-motion patterns.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 29, 30, 31, 32)
  - **Blocks**: None
  - **Blocked By**: Tasks 8-19 (all UI components must exist)

  **References**:
  - `src/components/dashboard/DashboardClient.tsx` — Existing framer-motion patterns
  - `src/hooks/useReducedMotion.ts` — Reduced motion hook (Task 3)
  - framer-motion docs — `whileHover`, `whileInView`, `staggerChildren`

  **Acceptance Criteria**:
  - [ ] Button hover: scale + glow
  - [ ] Card hover: lift + shadow
  - [ ] Entrance animations: stagger fade-up on sections
  - [ ] CTA gentle pulse animation
  - [ ] `prefers-reduced-motion` disabled animations
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Button hover triggers scale + glow
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to landing page
      2. Hover over primary CTA button
      3. Check scale transform applied
      4. Check glow effect visible
    Expected Result: Button animates on hover
    Failure Indicators: No visual change on hover
    Evidence: .sisyphus/evidence/task-28-button-hover.png

  Scenario: prefers-reduced-motion disables animations
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Set prefers-reduced-motion: reduce in Playwright emulation
      2. Navigate to landing page
      3. Check no entrance animations play (elements appear instantly)
    Expected Result: Animations disabled with reduced motion
    Failure Indicators: Animations still play
    Evidence: .sisyphus/evidence/task-28-reduced-motion.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-28-button-hover.png`
  - [ ] `.sisyphus/evidence/task-28-reduced-motion.png`

  **Commit**: YES (groups with Tasks 29)
  - Message: `feat(ui): micro-interactions and entrance animations across app`

- [x] 29. prefers-reduced-motion support across all animations

  **What to do**:
  - Audit EVERY framer-motion animation in the codebase:
    - Landing page: HeroSection, ArchetypePreviewSection, GalaxyPreviewSection, FooterSection
    - Dashboard: PersonalityHero, ListeningHeatmap, AudioRadarSection, ArtistCardsSection, AIInsightsSheet
    - Galaxy: entrance zoom, planet orbit animations, connection line pulses
    - Micro-interactions: button hovers, card hovers, entrance animations
  - For each animation, add check using `useReducedMotion()` hook:
    - If reduced motion preferred: disable animation entirely (no `animate` prop)
    - If reduced motion preferred: skip stagger and show all at once
    - If reduced motion preferred: remove parallax effects
  - Create a `useAnimationConfig()` hook that returns `{ shouldAnimate, transition, stagger }` based on reduced motion preference
  - Write Vitest test: animation config returns correct values for reduced motion
  - Write Playwright test: all animations disabled with prefers-reduced-motion

  **Must NOT do**:
  - Do not remove animations entirely for all users (only for reduced motion preference)
  - Do not use `@media (prefers-reduced-motion: reduce)` CSS only (must also use JS for framer-motion)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Systematic audit and fix across all components. Clear pattern to follow.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 28, 30, 31, 32)
  - **Blocks**: None
  - **Blocked By**: Tasks 8-27 (all animated components)

  **References**:
  - `src/hooks/useReducedMotion.ts` — Detection hook (Task 3)
  - framer-motion docs — `useReducedMotion()` and conditional animation

  **Acceptance Criteria**:
  - [ ] All framer-motion animations respect `useReducedMotion()`
  - [ ] `useAnimationConfig()` hook created and used across components
  - [ ] When `prefers-reduced-motion: reduce`: no animations play
  - [ ] When no preference: all animations play normally
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: All animations disabled with reduced motion
    Tool: Playwright
    Preconditions: prefers-reduced-motion: reduce enabled
    Steps:
      1. Navigate to landing page (reduced motion)
      2. Check all sections appear without animation (instant visibility)
      3. Navigate to /dashboard (reduced motion)
      4. Check dashboard sections appear without animation
      5. Hover over button — check no scale/glow animation
    Expected Result: No animations play anywhere
    Failure Indicators: Any animation still plays
    Evidence: .sisyphus/evidence/task-29-no-animations.png

  Scenario: Animations play normally without reduced motion
    Tool: Playwright
    Preconditions: No reduced motion preference
    Steps:
      1. Navigate to landing page
      2. Check entrance animations play
    Expected Result: Animations play normally
    Failure Indicators: Animations absent
    Evidence: .sisyphus/evidence/task-29-animations-normal.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-29-no-animations.png`
  - [ ] `.sisyphus/evidence/task-29-animations-normal.png`

  **Commit**: YES (groups with Task 28)
  - Message: `fix(a11y): add prefers-reduced-motion support to all animations`

- [x] 30. Accessibility pass (keyboard, ARIA, color contrast)

  **What to do**:
  - Keyboard navigation audit:
    - All interactive elements reachable via Tab
    - Focus indicators visible (custom focus ring matching neon aesthetic)
    - Sheet/dialog: focus trap works, Escape closes
    - Galaxy: keyboard controls documented
    - Sign-out, share, download buttons keyboard-operable
  - ARIA labels:
    - Icon-only buttons get `aria-label` (hamburger menu, close, share, FAB)
    - Navigation landmarks: `<nav aria-label="Main">`
    - Sheets and dialogs: `aria-labelledby`, `aria-describedby`
    - Galaxy canvas: `role="img"` with `aria-label` describing the visualization
    - SVG annotations ("3AM Sadness Spike"): `aria-hidden="true"` with text alternative
  - Color contrast audit:
    - Verify neon colors on dark backgrounds meet WCAG AA (4.5:1 for text)
    - Test all interactive text, placeholder text, disabled states
    - Adjust any failing combinations
  - Run Lighthouse accessibility audit before/after
  - Write Vitest tests: ARIA labels present on interactive elements
  - Write Playwright tests: keyboard navigation works (Tab through elements)

  **Must NOT do**:
  - Do not remove visual design to meet accessibility (find balanced solutions)
  - Do not add auto-focus that traps keyboard users

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Cross-cutting accessibility audit — requires systematic checking across all components.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 28, 29, 31, 32)
  - **Blocks**: None
  - **Blocked By**: Tasks 8-27 (all UI components must exist)

  **References**:
  - WCAG 2.1 AA criteria — Color contrast, keyboard, ARIA requirements
  - `src/components/ui/dialog.tsx` — Reference for focus trap pattern
  - `src/components/ui/sheet.tsx` — Reference for sheet accessibility

  **Acceptance Criteria**:
  - [ ] All interactive elements keyboard-reachable with visible focus indicators
  - [ ] All icon-only buttons have `aria-label`
  - [ ] Sheets/dialogs have proper ARIA attributes
  - [ ] Galaxy canvas has `role="img"` + `aria-label`
  - [ ] SVG annotations have `aria-hidden="true"` with text alternatives
  - [ ] Color contrast passes WCAG AA (4.5:1 minimum)
  - [ ] Lighthouse Accessibility score ≥ 90
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Keyboard navigation works
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to landing page
      2. Press Tab repeatedly
      3. Check focus moves through all interactive elements
      4. Check focus ring is visible (custom styled)
      5. Tab to hamburger menu → Enter to open
      6. Tab through mobile nav links → Escape closes
    Expected Result: Full keyboard navigation works
    Failure Indicators: Tab skips elements, no focus indicator
    Evidence: .sisyphus/evidence/task-30-keyboard-nav.mp4

  Scenario: ARIA labels present on icon buttons
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Query all buttons without visible text
      2. Check each has aria-label attribute
      3. Verify labels are descriptive (not empty)
    Expected Result: All icon buttons have aria-labels
    Failure Indicators: Missing or empty aria-labels
    Evidence: .sisyphus/evidence/task-30-aria-labels.txt

  Scenario: Lighthouse accessibility ≥ 90
    Tool: Bash
    Preconditions: Dev server running
    Steps:
      1. Run Lighthouse on landing page
      2. Check Accessibility score
    Expected Result: Accessibility score ≥ 90
    Failure Indicators: Score < 90
    Evidence: .sisyphus/evidence/task-30-lighthouse-a11y.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-30-keyboard-nav.mp4`
  - [ ] `.sisyphus/evidence/task-30-aria-labels.txt`
  - [ ] `.sisyphus/evidence/task-30-lighthouse-a11y.txt`

  **Commit**: YES (groups with Tasks 31)
  - Message: `fix(a11y): accessibility pass — keyboard, ARIA labels, color contrast`

- [x] 31. Responsive design pass

  **What to do**:
  - Test and fix at 3 breakpoints:
    - Mobile: 375×667 (iPhone SE)
    - Tablet: 768×1024 (iPad)
    - Desktop: 1280×800 (standard)
  - Landing page:
    - Hero: full viewport height, text scales, CTAs stack on mobile
    - Archetype cards: 1 column mobile, 2 tablet, 3 desktop
    - Galaxy preview: compact on mobile, full width on desktop
    - Nav: hamburger on mobile, full links on desktop
  - Dashboard:
    - Bento grid: single column mobile, 2 columns tablet, 3 columns desktop
    - Personality hero: stacked mobile, side-by-side desktop
    - Heatmap: horizontal scroll mobile, full grid desktop
    - Radar chart: compact mobile, larger desktop
    - Artist cards: 1 column mobile, 3 desktop
    - AI Insights sheet: full width mobile, right panel desktop
  - Ensure all touch targets ≥ 44×44px on mobile
  - Remove horizontal overflow on all breakpoints
  - Write Playwright tests at each breakpoint verifying layout

  **Must NOT do**:
  - Do not add separate mobile/desktop code paths (use Tailwind responsive classes)
  - Do not hide content on mobile without providing alternative access

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Systematic responsive testing and fixes across all components at multiple breakpoints.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 28, 29, 30, 32)
  - **Blocks**: None
  - **Blocked By**: Tasks 8-27 (all UI components must exist)

  **References**:
  - Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
  - `src/app/globals.css` — Current responsive token configuration

  **Acceptance Criteria**:
  - [ ] Landing page renders correctly at 375px, 768px, 1280px
  - [ ] Dashboard renders correctly at 375px, 768px, 1280px
  - [ ] All touch targets ≥ 44×44px on mobile
  - [ ] No horizontal overflow at any breakpoint
  - [ ] Bento grid adapts: 1 col mobile, 2 tablet, 3 desktop
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Landing page responsive at all breakpoints
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Set viewport to 375x667 (mobile)
      2. Navigate to landing page — check no overflow, nav is hamburger
      3. Set viewport to 768x1024 (tablet)
      4. Check 2-column archetype cards
      5. Set viewport to 1280x800 (desktop)
      6. Check full nav, 3-column cards
    Expected Result: Landing page adapts at each breakpoint
    Failure Indicators: Overflow, broken layout
    Evidence: .sisyphus/evidence/task-31-landing-responsive.png

  Scenario: Dashboard responsive at all breakpoints
    Tool: Playwright
    Preconditions: Authenticated
    Steps:
      1. Set viewport to 375x667
      2. Navigate to /dashboard — check single column layout
      3. Check all touch targets ≥ 44x44px
      4. Set viewport to 1280x800
      5. Check 3-column bento grid
    Expected Result: Dashboard adapts at each breakpoint
    Failure Indicators: Broken grid, small touch targets
    Evidence: .sisyphus/evidence/task-31-dashboard-responsive.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-31-landing-responsive.png`
  - [ ] `.sisyphus/evidence/task-31-dashboard-responsive.png`

  **Commit**: YES (groups with Task 30)
  - Message: `fix(responsive): mobile and tablet responsive verification pass`

- [x] 32. Performance optimization + bundle audit

  **What to do**:
  - Run Lighthouse audit and compare with baseline (Task 6):
    - Target: 90+ Performance, 90+ Accessibility, 90+ Best Practices
    - If below 90: identify and fix bottlenecks
  - Bundle size optimization:
    - Run `npx next bundle-analyzer` to identify large chunks
    - Ensure all heavy components are dynamically imported (Galaxy, Charts)
    - Verify Three.js, recharts are code-split
    - Check for duplicate dependencies
  - Performance fixes:
    - Add `loading="lazy"` to artist images
    - Add proper `width`/`height` to images to prevent layout shift
    - Ensure fonts are preloaded (Inter, Outfit)
    - Add `preconnect` hints for external origins
    - Verify CSS is not render-blocking
    - Check for unnecessary re-renders (React.memo where beneficial)
  - Measure and report final Lighthouse scores
  - Write Playwright test: Lighthouse Performance ≥ 90

  **Must NOT do**:
  - Do not prematurely optimize (measure first, then fix)
  - Do not remove Three.js or recharts (they're core features)
  - Do not compromise visual quality for performance (find balance)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Systematic performance audit and optimization across the entire app.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 6 (with Tasks 28, 29, 30, 31)
  - **Blocks**: None
  - **Blocked By**: Tasks 8-27 (all features must exist to measure)

  **References**:
  - `.sisyphus/evidence/baseline-lighthouse/` — Baseline scores from Task 6
  - `next.config.ts` — Current config for optimization hooks
  - `src/app/layout.tsx` — Font loading strategy

  **Acceptance Criteria**:
  - [ ] Lighthouse Performance ≥ 90 (desktop)
  - [ ] Lighthouse Accessibility ≥ 90 (desktop)
  - [ ] Lighthouse Best Practices ≥ 90 (desktop)
  - [ ] All heavy components dynamically imported
  - [ ] Images lazy-loaded with dimensions
  - [ ] Final scores documented and compared to baseline
  - [ ] `vitest run` → PASS

  **QA Scenarios**:
  ```
  Scenario: Lighthouse scores meet targets
    Tool: Bash
    Preconditions: Dev server running
    Steps:
      1. Run Lighthouse on landing page (desktop)
      2. Record Performance, Accessibility, Best Practices scores
      3. Run Lighthouse on /dashboard (desktop, authenticated)
      4. Record scores
    Expected Result: All scores ≥ 90
    Failure Indicators: Any score < 90
    Evidence: .sisyphus/evidence/task-32-lighthouse-final.txt

  Scenario: Bundle audit shows code-split chunks
    Tool: Bash
    Preconditions: Production build exists
    Steps:
      1. Run `pnpm build 2>&1 | grep -E "✓|⚡|▲"`
      2. Check Three.js is in separate chunk (not main bundle)
      3. Check recharts is in separate chunk
    Expected Result: Heavy libs code-split from main bundle
    Failure Indicators: Three.js in main bundle
    Evidence: .sisyphus/evidence/task-32-bundle-audit.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-32-lighthouse-final.txt`
  - [ ] `.sisyphus/evidence/task-32-bundle-audit.txt`

  **Commit**: YES (groups with Tasks 28-31)
  - Message: `perf(bundle): performance optimization and bundle size audit`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command, check evidence). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm build` + linter + `vitest run`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **1**: `test(setup): configure Vitest + RTL + Playwright for TDD workflow`
- **2**: `refactor(icons): replace material-symbols-outlined with lucide-react throughout`
- **3**: `feat(hooks): add useMediaQuery, useReducedMotion, useWebGL shared hooks`
- **4**: `feat(ui): add LoadingSkeleton, EmptyState, ErrorState, WebGLFallback components`
- **5**: `style(tokens): stabilize CSS variable mappings between VibeDNA and shadcn`
- **6**: `chore(perf): baseline Lighthouse measurement and performance report`
- **7**: `refactor(landing): split monolithic page.tsx into section components`
- **8**: `feat(landing): cinematic hero section redesign`
- **9**: `feat(landing): archetype cards showcase with hover effects`
- **10**: `feat(landing): galaxy preview section`
- **11**: `feat(landing): mobile navigation and responsive layout`
- **12**: `feat(landing): smooth scroll and entrance animations`
- **13**: `refactor(dashboard): split DashboardClient into section components`
- **14**: `feat(dashboard): personality engine hero redesign`
- **15**: `feat(dashboard): listening heatmap with 3AM sadness spikes style`
- **16**: `feat(dashboard): audio features radar chart redesign`
- **17**: `feat(dashboard): artist cards redesign`
- **18**: `feat(dashboard): AI insights sheet redesign`
- **19**: `feat(dashboard): loading, empty, and error states for all sections`
- **20**: `feat(galaxy): WebGL detection and graceful 2D canvas fallback`
- **21**: `feat(galaxy): bloom post-processing and particle trails`
- **22**: `feat(galaxy): click-to-focus on planets and artist info popup`
- **23**: `feat(galaxy): genre constellations and orbital navigation`
- **24**: `feat(galaxy): camera transitions and animated artist connections`
- **25**: `feat(share): shareable personality card with enhanced branding and export`
- **26**: `feat(compare): friend comparison lite with share URLs`
- **27**: `feat(timeline): listening timeline with genre evolution and emotional transitions`
- **28**: `feat(ui): micro-interactions and entrance animations across app`
- **29**: `fix(a11y): add prefers-reduced-motion support to all animations`
- **30**: `fix(a11y): accessibility pass — keyboard, ARIA labels, color contrast`
- **31**: `fix(responsive): mobile and tablet responsive verification pass`
- **32**: `perf(bundle): performance optimization and bundle size audit`
- **F1-F4**: `chore(finish): final verification, plan compliance, QA sign-off`

---

## Success Criteria

### Verification Commands
```bash
pnpm build  # Expected: Compiled successfully
pnpm lint   # Expected: 0 errors, 0 warnings
vitest run  # Expected: All tests pass
pnpm dev    # Expected: HTTP 200 on localhost:3000
npx playwright test  # Expected: All E2E scenarios pass
```

### Final Checklist
- [ ] All "Must Have" present and verified
- [ ] All "Must NOT Have" absent (no forbidden patterns)
- [ ] All Vitest tests pass
- [ ] All Playwright E2E scenarios pass
- [ ] Lighthouse 90+ Performance, 90+ Accessibility, 90+ Best Practices (desktop)
- [ ] All evidence files exist in .sisyphus/evidence/
- [ ] User has reviewed and approved final output
