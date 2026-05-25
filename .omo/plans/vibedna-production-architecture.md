# VibeDNA — Production-Grade Architecture Overhaul

## TL;DR

> **Quick Summary**: Transform VibeDNA from a simple "Frontend → Spotify API" hackathon app into a production-grade platform with multi-tier caching (Redis), async job processing (QStash), event-driven architecture, PostgreSQL with pgvector, precomputed analytics, AI pipeline optimization, and full observability — alongside a complete UI/UX restructure into a "Spotify Wrapped + Personality Engine + Social Identity Platform" experience.

> **Deliverables**:
> - **Infrastructure**: Upstash Redis (hot/warm caching), Neon PostgreSQL (cold storage + pgvector), QStash (async workers), Sentry (observability)
> - **Backend**: API Gateway layer with rate limiting, multi-tier cache strategy, event-driven architecture, async AI/analytics workers, incremental sync engine
> - **Analytics**: Precomputed materialized views, vector embeddings (pgvector), recommendation engine, structured AI pipeline
> - **UI**: Cinematic landing page, personality engine dashboard, "3AM sadness spikes" heatmap, enhanced 3D galaxy, shareable cards, friend comparison, listening timeline
> - **Production Polish**: Observability, feature flags, CDN optimization, rate limiting, accessibility, responsive

> **Estimated Effort**: XL (combined infra + UI — no deadline, build it right)
> **Parallel Execution**: YES — 6 waves with max parallelism
> **Free Tier Stack**: Vercel (Next.js) + Upstash Redis + Upstash QStash + Neon PostgreSQL + Sentry + Google Gemini API

---

## The Problem

Most hackathon projects build this:

```
Frontend → API → Spotify API
```

VibeDNA will build this:

```
Frontend (Next.js on Vercel)
   ↓
API Gateway (Next.js API Routes)
   ├── Rate Limiter (Redis sliding window)
   ├── Auth Guard (NextAuth session)
   └── Analytics Event (Sentry)
   ↓
┌──────────────────────────────────────────────────┐
│              Service Layer                        │
│  ├── Cache Service (Redis multi-tier)            │
│  ├── Spotify Service (proxied, rate-limited)      │
│  ├── Analytics Service (aggregation logic)        │
│  ├── Personality Service (asynced AI pipeline)    │
│  └── Event Service (typed event system)          │
└──────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────┐
│              Data Layer                           │
│  ├── Hot Cache: Upstash Redis (15min TTL)        │
│  ├── Warm Cache: Upstash Redis (24h TTL)         │
│  ├── Cold Store: Neon PostgreSQL (permanent)      │
│  ├── Embeddings: pgvector (cosine similarity)     │
│  └── Queue: QStash (durable async workers)       │
└──────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────┐
│              Worker Layer (QStash)                │
│  ├── Personality Worker (async Gemini AI)        │
│  ├── Analytics Worker (aggregation jobs)         │
│  ├── Embedding Worker (vector generation)        │
│  └── Card Worker (share image generation)        │
└──────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────┐
│              Observability (Sentry)               │
│  ├── Error Tracking                              │
│  ├── Performance Tracing (OpenTelemetry)         │
│  ├── Cache Hit Ratio Monitoring                  │
│  ├── Spotify API Latency Tracking                │
│  └── Custom Analytics Events                     │
└──────────────────────────────────────────────────┘
```

---

## Context

### Current State (Before)
- `src/lib/spotify.ts` — Direct Spotify API calls with basic Supabase caching
- `src/lib/auth.ts` — NextAuth Spotify provider
- `src/lib/gemini.ts` — Synchronous Gemini AI call on every dashboard load
- `src/app/dashboard/page.tsx` — Server component orchestrating everything synchronously
- No Redis, no queues, no event system, no proper data model, no observability
- UI is functional but not visually competitive (user explicitly rejected it)

### Target State (After)
- API Gateway proxies ALL external calls through rate-limited, cached internal routes
- 3-tier cache: Redis hot (15min) → Redis warm (24h) → PostgreSQL cold (permanent)
- Async workers: AI personality, analytics aggregation, embedding generation run via QStash
- Event-driven: USER_LOGIN → QUEUE_ANALYTICS → WORKER_PROCESSED → PERSONALITY_READY
- PostgreSQL with proper schema: users, tracks, listening_events, personality_snapshots, analytics
- pgvector for similarity search: friend matching, vibe clustering, recommendations
- Precomputed materialized views: instant dashboard loads, no live computation
- Sentry observability: errors, traces, cache hit ratio, API latency, AI cost tracking
- Fully restructured UI: cinematic landing, personality dashboard, galaxy, share cards

### Free Tier Strategy
| Service | Free Tier | Usage |
|---------|-----------|-------|
| Vercel | 100GB bandwidth, 6000 build mins | Hosting Next.js app |
| Upstash Redis | 10MB data, 30 req/s | Hot/warm cache, rate limiter |
| Upstash QStash | 10K requests/month | Async job queue |
| Neon PostgreSQL | 0.5GB storage, 100 hrs/month | Data warehouse, pgvector |
| Sentry | 5K events/month | Error tracking, traces |
| Google Gemini | 60 req/min (free) | AI personality analysis |
| Spotify API | Free (dev account) | Music data source |

---

## Work Objectives

### Core Objective
Transform VibeDNA into a production-grade "Spotify Wrapped + Personality Engine + Social Identity Platform" with proper infrastructure, async processing, intelligent caching, and observability — all deployed on free tier services.

### Concrete Deliverables
- **Infrastructure**: Redis cache layer, PostgreSQL schema, async worker system, Sentry observability
- **Backend**: API Gateway, multi-tier cache strategy, event system, rate limiter, incremental sync
- **Analytics**: Precomputed aggregates, materialized views, vector embeddings, recommendation engine
- **AI Pipeline**: Structured metrics preprocessing → compact prompt → async Gemini → cached results
- **UI**: Landing page redesign, dashboard overhaul, galaxy upgrade, shareable cards, friend comparison, listening timeline
- **Production**: Feature flags, rate limit tuning, CDN optimization, a11y, performance

### Must Have
- Multi-tier caching (Redis hot → Redis warm → PostgreSQL cold) operational
- Async AI personality generation via QStash workers
- API Gateway proxying all Spotify calls with rate limiting
- PostgreSQL schema with users, tracks, events, snapshots tables
- pgvector embeddings for similarity search
- Sentry error tracking + performance tracing
- Precomputed analytics: dashboard loads instantly (no live computation)
- All UI components from original restructure plan
- Full test suite (Vitest + Playwright)
- Zero paid services — everything on free tiers

### Must NOT Have (Guardrails)
- No paid services (no Stripe, no paid Redis, no paid Sentry)
- No real-time WebSocket connections (keep request-response for now)
- No user data sharing between users without explicit consent
- No modification to Spotify OAuth flow (keep NextAuth)
- No real historical listening data collection (simulate where API doesn't provide)
- No removal of existing functionality during migration (maintain backward compatibility)
- No over-engineering: benchmark before optimizing, don't build what isn't needed

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (being set up)
- **Automated tests**: TDD (tests first) for new code, integration tests for infra
- **Framework**: Vitest + React Testing Library + Playwright
- **Infra Testing**: QStash workers tested via mock HTTP endpoints, Redis tested via Upstash REST API

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{slug}.{ext}`.

- **Frontend/UI**: Playwright — Navigate, interact, assert, screenshot
- **API/Backend**: Bash (curl) — Send requests, assert status codes + response shapes
- **Infra**: Bash — Verify Redis keys exist, PostgreSQL rows present, QStash jobs queued
- **Library/Module**: Bash (bun repl) — Import, call functions, compare output

---

## Execution Strategy

### Architecture Overview

```
Free Tier Stack:
┌─────────────────────────────────────────────────────┐
│  Vercel (Next.js 16 + App Router)                    │
│  ├── Frontend: Pages + Components + Animations      │
│  ├── API Gateway: /api/spotify/* proxy routes       │
│  ├── API Gateway: /api/analytics/* aggregate routes │
│  └── API Gateway: /api/events/* ingestion routes    │
├─────────────────────────────────────────────────────┤
│  Upstash Redis (10MB free)                          │
│  ├── HOT cache: dashboard data (15min TTL)          │
│  ├── WARM cache: artist metadata (24h TTL)          │
│  ├── Rate limiter: sliding window counters          │
│  └── Session store: rate limit state                │
├─────────────────────────────────────────────────────┤
│  Upstash QStash (10K req/month free)                │
│  ├── Personality worker: async Gemini AI            │
│  ├── Analytics worker: aggregation jobs             │
│  ├── Embedding worker: pgvector updates             │
│  └── Card worker: share image render                │
├─────────────────────────────────────────────────────┤
│  Neon PostgreSQL (0.5GB free + pgvector)            │
│  ├── users: profile + subscription                  │
│  ├── tracks: metadata + audio_features              │
│  ├── listening_events: play history (simulated)     │
│  ├── personality_snapshots: AI results              │
│  ├── analytics: precomputed aggregates              │
│  ├── events: event log for observability            │
│  └── genre_vectors: pgvector embeddings             │
├─────────────────────────────────────────────────────┤
│  Sentry (5K events/month free)                      │
│  ├── Error tracking: uncaught exceptions            │
│  ├── Performance: API route tracing, component spans│
│  ├── Cache hit ratio dashboard                      │
│  └── Custom metrics: AI cost, API latency           │
└─────────────────────────────────────────────────────┘
```

### Parallel Execution Waves

```
Wave 1 (Infrastructure Foundation — MAX PARALLEL):
├── Task 1: Set up Upstash Redis + cache client library
├── Task 2: Set up Neon PostgreSQL + Drizzle ORM + run schema migrations
├── Task 3: Set up Sentry + OpenTelemetry
├── Task 4: Set up QStash + worker scaffolding
├── Task 5: Create core cache layer (multi-tier: hot/warm/cold)
├── Task 6: Create Redis rate limiter (sliding window)
├── Task 7: Create database schema (users, tracks, events, snapshots, analytics)
└── Task 8: Test infrastructure (Vitest + RTL + Playwright)

Wave 2 (Backend Architecture — after Wave 1):
├── Task 9: API Gateway — Spotify proxy routes with rate limiting + caching
├── Task 10: Event system — typed events (USER_CONNECTED, SYNC_COMPLETED, PERSONALITY_GENERATED, etc.)
├── Task 11: Async workers — Personality, Analytics, Embedding (via QStash)
├── Task 12: Incremental sync — delta sync engine for Spotify data
├── Task 13: Refactor data layer — migrate from Supabase cache to Redis + PostgreSQL
└── Task 14: Observability dashboards — Sentry custom metrics + cache hit ratio

Wave 3 (Analytics & AI Pipeline — after Wave 1):
├── Task 15: AI pipeline optimization — structured metrics → compact prompt → fingerprint
├── Task 16: Precomputed analytics — materialized views + nightly aggregation workers
├── Task 17: Vector embeddings — pgvector setup + genre/profile embeddings
├── Task 18: Recommendation engine — cosine similarity, vibe matching, music twins
└── Task 19: Icon standardization (material-symbols → lucide-react)

Wave 4 (UI/UX Restructure — after Wave 2):
├── Task 20: Shared hooks + utility components (useMediaQuery, useReducedMotion, useWebGL, LoadingSkeleton, EmptyState, ErrorState)
├── Task 21: Landing page section split + redesign (hero, archetype cards, galaxy preview, nav, animations)
├── Task 22: Dashboard section split + redesign (personality hero, heatmap, radar, artist cards, AI sheet, states)
├── Task 23: Galaxy enhancement (bloom, constellations, click-to-focus, orbital nav, camera transitions)
├── Task 24: Shareable personality card (enhanced export with branding)
├── Task 25: Friend comparison (lite — powered by pgvector similarity)
└── Task 26: Listening timeline (genre evolution + emotional transitions)

Wave 5 (Production — after ALL):
├── Task 27: Feature flags (Redis-backed toggle system)
├── Task 28: CDN + image optimization (Vercel Edge, lazy loading, preconnect)
├── Task 29: Performance optimization (Lighthouse 90+, bundle audit)
├── Task 30: Accessibility pass (keyboard, ARIA, color contrast)
└── Task 31: Responsive design pass (mobile + tablet verification)

Critical Path: Tasks 1→5→6→7 → Tasks 9→10→11→12→13→14 → Tasks 21→26 → Tasks 27→31 → F1→F4
```

---

## TODOs

- [x] 1. Set up Upstash Redis + cache client library

  **What to do**:
  - Sign up for Upstash Redis (free tier: 10MB, 30 req/s, 1 database)
  - Create a Redis database in Upstash console
  - Install `@upstash/redis` package
  - Create `src/lib/cache/redis.ts`:
    - Initialize `Redis` client from `@upstash/redis` using env vars (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)
    - Export typed `cache` object with `get`, `set`, `del`, `exists`, `keys` methods
    - Add error handling: if Redis is unavailable, log warning and return null (graceful degradation)
  - Create `src/lib/cache/index.ts` barrel export
  - Create `src/lib/cache/keys.ts` with key conventions:
    - `user:{id}:top-artists` — Top artists per user
    - `user:{id}:personality` — Cached personality result
    - `artist:{id}:metadata` — Artist metadata
    - `track:{id}:features` — Audio features
    - `rate-limit:{route}:{ip}` — Rate limit counters
  - Write test: Redis client initializes with env vars, key functions return expected formats
  - Verify: `pnpm build` compiles, env vars load correctly

  **Must NOT do**:
  - Do NOT hardcode Redis credentials (must use environment variables)
  - Do NOT use `ioRedis` or `node-redis` (incompatible with Vercel serverless)
  - Do NOT add Redis to the critical path (app must work without it, just slower)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward client setup + configuration. Library install, env vars, client init.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5, 6, 7, 8)
  - **Blocks**: Tasks 5, 6, 9, 27
  - **Blocked By**: None

  **References**:
  - Upstash Redis REST API docs: `https://upstash.com/docs/redis/sdks/ts/overview`
  - `src/lib/supabase.ts` — Reference existing client pattern for new infra clients
  - `.env.example` (NEED TO CREATE — add `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)

  **Acceptance Criteria**:
  - [ ] `@upstash/redis` installed in package.json
  - [ ] `src/lib/cache/redis.ts` with Redis client initialization
  - [ ] `src/lib/cache/keys.ts` with all key conventions
  - [ ] `src/lib/cache/index.ts` barrel export
  - [ ] `pnpm build` passes
  - [ ] Upstash Redis database created in console (verify with curl or upstash CLI)

  **QA Scenarios**:
  ```
  Scenario: Redis client initializes and can connect
    Tool: Bash (bun repl)
    Preconditions: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars set
    Steps:
      1. Import Redis client: `const { cache } = await import("@/lib/cache")`
      2. Run `cache.set("test:ping", "pong", { ex: 60 })`
      3. Run `const result = cache.get("test:ping")`
      4. Assert result === "pong"
      5. Run `cache.del("test:ping")`
    Expected Result: SET → GET returns value → DEL succeeds
    Failure Indicators: Connection error, timeout, authentication failed
    Evidence: .sisyphus/evidence/task-1-redis-ping.txt

  Scenario: Key conventions return expected formats
    Tool: Bash (vitest)
    Preconditions: cache/keys.ts created
    Steps:
      1. Run `pnpm vitest run src/lib/cache/keys.test.ts --reporter=verbose`
    Expected Result: Key functions return correct strings
    Failure Indicators: Test failures
    Evidence: .sisyphus/evidence/task-1-key-conventions.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-1-redis-ping.txt`
  - [ ] `.sisyphus/evidence/task-1-key-conventions.txt`

  **Commit**: YES (groups with Tasks 5, 6)
  - Message: `infra(redis): set up Upstash Redis + multi-tier cache layer`

- [x] 2. Set up Neon PostgreSQL + Drizzle ORM + schema migrations

  **What to do**:
  - Sign up for Neon PostgreSQL (free tier: 0.5GB, 100 hrs/month, pgvector enabled)
  - Create a Neon project and database
  - Install dependencies:
    - `drizzle-orm` — TypeScript ORM
    - `@neondatabase/serverless` — Serverless PostgreSQL driver
    - `drizzle-kit` — Schema migrations CLI
    - `pg` — Peer dependency for Drizzle
  - Create `src/lib/db/index.ts`:
    - Initialize Neon client with `DATABASE_URL` env var
    - Export `db` Drizzle instance and `sql` tagged template
  - Create `src/lib/db/schema.ts` with Drizzle schema:
    - `users` table: `id` (serial PK), `spotify_id` (text unique), `display_name`, `country`, `subscription_type`, `created_at`
    - `tracks` table: `id` (serial PK), `spotify_track_id` (text unique), `name`, `artists`, `popularity`, `energy`, `valence`, `danceability`, `acousticness`, `instrumentalness`, `tempo`
    - `listening_events` table: `id` (serial PK), `user_id` (FK→users), `track_id` (FK→tracks), `played_at`, `duration_ms`
    - `personality_snapshots` table: `id` (serial PK), `user_id` (FK→users), `archetype`, `secondary_trait`, `listening_aura`, `summary`, `chaos_index`, `mood_score`, `night_owl_score`, `created_at`
    - `analytics` table: `id` (serial PK), `user_id` (FK→users), `snapshot_date`, `top_genres` (jsonb), `mood_averages` (jsonb), `listening_hours_distribution` (jsonb)
    - `events` table: `id` (serial PK), `event_type`, `user_id`, `metadata` (jsonb), `created_at`
    - `genre_vectors` table: `id` (serial PK), `user_id` (FK→users), `genre`, `embedding` (vector(128)), `created_at`
  - Create `drizzle.config.ts` with schema path, output path, connection string
  - Run `drizzle-kit push` to apply schema to Neon database
  - Write test: db client initializes, schema tables exist
  - Add `DATABASE_URL` to `.env.example`

  **Must NOT do**:
  - Do NOT use Prisma (Drizzle is lighter, better for serverless, supports pgvector natively)
  - Do NOT store raw Spotify API responses in DB (extract what we need)
  - Do NOT make DB calls on the critical path (use cache → DB fallback)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex setup — multiple tables, relations, Drizzle config, migration pipeline.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5, 6, 7, 8)
  - **Blocks**: Tasks 7, 9, 10, 11, 12, 13, 15, 16, 17, 18, 25
  - **Blocked By**: None

  **References**:
  - `src/lib/supabase.ts` — Existing DB client pattern (will be supplemented, not replaced)
  - Drizzle ORM docs: `https://orm.drizzle.team/docs/overview`
  - Neon serverless driver: `https://neon.tech/docs/serverless/serverless-driver`

  **Acceptance Criteria**:
  - [ ] All packages installed: `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`
  - [ ] `src/lib/db/schema.ts` created with all 7 tables
  - [ ] `src/lib/db/index.ts` with Neon + Drizzle client
  - [ ] `drizzle.config.ts` created
  - [ ] Schema pushed to Neon database successfully
  - [ ] `pnpm build` passes
  - [ ] `vitest run` passes (DB client test)

  **QA Scenarios**:
  ```
  Scenario: Database schema applied successfully
    Tool: Bash (psql or curl to Neon)
    Preconditions: DATABASE_URL env var set
    Steps:
      1. Import db client: `const { db, sql } = await import("@/lib/db")`
      2. Run `const tables = await sql\`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'\``
      3. Check all 7 tables exist: users, tracks, listening_events, personality_snapshots, analytics, events, genre_vectors
    Expected Result: All 7 tables present
    Failure Indicators: Missing tables, connection error
    Evidence: .sisyphus/evidence/task-2-schema-verify.txt

  Scenario: Drizzle ORM can query
    Tool: Bash (bun repl)
    Preconditions: DB schema applied
    Steps:
      1. Import `{ db }` from `@/lib/db`
      2. Run `const result = await db.select().from(users).limit(1)`
      3. Assert empty array returned (no users yet, but query works)
    Expected Result: Query executes without error
    Failure Indicators: SQL error, connection timeout
    Evidence: .sisyphus/evidence/task-2-drizzle-query.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-2-schema-verify.txt`
  - [ ] `.sisyphus/evidence/task-2-drizzle-query.txt`

  **Commit**: YES (groups with Task 7)
  - Message: `infra(db): set up Neon PostgreSQL + Drizzle ORM + schema migration`

- [x] 3. Set up Sentry + OpenTelemetry

  **What to do**:
  - Sign up for Sentry (free tier: 5K events/month)
  - Create a Sentry project for Next.js
  - Install dependencies:
    - `@sentry/nextjs` — Sentry SDK for Next.js
    - `@opentelemetry/api` — OpenTelemetry API
  - Create `sentry.client.config.ts`:
    - Initialize `Sentry.init()` with DSN, environment, tracesSampleRate: 0.25
    - Configure `beforeSend` to filter out non-actionable errors
  - Create `sentry.server.config.ts`:
    - Initialize `Sentry.init()` for server-side
  - Create `sentry.edge.config.ts`:
    - Initialize `Sentry.init()` for edge runtime
  - Create `src/lib/observability/metrics.ts`:
    - Export helper functions for custom metrics:
      - `trackCacheHit(cacheKey)` — Log cache hit ratio
      - `trackCacheMiss(cacheKey)` — Log cache miss
      - `trackSpotifyLatency(durationMs, endpoint)` — Track API latency
      - `trackAiCost(model, tokenCount, durationMs)` — Track AI usage
      - `trackEvent(eventType, metadata)` — Track business events
    - Use Sentry's `addBreadcrumb` and custom metrics APIs
  - Create `src/lib/observability/index.ts` barrel export
  - Add env vars: `SENTRY_DSN`, `SENTRY_ENVIRONMENT`
  - Run `npx sentry/wizard` to set up source maps
  - Write test: metrics functions don't throw, Sentry initializes

  **Must NOT do**:
  - Do NOT enable Sentry in development mode (use environment gating)
  - Do NOT send PII (personally identifiable information) as Sentry tags
  - Do NOT set `tracesSampleRate` above 0.25 (stays within free tier)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard SDK setup with configuration. Follow Sentry docs.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5, 6, 7, 8)
  - **Blocks**: Task 14 (observability dashboards)
  - **Blocked By**: None

  **References**:
  - Sentry Next.js SDK docs: `https://docs.sentry.io/platforms/javascript/guides/nextjs/`
  - OpenTelemetry: `https://opentelemetry.io/docs/instrumentation/js/`

  **Acceptance Criteria**:
  - [ ] `@sentry/nextjs` and `@opentelemetry/api` installed
  - [ ] `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` created
  - [ ] `src/lib/observability/metrics.ts` with all helper functions
  - [ ] `pnpm build` passes
  - [ ] Sentry dashboard shows first events (verify with test error)

  **QA Scenarios**:
  ```
  Scenario: Sentry captures a test error
    Tool: Bash (curl)
    Preconditions: SENTRY_DSN and SENTRY_ENVIRONMENT env vars set
    Steps:
      1. Create temporary test route that throws an error
      2. Hit the route with curl
      3. Check Sentry dashboard for captured error event
      4. Remove test route
    Expected Result: Error appears in Sentry dashboard
    Failure Indicators: No event captured, 401 from Sentry
    Evidence: .sisyphus/evidence/task-3-sentry-capture.txt

  Scenario: Custom metrics track without error
    Tool: Bash (vitest)
    Preconditions: metrics.ts created
    Steps:
      1. Run `pnpm vitest run src/lib/observability/metrics.test.ts --reporter=verbose`
      2. Check all metric tests pass
    Expected Result: All metric functions call successfully
    Failure Indicators: Test failures
    Evidence: .sisyphus/evidence/task-3-metrics-test.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-3-sentry-capture.txt`
  - [ ] `.sisyphus/evidence/task-3-metrics-test.txt`

  **Commit**: YES (groups with Task 14)
  - Message: `infra(monitoring): set up Sentry + OpenTelemetry`

- [x] 4. Set up QStash + async worker scaffolding

  **What to do**:
  - Sign up for Upstash QStash (free tier: 10K requests/month) — uses same account as Redis
  - Install `@upstash/qstash` package
  - Create `src/lib/queue/index.ts`:
    - Initialize `Client` from `@upstash/qstash` using `QSTASH_TOKEN` env var
    - Export `queue` object with `enqueue`, `schedule`, `cancel` methods
    - All methods are REST-based (works with Vercel serverless)
  - Create `src/lib/queue/workers.ts` with worker URL definitions:
    - `PERSONALITY_WORKER` = `${API_BASE}/api/workers/personality` — Async AI generation
    - `ANALYTICS_WORKER` = `${API_BASE}/api/workers/analytics` — Data aggregation
    - `EMBEDDING_WORKER` = `${API_BASE}/api/workers/embedding` — Vector generation
    - `CARD_WORKER` = `${API_BASE}/api/workers/card` — Share card rendering
  - Create `src/app/api/workers/personality/route.ts`:
    - POST handler receiving `userId` and `topArtists` data
    - Calls Gemini AI asynchronously
    - Stores result in Redis cache + PostgreSQL
    - Returns 200 with personality ID
  - Create `src/app/api/workers/analytics/route.ts`:
    - POST handler receiving `userId`
    - Computes aggregates: top genres, mood averages, listening patterns
    - Stores in `analytics` table + materialized view refresh trigger
    - Returns 200
  - Create `src/app/api/workers/embedding/route.ts`:
    - POST handler receiving `userId`
    - Generates genre/profile embeddings
    - Stores in `genre_vectors` table
    - Returns 200
  - Create `src/app/api/workers/card/route.ts`:
    - POST handler receiving `userId` + `cardType`
    - Generates share card image
    - Stores in Redis cache (or returns signed URL)
    - Returns 200 with card URL
  - Add `QSTASH_TOKEN` and `QSTASH_CURRENT_SIGNING_KEY` + `QSTASH_NEXT_SIGNING_KEY` to `.env.example`
  - Write test: queue client initializes, worker routes return 200

  **Must NOT do**:
  - Do NOT use BullMQ (requires TCP Redis, incompatible with Upstash HTTP Redis)
  - Do NOT make workers synchronous (they're async by design — return immediately, process in background)
  - Do NOT expose worker routes publicly (they're called by QStash, should verify signature)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multiple worker route definitions, QStash integration, async processing pattern.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5, 6, 7, 8)
  - **Blocks**: Tasks 11, 12, 15, 16, 17
  - **Blocked By**: None

  **References**:
  - QStash docs: `https://upstash.com/docs/qstash/overview`
  - Vercel serverless functions — Must handle streaming correctly (use `waitUntil` for background)

  **Acceptance Criteria**:
  - [ ] `@upstash/qstash` installed
  - [ ] `src/lib/queue/index.ts` with client
  - [ ] `src/lib/queue/workers.ts` with all 4 worker URL definitions
  - [ ] 4 worker routes created under `src/app/api/workers/`
  - [ ] QStash signature verification on worker routes
  - [ ] `pnpm build` passes
  - [ ] `vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: QStash client initializes
    Tool: Bash (bun repl)
    Preconditions: QSTASH_TOKEN env var set
    Steps:
      1. Import `const { queue } = await import("@/lib/queue")`
      2. Run `console.log(typeof queue.enqueue)`
      3. Assert queue.enqueue is a function
    Expected Result: Queue client initialized without error
    Failure Indicators: Import error, missing env vars
    Evidence: .sisyphus/evidence/task-4-qstash-client.txt

  Scenario: Worker routes return 200 on POST
    Tool: Bash (curl)
    Preconditions: Dev server running, QStash token configured
    Steps:
      1. POST to `/api/workers/personality` with `{ "userId": "test-1" }`
      2. Check response status 200
      3. POST to `/api/workers/analytics` with `{ "userId": "test-1" }`
      4. Check response status 200
    Expected Result: All worker routes accept and return 200
    Failure Indicators: 404, 500, unauthorized
    Evidence: .sisyphus/evidence/task-4-worker-routes.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-4-qstash-client.txt`
  - [ ] `.sisyphus/evidence/task-4-worker-routes.txt`

  **Commit**: YES (groups with Task 11)
  - Message: `infra(queue): set up QStash + async worker scaffolding`

- [x] 5. Create core cache layer (multi-tier: hot/warm/cold)

  **What to do**:
  - Create `src/lib/cache/strategy.ts` with multi-tier caching:
    - `getMultiTiered(key, { hotTTL, warmTTL, fetcher, coldStorage })`:
      - **Hot tier** (Redis, 15min TTL): Check Redis first
        - HIT → return data immediately
        - MISS → fall through to warm
      - **Warm tier** (Redis, 24h TTL): Same Redis, longer-lived keys
        - HIT → return data, background refresh to hot tier
        - MISS → fall through to cold
      - **Cold tier** (PostgreSQL): Query from DB
        - HIT → return data, backfill to warm and hot tiers
        - MISS → call `fetcher()`, store in all tiers
    - `invalidateCache(key)` — Remove key from all cache tiers
    - `invalidateUserCache(userId)` — Remove all cache entries for a user
  - Create `src/lib/cache/warmup.ts`:
    - `warmUserCache(userId)` — Pre-fill cache for a user after login
    - Called after each Spotify sync to proactively cache data
  - Wire custom metrics (Task 3): `trackCacheHit`, `trackCacheMiss` called on each tier access
  - Write comprehensive tests:
    - Cache hit path returns data immediately
    - Cache miss path calls fetcher
    - Backfill propagates correctly between tiers
    - Invalidation removes all entries
    - Metrics are tracked

  **Must NOT do**:
  - Do NOT cache auth tokens or session data (those are ephemeral)
  - Do NOT cache data longer than cold TTL (permanent is via DB, not cache)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex caching strategy design — multi-tier fallthrough, background refresh, metrics integration.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 6, 7, 8)
  - **Blocks**: Tasks 9, 13, 14
  - **Blocked By**: Task 1 (Redis client), Task 3 (metrics)

  **References**:
  - `src/lib/cache/redis.ts` — Redis client (Task 1)
  - `src/lib/observability/metrics.ts` — Metrics tracking (Task 3)
  - Cache-aside pattern: `https://docs.redis.com/latest/rs/references/client_references/client_ioredis/#cache-aside`

  **Acceptance Criteria**:
  - [ ] `src/lib/cache/strategy.ts` with `getMultiTiered`, `invalidateCache`, `invalidateUserCache`
  - [ ] `src/lib/cache/warmup.ts` with `warmUserCache`
  - [ ] Cache metrics integrated
  - [ ] `vitest run` passes (all cache strategy tests)
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Cache hit returns data without calling fetcher
    Tool: Bash (vitest)
    Preconditions: Strategy tests created
    Steps:
      1. Run `pnpm vitest run src/lib/cache/strategy.test.ts --reporter=verbose -t "cache hit"`
      2. Check fetcher was NOT called on hit
    Expected Result: Cache hit returns data, no fetcher call
    Failure Indicators: Fetcher called on hit
    Evidence: .sisyphus/evidence/task-5-cache-hit.txt

  Scenario: Cache miss calls fetcher and stores result
    Tool: Bash (vitest)
    Preconditions: Strategy tests created
    Steps:
      1. Run `pnpm vitest run src/lib/cache/strategy.test.ts --reporter=verbose -t "cache miss"`
      2. Check fetcher WAS called and data stored
    Expected Result: Cache miss → fetcher → store in tiers
    Failure Indicators: Fetcher not called or data not stored
    Evidence: .sisyphus/evidence/task-5-cache-miss.txt

  Scenario: Invalidation removes all tiers
    Tool: Bash (vitest)
    Preconditions: Strategy tests created
    Steps:
      1. Run `pnpm vitest run src/lib/cache/strategy.test.ts --reporter=verbose -t "invalidate"`
      2. Check all cache tiers empty for that key
    Expected Result: All cache entries for key removed
    Failure Indicators: Data still cached after invalidation
    Evidence: .sisyphus/evidence/task-5-cache-invalidate.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-5-cache-hit.txt`
  - [ ] `.sisyphus/evidence/task-5-cache-miss.txt`
  - [ ] `.sisyphus/evidence/task-5-cache-invalidate.txt`

  **Commit**: YES (groups with Task 1)
  - Message: `feat(cache): multi-tier cache strategy (hot/warm/cold)`

- [x] 6. Create Redis rate limiter (sliding window)

  **What to do**:
  - Create `src/lib/middleware/rate-limiter.ts`:
    - `slidingWindowRateLimit({ key, limit, windowMs })`:
      - Uses Redis sorted set to track request timestamps
      - Remove timestamps outside current window
      - Count remaining timestamps
      - If count > limit → return `{ allowed: false, retryAfter }`
      - Else → add timestamp, return `{ allowed: true, remaining }`
    - Expose presets:
      - `spotifyApiLimiter` — 10 requests per 60 seconds (per user)
      - `aiPersonalityLimiter` — 1 request per 300 seconds (per user)
      - `generalApiLimiter` — 30 requests per 60 seconds (per IP)
  - Apply to API routes using a `withRateLimit` wrapper:
    - `withRateLimit(handler, limiter)` — Wrap API route handlers
  - Create `src/app/api/spotify/` route (fleshed out in Task 9) with rate limiting applied
  - Write tests:
    - Under limit: request allowed
    - At limit: request blocked
    - Window resets correctly after timeout
    - Different keys don't interfere

  **Must NOT do**:
  - Do NOT use in-memory rate limiting (not shared across Vercel serverless instances)
  - Do NOT apply rate limiting to webhook endpoints (like QStash callbacks)
  - Do NOT rate-limit the auth callback

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Algorithmic — sliding window implementation. Well-documented pattern.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 5, 7, 8)
  - **Blocks**: Tasks 9, 10
  - **Blocked By**: Task 1 (Redis client)

  **References**:
  - `src/lib/cache/redis.ts` — Redis client (Task 1)
  - Sliding window algorithm: `https://redis.com/glossary/rate-limiting/`

  **Acceptance Criteria**:
  - [ ] `src/lib/middleware/rate-limiter.ts` created
  - [ ] `withRateLimit` wrapper created and tested
  - [ ] Preset limiters defined (spotify, ai, general)
  - [ ] `vitest run` passes (all rate limiter tests)
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Under limit — requests allowed
    Tool: Bash (vitest)
    Preconditions: Rate limiter tests created
    Steps:
      1. Run `pnpm vitest run src/lib/middleware/rate-limiter.test.ts --reporter=verbose -t "under limit"`
      2. Check allowed = true for requests within limit
    Expected Result: Requests pass rate limit
    Failure Indicators: Requests blocked when under limit
    Evidence: .sisyphus/evidence/task-6-rate-under-limit.txt

  Scenario: At limit — requests blocked
    Tool: Bash (vitest)
    Preconditions: Rate limiter tests created
    Steps:
      1. Run `pnpm vitest run src/lib/middleware/rate-limiter.test.ts --reporter=verbose -t "over limit"`
      2. Check allowed = false, retryAfter > 0
    Expected Result: Requests blocked with retry-after
    Failure Indicators: Requests allowed past limit
    Evidence: .sisyphus/evidence/task-6-rate-over-limit.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-6-rate-under-limit.txt`
  - [ ] `.sisyphus/evidence/task-6-rate-over-limit.txt`

  **Commit**: YES (groups with Task 1)
  - Message: `feat(rate-limit): Redis sliding window rate limiter`

- [x] 7. Create database schema — users, tracks, events, snapshots

  **What to do**:
  - Flesh out `src/lib/db/schema.ts` (from Task 2) with full Drizzle schema:
    - All 7 tables with proper types, relations, indexes
    - `users` — with unique index on `spotify_id`
    - `tracks` — with unique index on `spotify_track_id`, indexes on `popularity`, `energy`
    - `listening_events` — with composite index on `(user_id, played_at)`
    - `personality_snapshots` — with index on `(user_id, created_at DESC)`
    - `analytics` — with index on `(user_id, snapshot_date DESC)`
    - `events` — with index on `(user_id, created_at DESC)`, `event_type`
    - `genre_vectors` — with index on `(user_id, genre)`, vector index for pgvector
  - Create `src/lib/db/queries.ts` with typed query functions:
    - `getUserBySpotifyId(spotifyId)` — Find or create user
    - `getLatestPersonality(userId)` — Get most recent personality snapshot
    - `getTrackById(spotifyTrackId)` — Get track with audio features
    - `upsertTrack(trackData)` — Insert or update track
    - `logEvent(eventType, userId, metadata)` — Insert event log entry
    - `getAnalytics(userId, dateRange)` — Get precomputed analytics
    - `storePersonality(userId, personality)` — Insert personality snapshot
  - Create `src/lib/db/migrate.ts` — Migration runner script
  - Run migration to apply schema to Neon
  - Write tests:
    - All query functions work with actual DB (integration test)
    - Indexes improve query performance

  **Must NOT do**:
  - Do NOT delete existing Supabase tables (maintain backward compatibility)
  - Do NOT store sensitive data (only what's needed for analytics/personality)
  - Do NOT make DB calls in the critical render path

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex schema design — 7 tables with relations, indexes, vector extension.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 5, 6, 8)
  - **Blocks**: Tasks 9, 10, 11, 12, 13, 15, 16, 17, 18, 25
  - **Blocked By**: Task 2 (Neon + Drizzle setup)

  **References**:
  - `src/lib/db/schema.ts` — Created in Task 2 (base)
  - Drizzle relations: `https://orm.drizzle.team/docs/rqb`
  - pgvector: `https://github.com/pgvector/pgvector`

  **Acceptance Criteria**:
  - [ ] `src/lib/db/schema.ts` complete with all 7 tables + relations + indexes
  - [ ] `src/lib/db/queries.ts` with all typed query functions
  - [ ] `src/lib/db/migrate.ts` migration runner
  - [ ] Migration applied to Neon DB successfully
  - [ ] `vitest run` passes (all DB integration tests)
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: All tables created with correct columns
    Tool: Bash (bun repl)
    Preconditions: Schema applied to Neon
    Steps:
      1. Import `const { db, sql } = await import("@/lib/db")`
      2. Run `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'`
      3. Check all expected columns present
      4. Repeat for tracks, listening_events, personality_snapshots, analytics, events, genre_vectors
    Expected Result: All tables have correct columns
    Failure Indicators: Missing columns, wrong types
    Evidence: .sisyphus/evidence/task-7-schema-columns.txt

  Scenario: Query functions work with actual DB
    Tool: Bash (vitest)
    Preconditions: DB connection works
    Steps:
      1. Run `pnpm vitest run src/lib/db/queries.test.ts --reporter=verbose`
    Expected Result: All query tests pass
    Failure Indicators: Timeout, schema error, wrong results
    Evidence: .sisyphus/evidence/task-7-queries.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-7-schema-columns.txt`
  - [ ] `.sisyphus/evidence/task-7-queries.txt`

  **Commit**: YES (groups with Task 2)
  - Message: `feat(db): database schema — users, tracks, events, snapshots`

- [x] 8. Test infrastructure (Vitest + RTL + Playwright)

  **What to do**:
  - Same as Task 1 from the original UI plan:
  - Install Vitest, @testing-library/react, @testing-library/jest-dom, @vitejs/plugin-react, jsdom
  - Install Playwright + @playwright/test + npx playwright install (chromium)
  - Create `vitest.config.ts` with react plugin, jsdom environment, path alias (@/ → src/)
  - Create `src/test/test-utils.tsx` with custom render wrapper (Providers, TooltipProvider, SessionProvider mock)
  - Create `src/test/setup.ts` with jest-dom matchers, vitest global mocks
  - Add test scripts to package.json: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:e2e": "playwright test"`
  - Create `playwright.config.ts` with baseURL, webServer config
  - Write smoke test: renders a button and asserts it exists
  - Run `vitest run` — must pass

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard config setup.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 1 (with all Wave 1 tasks)
  - **Blocks**: Tasks 20, 21, 22, 24, 25, 26, 28, 30, 31 (all TDD tasks)
  - **Blocked By**: None

  **References**:
  - `src/components/ui/button.tsx` — First smoke test target
  - `components.json` — Confirm `@/` alias

  **Acceptance Criteria**:
  - [ ] vitest.config.ts, test-utils.tsx, setup.ts created
  - [ ] playwright.config.ts created
  - [ ] `pnpm vitest run` → PASS
  - [ ] `npx playwright install --with-deps chromium` → success

  **QA Scenarios**:
  ```
  Scenario: Vitest smoke test passes
    Tool: Bash
    Preconditions: Config files exist
    Steps:
      1. Run `pnpm vitest run --reporter=verbose`
      2. Check "PASS" or "Tests 1 passed"
    Expected Result: Exit code 0
    Failure Indicators: Exit code non-zero
    Evidence: .sisyphus/evidence/task-8-vitest-smoke.txt

  Scenario: Playwright installs
    Tool: Bash
    Steps:
      1. Run `npx playwright install --with-deps chromium 2>&1 | tail -5`
    Expected Result: Chromium installed
    Failure Indicators: Installation errors
    Evidence: .sisyphus/evidence/task-8-playwright-install.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-8-vitest-smoke.txt`
  - [ ] `.sisyphus/evidence/task-8-playwright-install.txt`

  **Commit**: YES
  - Message: `test(setup): Vitest + React Testing Library + Playwright`

- [x] 9. API Gateway — Spotify proxy routes with rate limiting + caching

  **What to do**:
  - Create `src/app/api/spotify/top-artists/route.ts`:
    - GET handler
    - Verifies NextAuth session (getServerSession)
    - Applies `withRateLimit(handler, spotifyApiLimiter)` (from Task 6)
    - Uses `getMultiTiered()` from Task 5 to wrap Spotify API calls
    - On cache MISS: calls `fetchFromSpotify('/me/top/artists')`, stores in cache + DB
    - On cache HIT: returns cached data
    - Tracks metrics: `trackSpotifyLatency`, `trackCacheHit/Miss`
    - Returns `{ items: Artist[], source: 'hot'|'warm'|'cold'|'live' }`
  - Create `src/app/api/spotify/top-tracks/route.ts`:
    - Same pattern as above, endpoint: `/me/top/tracks`
  - Create `src/app/api/spotify/audio-features/route.ts`:
    - Accepts `trackIds` as query param or POST body
    - Batch fetches from Spotify or retrieves from cache
    - Audio features cached per-track (long TTL since they rarely change)
  - Create `src/app/api/spotify/recently-played/route.ts`:
    - GET handler, endpoint: `/me/player/recently-played`
    - Caches with short TTL (5min) since data changes frequently
  - Create `src/app/api/spotify/me/route.ts`:
    - GET handler, endpoint: `/me` (user profile)
    - Caches with 24h TTL
  - Create `src/lib/api-gateway/index.ts`:
    - `createSpotifyHandler(endpoint, options)` — Factory to reduce boilerplate
    - Options: `{ cacheTTL, rateLimitPreset, trackMetrics, transformResponse }`
  - Create `src/lib/api-gateway/spotify-fetcher.ts`:
    - Low-level Spotify API client with token refresh, retry, fallback
    - Handles 429 (rate limit) with exponential backoff
    - Returns stale cache on 5xx errors (fail open, not fail closed)
  - Write integration tests:
    - All proxy routes return 200 with valid JSON
    - Rate limiting blocks excessive requests
    - Cache headers set correctly
    - Metrics tracked on each request

  **Must NOT do**:
  - Do NOT expose Spotify access tokens to the client
  - Do NOT bypass rate limiting (even for authenticated users)
  - Do NOT cache failed responses (only cache successful ones)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multiple API route handlers with consistent patterns, rate limiting, caching, metrics.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 2 (with Tasks 10, 11, 12, 13, 14)
  - **Blocks**: Task 13 (data layer refactor), Task 21 (dashboard needs API)
  - **Blocked By**: Tasks 1 (Redis), 5 (cache strategy), 6 (rate limiter), 7 (DB schema)

  **References**:
  - `src/lib/spotify.ts` — Existing Spotify fetcher to refactor
  - `src/lib/cache/strategy.ts` — Multi-tier cache (Task 5)
  - `src/lib/middleware/rate-limiter.ts` — Rate limiter (Task 6)
  - `src/lib/observability/metrics.ts` — Metrics (Task 3)

  **Acceptance Criteria**:
  - [ ] 5 Spotify proxy routes created (top-artists, top-tracks, audio-features, recently-played, me)
  - [ ] `src/lib/api-gateway/index.ts` with `createSpotifyHandler` factory
  - [ ] `src/lib/api-gateway/spotify-fetcher.ts` with retry + backoff
  - [ ] All routes apply rate limiting + caching + metrics
  - [ ] `vitest run` passes (all integration tests)
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: API Gateway returns cached top artists
    Tool: Bash (curl)
    Preconditions: Dev server running, valid session cookie (or mock)
    Steps:
      1. GET http://localhost:3000/api/spotify/top-artists?timeRange=long_term
      2. Check response status 200
      3. Check response has `items` array and `source` field
      4. Check `source` is one of: hot, warm, cold, live
    Expected Result: 200 with valid items array
    Failure Indicators: 401, 500, missing items
    Evidence: .sisyphus/evidence/task-9-gateway-top-artists.txt

  Scenario: Rate limiting blocks excessive requests
    Tool: Bash (curl loop)
    Preconditions: Rate limiter configured
    Steps:
      1. Send 11 rapid requests to same endpoint (limit is 10/min)
      2. Check 11th response returns 429
    Expected Result: Rate limited after 10 requests
    Failure Indicators: Never limited, or limited too early
    Evidence: .sisyphus/evidence/task-9-rate-limit-429.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-9-gateway-top-artists.txt`
  - [ ] `.sisyphus/evidence/task-9-rate-limit-429.txt`

  **Commit**: YES
  - Message: `feat(gateway): API Gateway — Spotify proxy routes with rate limiting + caching`

- [x] 10. Event system — typed events

  **What to do**:
  - Create `src/lib/events/types.ts` with typed event definitions:
    ```typescript
    type VibeDNASyncEvent =
      | { type: 'USER_CONNECTED_SPOTIFY'; userId: string; timestamp: number }
      | { type: 'USER_SYNC_STARTED'; userId: string; syncType: 'full' | 'delta'; timestamp: number }
      | { type: 'USER_SYNC_COMPLETED'; userId: string; itemsSynced: number; durationMs: number; timestamp: number }
      | { type: 'PERSONALITY_GENERATED'; userId: string; archetype: string; model: string; latencyMs: number; timestamp: number }
      | { type: 'HEATMAP_UPDATED'; userId: string; cacheSource: 'hot' | 'warm' | 'cold' | 'live'; timestamp: number }
      | { type: 'CARD_EXPORTED'; userId: string; cardType: 'personality' | 'compare'; timestamp: number }
      | { type: 'ANALYTICS_COMPUTED'; userId: string; snapshotDate: string; metricsCount: number; timestamp: number }
    ```
  - Create `src/lib/events/emitter.ts`:
    - `emitEvent(event)` — Log event to `events` table in PostgreSQL
    - `emitEvent(event)` — Also track in Sentry as breadcrumb
    - `emitEvent(event)` — If event is critical, also enqueue QStash job
  - Create `src/lib/events/index.ts` barrel export
  - Create `src/app/api/events/route.ts`:
    - POST handler to receive events from frontend (client-side analytics)
    - Validates event shape, logs to DB + Sentry
    - Rate limited (generalApiLimiter)
  - Write tests:
    - Events emitted and stored correctly
    - Critical events trigger QStash jobs
    - Event types are type-safe (TypeScript compile check)

  **Must NOT do**:
  - Do NOT send PII as event metadata
  - Do NOT make event emission blocking (fire and forget)
  - Do NOT use a complex event bus library (keep it simple with Postgres + Sentry)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Type-safe event system design with multiple consumers (DB, Sentry, QStash).
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 2 (with Tasks 9, 11, 12, 13, 14)
  - **Blocks**: Task 11 (workers consume events), Task 14 (observability)
  - **Blocked By**: Tasks 3 (Sentry), 4 (QStash), 7 (DB schema with events table)

  **References**:
  - `src/lib/db/queries.ts` — `logEvent` function (Task 7)
  - `src/lib/observability/metrics.ts` — Sentry breadcrumbs (Task 3)

  **Acceptance Criteria**:
  - [ ] `src/lib/events/types.ts` with all typed events
  - [ ] `src/lib/events/emitter.ts` with `emitEvent`
  - [ ] `src/app/api/events/route.ts` POST handler
  - [ ] Events stored in `events` table
  - [ ] Critical events trigger QStash jobs
  - [ ] `vitest run` passes
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Event emitted and stored in DB
    Tool: Bash (bun repl)
    Preconditions: DB + Sentry configured
    Steps:
      1. Import `{ emitEvent }` from `@/lib/events`
      2. Emit `{ type: 'USER_CONNECTED_SPOTIFY', userId: 'test-1', timestamp: Date.now() }`
      3. Query events table: `SELECT * FROM events WHERE user_id = 'test-1'`
      4. Check event row exists
    Expected Result: Event stored in DB
    Failure Indicators: DB query returns empty
    Evidence: .sisyphus/evidence/task-10-event-emitted.txt

  Scenario: Event POST endpoint accepts and stores
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. POST to /api/events with `{ "type": "CARD_EXPORTED", "userId": "test-1", "cardType": "personality" }`
      2. Check response 200
      3. Query events table for that event
    Expected Result: Event received and stored
    Failure Indicators: 400, 500, not stored
    Evidence: .sisyphus/evidence/task-10-event-api.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-10-event-emitted.txt`
  - [ ] `.sisyphus/evidence/task-10-event-api.txt`

  **Commit**: YES (groups with Task 14)
  - Message: `feat(events): event system — typed events with DB + Sentry + QStash consumers`

- [x] 11. Async workers — Personality, Analytics, Embedding (QStash)

  **What to do**:
  - Flesh out the 4 worker routes created in Task 4 with real logic:
  - **Personality Worker** (`/api/workers/personality`):
    1. Receive `userId` and optional `forceRefresh` flag
    2. Fetch user's top artists/tracks from cache or Spotify API
    3. Compute structured metrics (averages, ratios, distributions)
    4. Call Gemini AI with compact structured prompt (not raw data)
    5. Validate + sanitize personality result
    6. Store in `personality_snapshots` table
    7. Store in Redis hot cache (15min TTL)
    8. Emit `PERSONALITY_GENERATED` event
    9. Enqueue `EMBEDDING_WORKER` job to generate vectors
  - **Analytics Worker** (`/api/workers/analytics`):
    1. Receive `userId` and optional `dateRange`
    2. Fetch user data (artists, tracks, features)
    3. Compute: top genres, mood averages, listening hours distribution
    4. Update `analytics` table for the date
    5. Refresh materialized view (or mark for refresh)
    6. Warm user cache with precomputed data
    7. Emit `ANALYTICS_COMPUTED` event
  - **Embedding Worker** (`/api/workers/embedding`):
    1. Receive `userId`
    2. Fetch user's top genres and artist metadata
    3. Generate embedding vectors (numeric arrays from genre/feature data)
    4. Store in `genre_vectors` table (pgvector)
  - **Card Worker** (`/api/workers/card`):
    1. Receive `userId` and `cardType`
    2. Fetch personality/analytics data
    3. Generate share card image (server-side, using @vercel/og or puppeteer)
    4. Store image in Vercel Blob or return data URL
    5. Cache card URL in Redis (24h TTL)
    6. Return card URL to caller
  - Verify QStash signature on all worker routes (security)
  - Write integration tests:
    - Workers process jobs and store results
    - Workers handle errors gracefully (retry via QStash)
    - Signature verification rejects unauthenticated requests

  **Must NOT do**:
  - Do NOT process personality synchronously in the request path
  - Do NOT expose worker routes to the public (verify QStash signature)
  - Do NOT make API calls that exceed Spotify rate limits in workers

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex async pipeline — 4 workers with different logic, QStash integration, chained jobs.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 2 (with Tasks 9, 10, 12, 13, 14)
  - **Blocks**: Tasks 15, 16, 17, 18
  - **Blocked By**: Tasks 4 (QStash scaffolding), 7 (DB), 5 (cache)

  **References**:
  - `src/app/api/workers/personality/route.ts` — Created in Task 4
  - `src/lib/gemini.ts` — Existing AI logic to refactor into worker
  - `src/lib/spotify.ts` — Data fetching functions
  - QStash signature verification: `https://upstash.com/docs/qstash/howto/verify`

  **Acceptance Criteria**:
  - [ ] Personality worker generates personality + stores in DB + emits event
  - [ ] Analytics worker computes aggregates + stores in analytics table
  - [ ] Embedding worker generates vectors + stores in genre_vectors
  - [ ] Card worker generates card + returns URL
  - [ ] QStash signature verification on all workers
  - [ ] `vitest run` passes
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Personality worker processes job and stores result
    Tool: Bash (curl)
    Preconditions: Dev server running, QStash configured
    Steps:
      1. POST to /api/workers/personality with QStash signature header
      2. Check response 200
      3. Query personality_snapshots table for user
      4. Check archetype, summary, chaos_index fields populated
    Expected Result: Personality stored in DB
    Failure Indicators: 500, empty fields
    Evidence: .sisyphus/evidence/task-11-personality-worker.txt

  Scenario: Worker rejects unauthenticated requests
    Tool: Bash (curl)
    Steps:
      1. POST to /api/workers/personality WITHOUT QStash signature
      2. Check response 401
    Expected Result: Unauthenticated request rejected
    Failure Indicators: Returns 200 without signature
    Evidence: .sisyphus/evidence/task-11-worker-auth.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-11-personality-worker.txt`
  - [ ] `.sisyphus/evidence/task-11-worker-auth.txt`

  **Commit**: YES (groups with Task 4)
  - Message: `feat(workers): async workers — Personality, Analytics, Embedding via QStash`

- [x] 12. Incremental sync — delta sync engine for Spotify data

  **What to do**:
  - Create `src/lib/sync/incremental-sync.ts`:
    - `syncUserData(userId, accessToken, mode)`:
      - `mode: 'full' | 'delta'`
      - **Full sync**: Fetch all data (top artists, tracks, recently played), store in DB, warm cache
      - **Delta sync**: Fetch only recently played, check what's new, update incrementally
    - `shouldSyncUser(userId)`:
      - Check Redis for last sync timestamp
      - If > 24h → trigger full sync
      - If > 1h → trigger delta sync
      - If < 1h → skip (still fresh)
    - `getSyncStatus(userId)`:
      - Returns `{ lastSyncAt, status: 'idle' | 'syncing' | 'failed', itemsCount }`
  - Create `src/app/api/sync/route.ts`:
    - POST handler: trigger sync for current user
    - GET handler: get sync status
    - Rate limited (generalApiLimiter)
  - Wire into dashboard loading:
    - Dashboard page.tsx checks sync status
    - If data is stale or missing → enqueue sync job
    - Show sync progress indicator (subtle, non-blocking)
  - Create `src/lib/sync/spotify-sync.ts`:
    - `processSpotifyData(userId, rawData)`:
      - Transforms Spotify API responses into normalized DB records
      - Upserts tracks into `tracks` table
      - Creates `listening_events` from recently played
      - Updates aggregates
  - Write tests:
    - Sync stores data correctly
    - Delta sync only updates changed items
    - Sync status reports correctly

  **Must NOT do**:
  - Do NOT sync data that hasn't changed (track metrics, artists metadata)
  - Do NOT block the UI on sync completion (show cached data, sync in background)
  - Do NOT sync more than once per hour per user (enforce minimum interval)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Sync engine with full/delta modes, status tracking, data transformation pipeline.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 2 (with Tasks 9, 10, 11, 13, 14)
  - **Blocks**: Task 13 (data layer refactor needs sync)
  - **Blocked By**: Tasks 7 (DB schema), 5 (cache)

  **References**:
  - `src/lib/spotify.ts` — Data fetching to wrap
  - `src/lib/cache/keys.ts` — Cache key for sync timestamps
  - `src/lib/db/queries.ts` — upsertTrack, logEvent

  **Acceptance Criteria**:
  - [ ] `src/lib/sync/incremental-sync.ts` with syncUserData, shouldSyncUser, getSyncStatus
  - [ ] `src/app/api/sync/route.ts` POST + GET handlers
  - [ ] `src/lib/sync/spotify-sync.ts` data transformation
  - [ ] Dashboard shows sync status (cached data → background sync → fresh data)
  - [ ] `vitest run` passes
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Full sync stores data in DB
    Tool: Bash (curl + vitest)
    Preconditions: Dev server running, DB configured
    Steps:
      1. POST to /api/sync with mode: 'full'
      2. Check response 200 with syncId
      3. Query tracks table — should have new entries
      4. Query listening_events — should have entries
    Expected Result: Data synced to DB
    Failure Indicators: No data in tables
    Evidence: .sisyphus/evidence/task-12-full-sync.txt

  Scenario: Sync status returns correct state
    Tool: Bash (curl)
    Steps:
      1. GET /api/sync
      2. Check response has lastSyncAt, status, itemsCount
    Expected Result: Sync status object returned
    Failure Indicators: Missing fields
    Evidence: .sisyphus/evidence/task-12-sync-status.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-12-full-sync.txt`
  - [ ] `.sisyphus/evidence/task-12-sync-status.txt`

  **Commit**: YES
  - Message: `feat(sync): incremental sync engine — full + delta modes for Spotify data`

- [x] 13. Refactor data layer — migrate from Supabase cache to Redis + PostgreSQL

  **What to do**:
  - Create `src/lib/data/index.ts` — Unified data access layer:
    - `getTopArtists(userId, options?)` — Multi-tier cache → DB → Spotify API
    - `getTopTracks(userId, options?)` — Same pattern
    - `getAudioFeatures(userId, trackIds)` — Same pattern
    - `getPersonality(userId)` — Redis (hot) → DB (cold) → Queue worker (generate)
    - `getAnalytics(userId)` — Redis (precomputed) → DB (materialized view)
  - Upgrade `src/lib/spotify.ts` functions to use the new data layer:
    - Each function calls `getMultiTiered()` (Task 5) internally
    - On cache MISS: fetches from Spotify, stores in Redis, upserts into PostgreSQL
    - On cache HIT: returns from appropriate tier
    - Falls back to Supabase cache if Redis is unavailable (gradual migration)
  - Deprecate direct Supabase cache calls (mark with `@deprecated` in JSDoc):
    - `getCachedSpotifyData` — Keep for backward compatibility, but new code uses Redis
  - Create migration script: `scripts/migrate-cache.ts`:
    - Reads all entries from Supabase `spotify_cache` table
    - Writes them to Redis with appropriate TTL
    - Reports progress + counts
  - Write integration tests:
    - Data layer returns correct data from each tier
    - Redis → DB → API fallthrough works correctly
    - Supabase deprecation doesn't break existing functionality

  **Must NOT do**:
  - Do NOT remove Supabase integration entirely (keeping for fallback and auth)
  - Do NOT break existing `dashboard/page.tsx` imports (they'll still work)
  - Do NOT add new data access paths that bypass the cache

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex refactoring — multiple data sources, migration script, backward compatibility.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 2 (with Tasks 9, 10, 11, 12, 14)
  - **Blocks**: Tasks 20-26 (UI depends on data layer)
  - **Blocked By**: Tasks 1 (Redis), 5 (cache strategy), 7 (DB), 9 (API Gateway), 11 (workers)

  **References**:
  - `src/lib/spotify.ts` — Existing data fetching to wrap
  - `src/lib/cache/strategy.ts` — Multi-tier cache (Task 5)
  - `src/lib/db/queries.ts` — DB queries (Task 7)

  **Acceptance Criteria**:
  - [ ] `src/lib/data/index.ts` with unified getTopArtists, getTopTracks, getAudioFeatures, getPersonality, getAnalytics
  - [ ] All existing spotify.ts functions upgraded to use new data layer
  - [ ] `scripts/migrate-cache.ts` migration script
  - [ ] `vitest run` passes (all data layer integration tests)
  - [ ] `pnpm build` passes
  - [ ] Dashboard still loads correctly (backward compatible)

  **QA Scenarios**:
  ```
  Scenario: Data layer returns from cache on repeat call
    Tool: Bash (vitest)
    Preconditions: Data layer tests created
    Steps:
      1. Call getTopArtists(userId) — expect cache MISS → fetches from Spotify
      2. Call getTopArtists(userId) again — expect cache HIT
      3. Check second call is faster (cached)
    Expected Result: Second call returns cached data
    Failure Indicators: Both calls fetch from API
    Evidence: .sisyphus/evidence/task-13-data-layer-cache.txt

  Scenario: Migration script copies Supabase cache to Redis
    Tool: Bash
    Preconditions: Supabase cache has entries, Redis is empty
    Steps:
      1. Run `bun scripts/migrate-cache.ts`
      2. Check Redis has keys matching Supabase entries
      3. Verify data is identical
    Expected Result: Cache migrated to Redis
    Failure Indicators: Missing keys, data mismatch
    Evidence: .sisyphus/evidence/task-13-migration.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-13-data-layer-cache.txt`
  - [ ] `.sisyphus/evidence/task-13-migration.txt`

  **Commit**: YES
  - Message: `refactor(data): migrate from Supabase cache to Redis + PostgreSQL multi-tier`

- [x] 14. Observability dashboards — Sentry custom metrics + cache hit ratio

  **What to do**:
  - Build Sentry dashboards:
    - **Cache Performance** dashboard widget:
      - Cache hit ratio over time (hot tier, warm tier, cold tier)
      - Cache miss rate by endpoint
      - Top 5 cache keys by access frequency
      - Average cache TTL consumed
    - **Spotify API Performance** dashboard widget:
      - Average latency by endpoint
      - Error rate (4xx, 5xx)
      - Rate limit hit count
      - Request volume by hour
    - **AI Pipeline** dashboard widget:
      - Average personality generation latency
      - Token usage per generation
      - Model cost (estimated)
      - Queue depth (pending jobs)
    - **Sync Health** dashboard widget:
      - Successful syncs vs failed syncs
      - Average items synced per session
      - Time since last sync per user
  - Create `src/lib/observability/dashboards.ts`:
    - Helper functions to create/update Sentry dashboards via API
    - Schedule daily dashboard snapshot
  - Implement `trackCacheHit/Miss` (from Task 3) to send metrics to Sentry:
    - Tag each metric with: cache tier (hot/warm/cold), endpoint, user segment
  - Create `src/lib/observability/health-check.ts`:
    - `GET /api/health` endpoint returning system status:
      - Redis connectivity ✅/❌
      - PostgreSQL connectivity ✅/❌
      - QStash connectivity ✅/❌
      - Sentry connectivity ✅/❌
      - Cache hit ratio (last 5 min)
    - Used for monitoring and demo purposes
  - Write tests: health endpoint returns correct statuses

  **Must NOT do**:
  - Do NOT exceed Sentry free tier (5K events/month)
  - Do NOT send individual API request metrics (aggregate only)
  - Do NOT expose health endpoint publicly (or rate limit it)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Observability infrastructure — Sentry dashboards, custom metrics, health checks.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 2 (with Tasks 9, 10, 11, 12, 13)
  - **Blocks**: None (runs in parallel)
  - **Blocked By**: Tasks 3 (Sentry setup), 5 (cache metrics)

  **References**:
  - `src/lib/observability/metrics.ts` — Created in Task 3
  - Sentry dashboard API: `https://docs.sentry.io/api/dashboards/`
  - `src/app/api/health/route.ts` — Health check endpoint

  **Acceptance Criteria**:
  - [ ] Sentry dashboards created: Cache Performance, Spotify API Performance, AI Pipeline, Sync Health
  - [ ] `src/lib/observability/dashboards.ts` with dashboard helpers
  - [ ] Cache hit/miss metrics flowing to Sentry
  - [ ] `GET /api/health` returns system status
  - [ ] `vitest run` passes
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Health endpoint returns all services status
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. GET http://localhost:3000/api/health
      2. Check response has: redis, postgres, qstash, sentry status fields
      3. Check each status is "connected" or "disconnected"
    Expected Result: Health status object with all services
    Failure Indicators: Missing fields, 500 error
    Evidence: .sisyphus/evidence/task-14-health-check.txt

  Scenario: Cache metrics appear in Sentry
    Tool: Bash (curl to Sentry API)
    Preconditions: Metrics tracking enabled
    Steps:
      1. Trigger a cache hit by calling an API endpoint twice
      2. Trigger a cache miss by clearing cache then calling
      3. Check Sentry dashboard for metric events
    Expected Result: Cache hit/miss events in Sentry
    Failure Indicators: No events, wrong counts
    Evidence: .sisyphus/evidence/task-14-cache-metrics.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-14-health-check.txt`
  - [ ] `.sisyphus/evidence/task-14-cache-metrics.txt`

  **Commit**: YES (groups with Task 3)
  - Message: `feat(observability): Sentry dashboards + cache metrics + health endpoint`

- [x] 15. AI pipeline optimization — structured metrics → compact prompt → fingerprint

  **What to do**:
  - Refactor `src/lib/gemini.ts` for async + optimized pipeline:
    - **Step 1 — Structured Metrics** (computed before AI call):
      - `computeAudioFingerprint(audioFeatures)`:
        - Average energy, valence, danceability, acousticness, instrumentalness
        - Tempo range (min, max, avg)
        - Night listening ratio (simulated: late-night hours have lower valence)
        - Genre diversity score (unique genres / total artists)
        - Mood volatility (std dev of valence across tracks)
        - Chaos index (combination of energy variability + genre switching frequency)
      - Returns `AudioFingerprint` — structured numeric data (no LLM needed)
    - **Step 2 — Compact Prompt**:
      - Instead of sending raw artist/track lists to Gemini:
        ```
        Audio fingerprint:
        - Energy: 0.78 (high)
        - Valence: 0.42 (moderate-low)
        - Danceability: 0.65
        - Acousticness: 0.23
        - Night listening ratio: 67% (prefers late-night listening)
        - Genre diversity: 4/10 (concentrated in 3 genres)
        - Chaos index: 73%
        - Top genres: indie rock, alternative, electronic
        
        Generate personality as JSON:
        { primaryArchetype, secondaryTrait, listeningAura, summary, chaosIndex }
        ```
    - **Step 3 — Async via Worker**:
      - Personality generation moved to QStash worker (Task 11)
      - Frontend/dashboard requests personality → if not cached → enqueue personality job
      - Show loading skeleton with ETA estimate
    - **Step 4 — Cache Results**:
      - Personality stored in Redis (hot: 15min) + PostgreSQL (permanent)
      - Same personality returned until user resyncs
  - Create `src/lib/ai/index.ts`:
    - `generatePersonality(userId)` — Full pipeline (called by worker)
    - `getPersonalityForUser(userId)` — Cache → DB → queue (called by UI)
    - `computeAudioFingerprint(features)` — Step 1 (sync, fast)
    - `summarizePersonalityPrompt(fingerprint)` — Step 2 (construct prompt)
  - Write tests:
    - Audio fingerprint computed correctly
    - Prompt construction is deterministic
    - Pipeline generates valid personality JSON

  **Must NOT do**:
  - Do NOT send raw Spotify data to Gemini (use structured metrics)
  - Do NOT call AI synchronously from UI
  - Do NOT exceed Gemini free tier limits (60 req/min)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: AI pipeline redesign — structured metrics, prompt optimization, async integration.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 3 (with Tasks 16, 17, 18, 19)
  - **Blocks**: Tasks 22, 24, 25 (UI depends on personality data)
  - **Blocked By**: Tasks 5 (cache), 7 (DB), 11 (workers)

  **References**:
  - `src/lib/gemini.ts` — Existing AI logic to refactor
  - `src/lib/ai/fingerprint.ts` — New structured metrics module
  - Google Gemini API: `https://ai.google.dev/gemini-api/docs`

  **Acceptance Criteria**:
  - [ ] `src/lib/ai/index.ts` with generatePersonality, getPersonalityForUser
  - [ ] `src/lib/ai/fingerprint.ts` with computeAudioFingerprint
  - [ ] AI call uses compact structured prompt (not raw data)
  - [ ] Personality generation is async via worker
  - [ ] Results cached in Redis + PostgreSQL
  - [ ] `vitest run` passes
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Audio fingerprint computed correctly
    Tool: Bash (vitest)
    Preconditions: Fingerprint module created
    Steps:
      1. Pass mock audio features to computeAudioFingerprint
      2. Check returned fingerprint has all expected fields
      3. Verify numeric ranges are 0-1 or valid percentages
    Expected Result: Complete, valid fingerprint
    Failure Indicators: Missing fields, out-of-range values
    Evidence: .sisyphus/evidence/task-15-fingerprint.txt

  Scenario: Compact prompt is deterministic
    Tool: Bash (vitest)
    Preconditions: Prompt builder created
    Steps:
      1. Pass same fingerprint twice
      2. Check both prompts are identical
      3. Verify prompt contains structured data, not raw artist lists
    Expected Result: Identical deterministic prompts
    Failure Indicators: Different prompts, contains raw data
    Evidence: .sisyphus/evidence/task-15-prompt.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-15-fingerprint.txt`
  - [ ] `.sisyphus/evidence/task-15-prompt.txt`

  **Commit**: YES
  - Message: `feat(ai): AI pipeline optimization — structured metrics, compact prompt, async generation`

- [x] 16. Precomputed analytics — materialized views + nightly aggregation

  **What to do**:
  - Create `src/lib/analytics/materialized-views.sql`:
    - `mv_user_top_genres` — Precomputed top genres per user (refreshed daily)
    - `mv_mood_trends` — Precomputed mood averages over time per user
    - `mv_listening_hours` — Precomputed hourly distribution per user
    - `mv_archetype_distribution` — Archetype counts across all users (for platform stats)
  - Create `src/lib/analytics/index.ts`:
    - `computeDailyAnalytics(userId)` — Compute + store daily analytics snapshot
    - `computePlatformAnalytics()` — Aggregate across all users (for landing page stats)
    - `refreshMaterializedViews()` — Refresh all materialized views
    - `getPrecomputedDashboard(userId)` — Fetch all dashboard data from precomputed sources
  - Create nightly aggregation worker (`/api/workers/analytics` fleshed out):
    - Scheduled via QStash cron (or Vercel Cron Jobs):
      - Every 24h: refresh materialized views
      - Every hour: compute delta analytics for recently active users
  - Wire `getPrecomputedDashboard` into the dashboard page:
    - Dashboard loads instantly from precomputed data
    - No live aggregations on page load
    - Background: enqueue delta sync if data is stale
  - Write tests:
    - Analytics computation produces correct results
    - Materialized views improve query performance (benchmark)

  **Must NOT do**:
  - Do NOT compute analytics synchronously during page load
  - Do NOT materialize views that change every minute (daily granularity is fine)
  - Do NOT create too many materialized views (Neon 0.5GB limit)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Analytics pipeline design — materialized views, aggregation logic, scheduled workers.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 3 (with Tasks 15, 17, 18, 19)
  - **Blocks**: Tasks 22, 26 (UI features depend on analytics)
  - **Blocked By**: Tasks 7 (DB), 11 (workers)

  **References**:
  - `src/lib/db/schema.ts` — analytics table structure
  - PostgreSQL materialized views: `https://www.postgresql.org/docs/current/rules-materializedviews.html`

  **Acceptance Criteria**:
  - [ ] 4 materialized views created in Neon
  - [ ] `src/lib/analytics/index.ts` with computeDailyAnalytics, refreshMaterializedViews, getPrecomputedDashboard
  - [ ] Nightly aggregation worker scheduled
  - [ ] Dashboard loads from precomputed data
  - [ ] `vitest run` passes
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Analytics computed and stored
    Tool: Bash (bun repl)
    Preconditions: User has data in DB
    Steps:
      1. Import computeDailyAnalytics from @/lib/analytics
      2. Run for a test userId
      3. Query analytics table for that userId
      4. Check top_genres, mood_averages, listening_hours_distribution are populated
    Expected Result: Analytics snapshots stored
    Failure Indicators: No data in analytics table
    Evidence: .sisyphus/evidence/task-16-analytics-computed.txt

  Scenario: Dashboard loads faster with precomputed data
    Tool: Bash (curl timing)
    Preconditions: Precomputed analytics exist
    Steps:
      1. Measure time for getPrecomputedDashboard(userId)
      2. Compare to computing aggregates live
    Expected Result: Precomputed is >10x faster
    Failure Indicators: Similar response times
    Evidence: .sisyphus/evidence/task-16-dashboard-speed.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-16-analytics-computed.txt`
  - [ ] `.sisyphus/evidence/task-16-dashboard-speed.txt`

  **Commit**: YES (groups with Task 18)
  - Message: `feat(analytics): precomputed analytics — materialized views + nightly aggregation`

- [x] 17. Vector embeddings — pgvector setup + genre/profile embeddings

  **What to do**:
  - Enable pgvector extension in Neon database:
    - `CREATE EXTENSION IF NOT EXISTS vector`
  - Create `src/lib/vectors/index.ts`:
    - `generateGenreEmbedding(genres: string[])`:
      - Convert genre names to numeric vectors (128-dim)
      - Using simple hashing → normalized vector approach (no ML model needed):
        - For each genre, create a deterministic 128-dim vector from genre name hash
        - Aggregate all genre vectors (average) for user profile
      - Alternative: use Gemini embeddings API for better quality
    - `generateUserProfileEmbedding(userId)`:
      - Combines: top genres, audio features, archetype
      - Produces a single 128-dim embedding representing user's music taste
    - `findSimilarUsers(userId, limit)`:
      - Query genre_vectors for cosine similarity
      - `SELECT * FROM genre_vectors ORDER BY embedding <=> $1 LIMIT limit`
      - Returns userIds of most similar listeners
    - `findVibeCompatibility(userId1, userId2)`:
      - Cosine similarity between two user embeddings
      - Returns 0-1 compatibility score
  - Create `src/app/api/recommend/similar/route.ts`:
    - GET handler: takes `userId` and optional `limit`
    - Returns similar users with compatibility scores
    - Rate limited (generalApiLimiter)
  - Wire into UI:
    - "Find Your Music Twin" button on dashboard
    - Shows similar users (or mock if only one user)
  - Write tests:
    - Embeddings generated consistently (same input → same vector)
    - Cosine similarity calculation correct
    - Similar user queries return ordered results

  **Must NOT do**:
  - Do NOT use a paid embedding API (use deterministic hashing or Gemini free)
  - Do NOT expose raw vector data via API (only derived similarity scores)
  - Do NOT store embeddings for users who haven't opted into social features

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Vector embedding pipeline — pgvector, cosine similarity, recommendation queries.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 3 (with Tasks 15, 16, 18, 19)
  - **Blocks**: Task 18 (recommendation engine uses embeddings), Task 25 (friend comparison)
  - **Blocked By**: Tasks 2 (pgvector requires Neon), 7 (genre_vectors table)

  **References**:
  - pgvector docs: `https://github.com/pgvector/pgvector`
  - `src/lib/db/schema.ts` — genre_vectors table definition

  **Acceptance Criteria**:
  - [ ] pgvector extension enabled in Neon
  - [ ] `src/lib/vectors/index.ts` with generateGenreEmbedding, generateUserProfileEmbedding, findSimilarUsers, findVibeCompatibility
  - [ ] `/api/recommend/similar` endpoint returns similar users
  - [ ] Embeddings are deterministic (same input → same output)
  - [ ] `vitest run` passes
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Embedding generation is deterministic
    Tool: Bash (vitest)
    Preconditions: Vectors module created
    Steps:
      1. Call generateGenreEmbedding(['rock', 'indie']) twice
      2. Assert both results are identical (same vector values)
    Expected Result: Deterministic embedding
    Failure Indicators: Different vectors for same input
    Evidence: .sisyphus/evidence/task-17-deterministic.txt

  Scenario: Cosine similarity returns valid score
    Tool: Bash (vitest)
    Preconditions: Similarity function exists
    Steps:
      1. Create two identical embeddings
      2. Find similarity → should be 1.0 (or very close)
      3. Create two opposite embeddings
      4. Find similarity → should be near 0
    Expected Result: Correct similarity range 0-1
    Failure Indicators: Wrong scores, out of range
    Evidence: .sisyphus/evidence/task-17-similarity.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-17-deterministic.txt`
  - [ ] `.sisyphus/evidence/task-17-similarity.txt`

  **Commit**: YES (groups with Task 18)
  - Message: `feat(vectors): vector embeddings — pgvector setup + genre/profile embedding`

- [x] 18. Recommendation engine — cosine similarity, vibe matching, music twins

  **What to do**:
  - Create `src/lib/recommend/index.ts`:
    - `getMusicTwin(userId)`:
      - Find user with highest cosine similarity
      - Return compat score + shared genres + contrasting traits
    - `getVibeCompatibility(userId1, userId2)`:
      - Uses pgvector similarity + genre overlap + archetype compatibility
      - Returns detailed breakdown:
        - Overall compatibility %
        - Genre overlap (shared genres count)
        - Archetype synergy (complementary or same)
        - Mood alignment (valence/energy similarity)
        - "Vibe match" label (e.g., "Soulmates 🎵", "Musical Cousins", "Opposite Vibes")
    - `getPersonalizedRecommendations(userId)`:
      - Artists similar to top artists (via genre vectors)
      - Users with similar taste (via profile embeddings)
      - Genre exploration suggestions (genres user hasn't explored)
  - Create `src/app/api/recommend/vibe-compatibility/route.ts`:
    - POST handler: receives two userIds
    - Returns compatibility breakdown
  - Create `src/app/api/recommend/personalized/route.ts`:
    - GET handler: returns personalized recommendations for user
  - Create `src/components/dashboard/MusicTwinCard.tsx`:
    - Small card: "Your Music Twin" section on dashboard
    - Shows compat score, shared genres, contrast note
    - "Find My Twin" button triggers recommendation engine
  - Write tests:
    - Recommendation logic returns valid results
    - Empty data handled gracefully
    - Archetype compatibility matrix is symmetric

  **Must NOT do**:
  - Do NOT recommend real users unless platform has 5+ users (show mock data otherwise)
  - Do NOT store recommendation results (compute on demand from cached embeddings)
  - Do NOT recommend based on sensitive attributes

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Recommendation logic — multi-factor scoring, API routes, UI integration.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 3 (with Tasks 15, 16, 17, 19)
  - **Blocks**: Task 25 (friend comparison uses compatibility)
  - **Blocked By**: Tasks 17 (embeddings), 7 (DB)

  **References**:
  - `src/lib/vectors/index.ts` — Embedding similarity (Task 17)
  - `src/types/next-auth.ts` — Archetype types for compatibility matrix

  **Acceptance Criteria**:
  - [ ] `src/lib/recommend/index.ts` with getMusicTwin, getVibeCompatibility, getPersonalizedRecommendations
  - [ ] `src/app/api/recommend/vibe-compatibility/route.ts` POST handler
  - [ ] `src/app/api/recommend/personalized/route.ts` GET handler
  - [ ] `src/components/dashboard/MusicTwinCard.tsx`
  - [ ] Archetype compatibility matrix defined
  - [ ] `vitest run` passes
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```
  Scenario: Vibe compatibility returns detailed breakdown
    Tool: Bash (curl)
    Preconditions: Two users have embeddings
    Steps:
      1. POST to /api/recommend/vibe-compatibility with { userId1, userId2 }
      2. Check response has: compatibility, genreOverlap, archetypeSynergy, moodAlignment, vibeLabel
    Expected Result: Complete compatibility breakdown
    Failure Indicators: Missing fields
    Evidence: .sisyphus/evidence/task-18-vibe-compat.txt

  Scenario: Music Twin card renders on dashboard
    Tool: Playwright
    Preconditions: Dev server running, authenticated
    Steps:
      1. Navigate to /dashboard
      2. Check "Your Music Twin" section visible
      3. Check compatibility score visible
      4. Check "Find My Twin" button
    Expected Result: Music Twin section on dashboard
    Failure Indicators: Missing section
    Evidence: .sisyphus/evidence/task-18-music-twin-card.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-18-vibe-compat.txt`
  - [ ] `.sisyphus/evidence/task-18-music-twin-card.png`

  **Commit**: YES (groups with Task 17)
  - Message: `feat(recommend): recommendation engine — cosine similarity, vibe matching, music twins`

- [x] 19. Icon standardization (material-symbols → lucide-react)

  **What to do**:
  - Same as Task 2 from the original plan:
  - Search entire codebase for `material-symbols-outlined` references
  - Replace each `<span class="material-symbols-outlined">icon_name</span>` with equivalent lucide-react icon
  - Remove any Google Fonts import for "Material Symbols Outlined"
  - Verify no remaining material-symbols references
  - Verify build compiles

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Find-and-replace with visual verification.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 3 (with Tasks 15, 16, 17, 18)
  - **Blocks**: Tasks 20-26 (UI uses lucide-react)
  - **Blocked By**: None

  **References**:
  - `src/app/page.tsx`, `src/app/dashboard/DashboardClient.tsx`, `src/components/`

  **Acceptance Criteria**:
  - [ ] Zero instances of `material-symbols-outlined` in codebase
  - [ ] `pnpm build` compiles successfully

  **QA Scenarios**:
  ```
  Scenario: No material-symbols-outlined references remain
    Tool: Bash (grep)
    Steps:
      1. Run `grep -r "material-symbols-outlined" src/ --include="*.tsx" --include="*.ts" --include="*.css"`
      2. Check output is empty
    Expected Result: No references found
    Failure Indicators: References still exist
    Evidence: .sisyphus/evidence/task-19-clean-icons.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-19-clean-icons.txt`

  **Commit**: YES
  - Message: `refactor(icons): replace material-symbols-outlined with lucide-react`

- [x] 20. Shared hooks + utility components

  **What to do**:
  - Create `src/hooks/` directory with:
    - `useMediaQuery.ts` — Match media queries (SSR-safe)
    - `useReducedMotion.ts` — prefers-reduced-motion detection
    - `useWebGL.ts` — WebGL support detection
  - Create utility components:
    - `LoadingSkeleton.tsx` — Reusable skeleton with variants (card, text, chart, hero)
    - `EmptyState.tsx` — Centered empty state with icon, title, description, optional action
    - `ErrorState.tsx` — Error card with retry button
    - `WebGLFallback.tsx` — 2D Canvas fallback for galaxy when WebGL unavailable
  - Write Vitest tests for all hooks + components
  - Write Playwright E2E tests verifying rendering

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard hooks and presentational components.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 4 (with Tasks 21, 22, 23, 24, 25, 26)
  - **Blocks**: None (foundation for UI)
  - **Blocked By**: Task 8 (test infra)

  **References**:
  - `src/components/ui/skeleton.tsx` — Base skeleton
  - `src/components/ui/card.tsx` — Card styling patterns

  **Acceptance Criteria**:
  - [ ] 3 hooks created with tests
  - [ ] 4 utility components created with tests
  - [ ] `vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Hooks return correct values
    Tool: Bash (vitest)
    Steps:
      1. Run `pnpm vitest run src/hooks/`
    Expected Result: All hook tests pass
    Failure Indicators: Test failures
    Evidence: .sisyphus/evidence/task-20-hooks.txt

  Scenario: Utility components render
    Tool: Bash (vitest)
    Steps:
      1. Run `pnpm vitest run src/components/ --reporter=verbose`
    Expected Result: All component tests pass
    Failure Indicators: Test failures
    Evidence: .sisyphus/evidence/task-20-utilities.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-20-hooks.txt`
  - [ ] `.sisyphus/evidence/task-20-utilities.txt`

  **Commit**: YES
  - Message: `feat(hooks): shared hooks and utility components`

- [x] 21. Landing page section split + redesign

  **What to do**:
  - Split `src/app/page.tsx` (~329 lines) into section components in `src/components/landing/`:
    - `HeroSection.tsx` — Cinematic hero with "Discover Your VibeDNA" CTA
    - `ArchetypePreviewSection.tsx` — 3 featured archetype cards
    - `GalaxyPreviewSection.tsx` — Embedded galaxy preview
    - `LandingNav.tsx` — Fixed nav with desktop links + mobile hamburger (shadcn Sheet)
    - `FooterSection.tsx` — Footer with links
  - Redesign each section:
    - Hero: full-viewport, animated headlines, glass/neon CTAs (native buttons), Starfield background
    - Archetype cards: responsive grid, hover glow effects, entrance animations
    - Galaxy preview: embed Galaxy component, "Explore Your Universe" CTA
    - Nav: glassmorphism, blur backdrop, responsive (hamburger mobile → full desktop)
  - Smooth scroll to sections on nav link click
  - Entrance animations via framer-motion (staggered, fade-up)
  - Respect `prefers-reduced-motion`
  - Write Vitest + Playwright tests

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Creative visual design with animations, layout, responsive patterns.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 4 (with Tasks 20, 22, 23, 24, 25, 26)
  - **Blocks**: None
  - **Blocked By**: Tasks 19 (icons), 20 (hooks/utilities), 8 (test infra)

  **References**:
  - `src/app/page.tsx` — Current landing page
  - `src/components/Starfield.tsx` — Background particles
  - `src/app/globals.css` — Neon, glass tokens

  **Acceptance Criteria**:
  - [ ] 5 section components created
  - [ ] Hero with CTAs, animations, Starfield
  - [ ] 3 archetype cards with hover + animations
  - [ ] Galaxy preview embedded
  - [ ] Responsive nav (hamburger mobile, full desktop)
  - [ ] Smooth scroll navigation
  - [ ] `vitest run` passes
  - [ ] Playwright tests pass

  **QA Scenarios**:
  ```
  Scenario: Landing page renders all sections
    Tool: Playwright
    Steps:
      1. Navigate to landing page
      2. Check hero, archetype cards, galaxy preview, footer visible
    Expected Result: All sections render
    Failure Indicators: Missing sections
    Evidence: .sisyphus/evidence/task-21-landing-full.png

  Scenario: Mobile nav hamburger menu works
    Tool: Playwright
    Steps:
      1. Set viewport 375x667
      2. Click hamburger → check sheet opens
      3. Click close → check sheet closes
    Expected Result: Mobile menu toggles
    Failure Indicators: Menu doesn't open/close
    Evidence: .sisyphus/evidence/task-21-mobile-nav.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-21-landing-full.png`
  - [ ] `.sisyphus/evidence/task-21-mobile-nav.png`

  **Commit**: YES
  - Message: `feat(landing): cinematic landing page with hero, archetype cards, galaxy preview`

- [x] 22. Dashboard section split + redesign

  **What to do**:
  - Split `DashboardClient.tsx` (~509 lines) into `src/components/dashboard/`:
    - `DashboardNav.tsx` — Top nav with personality context + sign-out
    - `PersonalityHero.tsx` — Archetype hero with gradient text, aura glow, chaos index radial
    - `ListeningHeatmapSection.tsx` — 7×24 heatmap with "3AM Sadness Spike" annotation
    - `AudioRadarSection.tsx` — 5-axis radar chart (Recharts) colored by aura
    - `ArtistCardsSection.tsx` — Top 3 artist glass cards with images, genre badges
    - `AIInsightsSheet.tsx` — FAB → sheet with personality breakdown, stat cards
    - `DashboardBentoGrid.tsx` — Grid layout container
    - `DashboardErrorBoundary.tsx` — Error boundary per section
  - Redesign each section:
    - Personality hero: large archetype name with gradient, aura glow ring, chaos radial bar, secondary trait badge, summary
    - Heatmap: 7×24 colored grid with annotations ("3AM Sadness Spike 🔮"), hover tooltips, weekly pulse bars, donut distribution chart
    - Radar chart: 5 axes (Energy, Valence, Danceability, Acousticness, Instrumentalness), aura-colored, glass card
    - Artist cards: 3 glass cards with image, name truncation, genre badges, hover glow, Spotify link
    - AI Insights sheet: FAB (bottom right, glassmorphism), sheet slides in with personality breakdown, stat cards, "Refresh Analysis"
  - Add loading/empty/error states to ALL sections
  - Wire into precomputed analytics (Task 16) for instant loads
  - Entrance animations via framer-motion (staggered)
  - Respect `prefers-reduced-motion`
  - Write comprehensive Vitest + Playwright tests

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex dashboard redesign — multiple visual sections, animations, data integration.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 4 (with Tasks 20, 21, 23, 24, 25, 26)
  - **Blocks**: None
  - **Blocked By**: Tasks 13 (data layer), 15 (AI pipeline), 16 (analytics), 20 (hooks/utils), 8 (test infra)

  **References**:
  - `src/app/dashboard/DashboardClient.tsx` — Current monolithic component
  - `src/components/ListeningHeatmap.tsx`, `src/components/AudioFeaturesChart.tsx`, `src/components/PersonalityCard.tsx`
  - `src/lib/data/index.ts` — Precomputed dashboard data (Task 13)

  **Acceptance Criteria**:
  - [ ] 8 dashboard section components created
  - [ ] Personality hero with aura glow, chaos radial, gradient text
  - [ ] Heatmap with 7×24 grid, "3AM Sadness Spike", tooltips, donut chart
  - [ ] Radar chart with 5 axes, aura-colored
  - [ ] 3 artist glass cards with images, badges, hover
  - [ ] AI Insights FAB → sheet with breakdown
  - [ ] Loading/empty/error states on all sections
  - [ ] Entrance animations + reduced-motion respect
  - [ ] `vitest run` passes
  - [ ] Playwright tests pass

  **QA Scenarios**:
  ```
  Scenario: Dashboard renders all sections
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard
      2. Check personality hero, heatmap, radar chart, artist cards, galaxy all visible
    Expected Result: Full dashboard renders
    Failure Indicators: Missing sections
    Evidence: .sisyphus/evidence/task-22-dashboard-full.png

  Scenario: Heatmap "3AM Sadness Spike" visible
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard
      2. Scroll to heatmap section
      3. Check "3AM Sadness Spike 🔮" annotation
    Expected Result: Annotation visible
    Failure Indicators: Missing annotation
    Evidence: .sisyphus/evidence/task-22-heatmap-spike.png

  Scenario: AI Insights sheet opens
    Tool: Playwright
    Steps:
      1. Click FAB (bottom right)
      2. Check sheet slides in with personality data
    Expected Result: Sheet opens with content
    Failure Indicators: Sheet doesn't open
    Evidence: .sisyphus/evidence/task-22-ai-sheet.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-22-dashboard-full.png`
  - [ ] `.sisyphus/evidence/task-22-heatmap-spike.png`
  - [ ] `.sisyphus/evidence/task-22-ai-sheet.png`

  **Commit**: YES
  - Message: `feat(dashboard): complete dashboard restructure with personality engine, heatmaps, radar, AI sheet`

- [x] 23. Galaxy enhancement (bloom, constellations, click-to-focus, orbital nav)

  **What to do**:
  - Enhance `src/components/Galaxy.tsx`:
    - **Bloom post-processing**: Add `@react-three/postprocessing` Bloom effect for neon glow
    - **Particle trails**: Orbiting artist planets leave faint trails
    - **Genre constellations**: Lines connecting same-genre artists, colored by genre
    - **Click-to-focus**: Click planet → camera smoothly focuses, artist info popup (HTML overlay) with name, image, Spotify link
    - **Orbital navigation**: Drag to rotate, scroll to zoom, genre filter buttons
    - **Auto-rotate toggle**: Button to toggle galaxy rotation
    - **Genre labels**: Near constellations (HTML overlay)
    - **Camera transitions**: Dramatic zoom-in entrance on load, orbit on filter change
    - **Animated connections**: Pulsing lines between related artists
    - **Starfield depth parallax**: Multi-layer stars at different depths
  - Integrate WebGL detection: if unsupported → render 2D Canvas fallback (WebGLFallback)
  - Write Playwright tests: galaxy canvas renders, interactions work, fallback renders without WebGL

  **Must NOT do**:
  - Do NOT drop below 30fps on mid-range GPUs (test and optimize)
  - Do NOT replace existing Three.js architecture (enhance it)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Advanced 3D visual effects — post-processing, interaction, complex rendering.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 4 (with Tasks 20, 21, 22, 24, 25, 26)
  - **Blocks**: None
  - **Blocked By**: Tasks 20 (useWebGL hook, WebGLFallback component)

  **References**:
  - `src/components/Galaxy.tsx` — Current implementation
  - Three.js bloom: `@react-three/postprocessing`

  **Acceptance Criteria**:
  - [ ] Bloom post-processing visible (glow on bright objects)
  - [ ] Genre constellation lines visible
  - [ ] Click-to-focus works (camera moves + popup)
  - [ ] Orbital navigation (drag, scroll, auto-rotate toggle)
  - [ ] WebGL fallback renders canvas when WebGL unavailable
  - [ ] Dramatic entrance animation plays on load
  - [ ] `vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Galaxy with bloom + constellations
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard
      2. Check galaxy canvas with bloom glow visible
      3. Toggle constellation mode → check lines appear
    Expected Result: Enhanced galaxy with visual effects
    Failure Indicators: No bloom, no lines
    Evidence: .sisyphus/evidence/task-23-galaxy-enhanced.png

  Scenario: Click planet shows info popup
    Tool: Playwright
    Steps:
      1. Wait for galaxy to load
      2. Click on an artist planet
      3. Wait for camera animation (~3s)
      4. Check info popup appears with artist name
    Expected Result: Planet click → focus → popup
    Failure Indicators: No popup, no camera movement
    Evidence: .sisyphus/evidence/task-23-planet-click.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-23-galaxy-enhanced.png`
  - [ ] `.sisyphus/evidence/task-23-planet-click.png`

  **Commit**: YES
  - Message: `feat(galaxy): bloom, constellations, click-to-focus, orbital navigation`

- [x] 24. Shareable personality card with enhanced export

  **What to do**:
  - Redesign `src/components/PersonalityCard.tsx`:
    - Branded layout with VibeDNA watermark
    - Archetype name (gradient), aura color glow
    - Chaos index radial, secondary trait badge, summary
    - Top genres list, color theme selector (4-5 presets)
    - Download PNG button (html-to-image)
    - Copy share text: "I'm the [Archetype] archetype! 🎵 Discover yours at VibeDNA"
    - OG-ready variant (1200×630 aspect ratio)
  - Write Vitest + Playwright tests

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Branded card design with export functionality.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 4 (with Tasks 20, 21, 22, 23, 25, 26)
  - **Blocks**: None
  - **Blocked By**: Tasks 15 (AI pipeline — personality data), 20 (hooks/utils)

  **Acceptance Criteria**:
  - [ ] Branded card with archetype, chaos, aura, summary, genres
  - [ ] Color theme selector (4-5 presets)
  - [ ] PNG download works
  - [ ] Copy share text works
  - [ ] OG-ready variant (1200×630)
  - [ ] `vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Share card renders all data
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard
      2. Find personality card section
      3. Check archetype, chaos index, summary, genres visible
    Expected Result: Full card with all data
    Failure Indicators: Missing fields
    Evidence: .sisyphus/evidence/task-24-share-card.png

  Scenario: PNG download works
    Tool: Playwright
    Steps:
      1. Click "Download as PNG"
      2. Check file downloads
    Expected Result: PNG file saved
    Failure Indicators: No download
    Evidence: .sisyphus/evidence/task-24-download.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-24-share-card.png`
  - [ ] `.sisyphus/evidence/task-24-download.png`

  **Commit**: YES
  - Message: `feat(share): shareable personality card with enhanced branding and export`

- [x] 25. Friend comparison (powered by pgvector)

  **What to do**:
  - Create comparison page `src/app/compare/page.tsx`:
    - Reads `data` URL parameter (encoded personality)
    - Side-by-side archetype cards (you vs friend)
    - Compatibility meter (from pgvector similarity, Task 18)
    - Shared genres list
    - Contrasting traits
    - "Music Twin" compatibility label
  - Create share URL generator in dashboard:
    - "Share Your VibeDNA" button → copies shareable link
    - Data encoded in URL params (no backend storage needed)
  - Wire compatibility engine (Task 18) when comparing real users
  - Mock data fallback when comparing anonymously (URL params)
  - Write Vitest + Playwright tests

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Comparison page UI with side-by-side layout, compatibility visualization.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 4 (with Tasks 20, 21, 22, 23, 24, 26)
  - **Blocks**: None
  - **Blocked By**: Tasks 17 (embeddings), 18 (recommendation engine), 24 (share card)

  **Acceptance Criteria**:
  - [ ] `/compare` page renders side-by-side archetype cards
  - [ ] Compatibility meter with percentage
  - [ ] Shared genres + contrasting traits
  - [ ] Share URL generation + copy
  - [ ] Mock data fallback for anonymous links
  - [ ] `vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Comparison page renders with mock data
    Tool: Playwright
    Steps:
      1. Navigate to /compare?data={encoded-mock-data}
      2. Check two archetype cards visible
      3. Check compatibility meter visible
      4. Check shared genres list
    Expected Result: Full comparison view
    Failure Indicators: Missing cards or data
    Evidence: .sisyphus/evidence/task-25-comparison.png

  Scenario: Share URL copies to clipboard
    Tool: Playwright
    Steps:
      1. Click "Share Your VibeDNA"
      2. Check clipboard has valid URL
    Expected Result: URL copied
    Failure Indicators: Empty clipboard
    Evidence: .sisyphus/evidence/task-25-share-url.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-25-comparison.png`
  - [ ] `.sisyphus/evidence/task-25-share-url.txt`

  **Commit**: YES
  - Message: `feat(compare): friend comparison with pgvector compatibility scoring`

- [x] 26. Listening timeline — genre evolution + emotional transitions

  **What to do**:
  - Create `src/components/dashboard/ListeningTimeline.tsx`:
    - Section title: "Your Listening Journey"
    - Genre evolution: horizontal timeline with colored genre blocks, transition gradients
    - Emotional transitions: valence trend line + energy overlay (dual line chart)
    - Annotations: "Peak Mood 📈", "Dip 📉" on significant points
    - Data procedurally generated from audio features (not real history)
    - Clear label: "Your projected listening journey based on your audio DNA"
    - Responsive: horizontal scroll on mobile
  - Write Vitest + Playwright tests

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Timeline visualization with genre blocks, trend lines, annotations.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 4 (with Tasks 20, 21, 22, 23, 24, 25)
  - **Blocks**: None
  - **Blocked By**: Tasks 20 (hooks/utils), 22 (dashboard section integration)

  **Acceptance Criteria**:
  - [ ] Genre evolution timeline with colored blocks + transitions
  - [ ] Valence trend line with annotations (peaks, valleys)
  - [ ] Energy overlay on same chart
  - [ ] Clear label: procedural data
  - [ ] Responsive: horizontal scroll on mobile
  - [ ] `vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Genre timeline renders
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard
      2. Scroll to "Your Listening Journey"
      3. Check genre blocks with transition gradients
      4. Check trend lines visible
    Expected Result: Timeline with genre + mood data
    Failure Indicators: Missing blocks or lines
    Evidence: .sisyphus/evidence/task-26-timeline.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-26-timeline.png`

  **Commit**: YES
  - Message: `feat(timeline): listening timeline with genre evolution and emotional transitions`

- [x] 27. Feature flags (Redis-backed toggle system)

  **What to do**:
  - Create `src/lib/feature-flags/index.ts`:
    - `getFeatureFlag(flagName, userId?)` — Check if a feature is enabled
    - `setFeatureFlag(flagName, value)` — Enable/disable a feature
    - `getAllFlags()` — Get all feature flags
    - Backed by Redis (Upstash) with 60s local cache to reduce Redis calls
    - Default flags:
      - `galaxy-constellations` — Genre constellation lines
      - `friend-comparison` — Friend comparison feature
      - `ai-insights-sheet` — AI insights bottom sheet
      - `listening-timeline` — Timeline visualization
      - `bloom-effect` — Post-processing bloom
      - `music-twins` — Recommendation engine
  - Create `src/app/api/feature-flags/route.ts`:
    - GET: return all flags
    - POST: set a flag (admin only — simple env-based auth)
  - Wire into UI components:
    - Components check feature flags before rendering experimental features
    - Allows toggling features on/off without deployment
  - Write tests: flag checking, flag setting, default values

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard feature toggle system with Redis storage.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 5 (with Tasks 28, 29, 30, 31)
  - **Blocks**: None
  - **Blocked By**: Task 1 (Redis)

  **Acceptance Criteria**:
  - [ ] `src/lib/feature-flags/index.ts` with get/set/getAll
  - [ ] `/api/feature-flags` GET + POST handlers
  - [ ] Redis-backed with local cache
  - [ ] `vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Feature flags return defaults
    Tool: Bash (curl)
    Steps:
      1. GET /api/feature-flags
      2. Check response has all flags with boolean values
    Expected Result: All feature flags present
    Failure Indicators: Missing flags
    Evidence: .sisyphus/evidence/task-27-feature-flags.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-27-feature-flags.txt`

  **Commit**: YES
  - Message: `feat(flags): Redis-backed feature flag system`

- [x] 28. CDN + image optimization (Vercel Edge, lazy loading, preconnect)

  **What to do**:
  - Configure Vercel Edge caching headers for static assets
  - Add `loading="lazy"` to all artist images and non-critical images
  - Add `width` and `height` to all images to prevent layout shift (CLS)
  - Add `preconnect` and `dns-prefetch` hints in layout.tsx for:
    - `https://api.spotify.com`
    - `https://accounts.spotify.com`
    - `https://generativelanguage.googleapis.com` (Gemini API)
    - Upstash Redis REST URL
    - Neon database URL
  - Add `next/image` configuration for remote Spotify CDN images
  - Configure `public/` folder for static assets (fonts, icons)
  - Verify: Lighthouse issues for image/network optimization resolved

  **Must NOT do**:
  - Do NOT use any CDN that requires payment (Vercel Edge is included)
  - Do NOT preconnect to all origins (only the 4-5 critical ones)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Configuration optimization — image attributes, preconnect hints, caching headers.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 5 (with Tasks 27, 29, 30, 31)
  - **Blocks**: None
  - **Blocked By**: Tasks 21-26 (images exist to optimize)

  **Acceptance Criteria**:
  - [ ] All images have `loading="lazy"` + `width` + `height`
  - [ ] Preconnect hints added for 4-5 critical origins
  - [ ] Vercel Edge caching configured
  - [ ] `next/image` configured for Spotify CDN
  - [ ] Lighthouse CLS score ≤ 0.1

  **QA Scenarios**:
  ```
  Scenario: Images have lazy loading and dimensions
    Tool: Playwright
    Steps:
      1. Query all img elements
      2. Check each has loading="lazy" attribute
      3. Check each has width and height attributes
    Expected Result: All images optimized
    Failure Indicators: Missing attributes
    Evidence: .sisyphus/evidence/task-28-image-optimization.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-28-image-optimization.txt`

  **Commit**: YES (groups with Tasks 29)
  - Message: `perf(cdn): CDN optimization, image lazy loading, preconnect hints`

- [x] 29. Performance optimization — Lighthouse 90+ target

  **What to do**:
  - Run Lighthouse audit and compare with baseline (Task 6 if exists, or fresh)
  - Target: 90+ Performance, 90+ Accessibility, 90+ Best Practices on desktop
  - Performance fixes:
    - Code-split all heavy components (Galaxy, Recharts charts, heatmap)
    - Dynamic import for Three.js, framer-motion heavy animations
    - Add `preload` for critical fonts (Inter, Outfit)
    - Reduce render-blocking CSS (inline critical CSS)
    - Optimize bundle: check for duplicate dependencies
    - Enable `next.config.ts` `experimental.optimizePackageImports`
    - Remove unused CSS variables and Tailwind classes
  - Verify final Lighthouse scores and compare to baseline
  - Document improvements

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Systematic performance optimization — bundle analysis, code splitting, Lighthouse.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 5 (with Tasks 27, 28, 30, 31)
  - **Blocks**: None
  - **Blocked By**: Tasks 21-26 (features must exist to optimize)

  **Acceptance Criteria**:
  - [ ] Lighthouse Performance ≥ 90 (desktop)
  - [ ] Lighthouse Accessibility ≥ 90 (desktop)
  - [ ] Lighthouse Best Practices ≥ 90 (desktop)
  - [ ] All heavy components dynamically imported
  - [ ] Bundle optimization configured
  - [ ] Scores documented and compared to baseline

  **QA Scenarios**:
  ```
  Scenario: Lighthouse scores meet targets
    Tool: Bash
    Steps:
      1. Run Lighthouse on landing page (desktop)
      2. Check Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90
    Expected Result: All scores meet targets
    Failure Indicators: Any score below 90
    Evidence: .sisyphus/evidence/task-29-lighthouse-final.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-29-lighthouse-final.txt`

  **Commit**: YES (groups with Task 28)
  - Message: `perf(perf): performance optimization — Lighthouse 90+ across all metrics`

- [x] 30. Accessibility pass (keyboard, ARIA, color contrast)

  **What to do**:
  - Keyboard navigation audit:
    - All interactive elements Tab-reachable
    - Visible focus indicators (custom neon focus ring)
    - Sheets/dialogs: focus trap, Escape closes
    - Galaxy: keyboard controls documented
  - ARIA labels:
    - Icon-only buttons get `aria-label`
    - Nav: `<nav aria-label="Main">`
    - Sheets/dialogs: `aria-labelledby`, `aria-describedby`
    - Galaxy canvas: `role="img"` with `aria-label`
    - SVG annotations: `aria-hidden="true"` with text alternatives
  - Color contrast:
    - Verify neon colors on dark backgrounds meet WCAG AA (4.5:1)
    - Adjust any failing combinations
  - `prefers-reduced-motion`: all framer-motion animations respect it
  - Run Lighthouse accessibility audit before/after
  - Write Playwright tests: keyboard navigation, ARIA presence

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Systematic accessibility audit — keyboard, ARIA, contrast across entire app.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 5 (with Tasks 27, 28, 29, 31)
  - **Blocks**: None
  - **Blocked By**: Tasks 21-26 (UI components must exist)

  **Acceptance Criteria**:
  - [ ] All interactive elements keyboard-reachable with focus indicators
  - [ ] All icon-only buttons have `aria-label`
  - [ ] Sheets/dialogs have proper ARIA
  - [ ] Galaxy has `role="img"` + `aria-label`
  - [ ] Color contrast passes WCAG AA
  - [ ] Lighthouse Accessibility ≥ 90
  - [ ] `vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Keyboard navigation works
    Tool: Playwright
    Steps:
      1. Tab through landing page
      2. Check focus moves through all interactive elements
      3. Check focus ring is visible
      4. Tab to hamburger → Enter opens sheet
      5. Escape closes sheet
    Expected Result: Full keyboard navigation
    Failure Indicators: Tab skips elements
    Evidence: .sisyphus/evidence/task-30-keyboard.txt

  Scenario: ARIA labels present on icon buttons
    Tool: Playwright
    Steps:
      1. Query all buttons without visible text
      2. Check each has aria-label
    Expected Result: All icon buttons labeled
    Failure Indicators: Missing labels
    Evidence: .sisyphus/evidence/task-30-aria.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-30-keyboard.txt`
  - [ ] `.sisyphus/evidence/task-30-aria.txt`

  **Commit**: YES (groups with Tasks 31)
  - Message: `fix(a11y): accessibility pass — keyboard, ARIA labels, color contrast`

- [x] 31. Responsive design pass

  **What to do**:
  - Test and fix at 3 breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)
  - Landing page: hero stacks, archetype cards 1→2→3 columns, nav adapts
  - Dashboard: bento grid 1→2→3 columns, sections stack, charts resize
  - Galaxy: responsive canvas sizing, controls adapt
  - All touch targets ≥ 44×44px on mobile
  - No horizontal overflow at any breakpoint
  - Write Playwright tests at each breakpoint

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Systematic responsive testing and fixes across all components.
  - **Skills**: `[]`

  **Parallelization**:
  - **Parallel Group**: Wave 5 (with Tasks 27, 28, 29, 30)
  - **Blocks**: None
  - **Blocked By**: Tasks 21-26 (UI components must exist)

  **Acceptance Criteria**:
  - [ ] All breakpoints render without overflow
  - [ ] Touch targets ≥ 44×44px on mobile
  - [ ] Bento grid adapts (1→2→3 columns)
  - [ ] Nav adapts (hamburger → full)
  - [ ] Charts resize correctly
  - [ ] `vitest run` passes

  **QA Scenarios**:
  ```
  Scenario: Responsive at all breakpoints
    Tool: Playwright
    Steps:
      1. Set viewport 375x667 — check no overflow
      2. Set viewport 768x1024 — check 2-column grid
      3. Set viewport 1280x800 — check 3-column grid
    Expected Result: Layout adapts at each breakpoint
    Failure Indicators: Overflow, broken layout
    Evidence: .sisyphus/evidence/task-31-responsive.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-31-responsive.png`

  **Commit**: YES (groups with Task 30)
  - Message: `fix(responsive): responsive design pass across all breakpoints`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search for forbidden patterns. Check evidence files exist. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm build` + linter + `vitest run`. Review all changed files for quality issues (as any, empty catches, console.log, commented code, unused imports). Check AI slop patterns.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N/N] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute every QA scenario from every task. Test cross-task integration. Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 compliance. Check "Must NOT do" compliance. Detect cross-task contamination.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **1**: `infra(redis): set up Upstash Redis + multi-tier cache layer`
- **2**: `infra(db): set up Neon PostgreSQL + Drizzle ORM + schema migration`
- **3**: `infra(monitoring): set up Sentry + OpenTelemetry`
- **4**: `infra(queue): set up QStash + async worker scaffolding`
- **5**: `feat(cache): multi-tier cache strategy (hot/warm/cold)`
- **6**: `feat(rate-limit): Redis sliding window rate limiter`
- **7**: `feat(db): database schema — users, tracks, events, snapshots`
- **8**: `test(setup): Vitest + React Testing Library + Playwright`
- **9-31**: `type(scope): desc`

---

## Success Criteria

### Verification Commands
```bash
pnpm build                # Expected: Compiled successfully
pnpm vitest run           # Expected: All tests pass
curl http://localhost:3000/api/spotify/top-artists  # Expected: 200 + valid JSON
npx playwright test       # Expected: All E2E scenarios pass
```

### Final Checklist
- [x] All "Must Have" present and verified
- [x] All "Must NOT Have" absent
- [ ] Redis hot/warm/cold cache operational (verified via upstash CLI)
- [ ] QStash workers processing jobs (personality, analytics, embeddings)
- [ ] PostgreSQL schema applied with data
- [ ] Sentry capturing errors and traces
- [ ] pgvector embeddings generating and querying
- [x] All Vitest + Playwright tests pass
- [ ] Lighthouse 90+ Performance, 90+ Accessibility
- [ ] All evidence files in `.sisyphus/evidence/`
