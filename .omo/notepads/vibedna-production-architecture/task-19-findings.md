19: Icon standardization — material-symbols → lucide-react

- Files inspected and updated:
  - src/app/page.tsx
  - src/app/dashboard/DashboardClient.tsx
  - src/components/PersonalityCard.tsx
  - src/components/ListeningHeatmap.tsx
  - src/app/dashboard/loading.tsx

- Replacements made (kept semantics closest to original):
  - graphic_eq -> SlidersHorizontal
  - fingerprint -> Fingerprint
  - share -> Share2
  - explore/public -> Compass / Globe (used Globe for large hero)
  - auto_awesome -> SparklesIcon
  - insights -> BarChart2
  - stars -> Star
  - trending_up -> TrendingUp
  - history -> Clock
  - bolt -> Zap
  - architecture -> Layers

- Notes/decisions:
  - Replaced inline <span className="material-symbols-outlined"> usages with lucide-react components and preserved sizing via tailwind classes.
  - Did not add any new dependencies; lucide-react was already in use.
  - Avoided layout or behavior changes; only icon elements were swapped.

- Verification steps performed:
  1. lsp_diagnostics on changed files — no errors.
  2. pnpm build — succeeded (Next.js build completed).
  3. Repo search for "material-symbols-outlined" (excluding .next) — no remaining references in src.

- Remaining/related files:
  - The project plans (.sisyphus/plans/*.md) still contain mentions (intentional documentation) — these were not modified.

End of task 19 updates.
