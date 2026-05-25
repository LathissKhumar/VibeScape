# Infrastructure Setup Guide

This guide walks through setting up all infrastructure for Resona. The project uses **Supabase** as its single source of truth — PostgreSQL (with pgvector) for everything from data storage to caching, rate-limiting, and embeddings.

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Resona App                          │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │  Next.js  │  │  Drizzle  │  │  Edge Functions /     │  │
│  │  (server) │──│  (ORM)   │  │  API Routes (workers)  │  │
│  └─────┬────┘  └─────┬────┘  └───────────┬───────────┘  │
│        │              │                    │              │
│        └──────────────┴────────────────────┘              │
│                         │                                 │
│                         ▼                                 │
│              ┌──────────────────────┐                     │
│              │   Supabase Project   │                     │
│              │  (ikmpbfmattuecerbqrhe)                    │
│              │  ┌────────────────┐  │                     │
│              │  │  PostgreSQL    │  │  ← Data, cache,     │
│              │  │  + pgvector    │  │    embeddings, FLIP │
│              │  └────────────────┘  │    feature flags,   │
│              │                      │    rate limits      │
│              └──────────────────────┘                     │
│                                                          │
│  Optional Fallbacks (not needed with Supabase Postgres):  │
│  ┌──────────┐  ┌──────────┐                              │
│  │  Redis   │  │  QStash  │                              │
│  │ (Upstash)│  │          │                              │
│  └──────────┘  └──────────┘                              │
└──────────────────────────────────────────────────────────┘
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) installed
- A [Supabase](https://supabase.com/) account (free tier)
- A [Sentry](https://sentry.io/) account (free tier)

---

## Step 1: Supabase Project Setup

> **Already done.** Project ref: `ikmpbfmattuecerbqrhe`
>
> Dashboard: https://app.supabase.com/project/ikmpbfmattuecerbqrhe

If you need to create a new project:

1. Go to https://supabase.com/dashboard/projects
2. Click **New project**
3. Enter project name: `Resona`
4. Set a secure database password (save it!)
5. Choose a region close to you
6. Click **Create new project** (takes ~2 minutes)

---

## Step 2: Get Supabase Database Connection String

The `SUPABASE_DB_URL` (formerly `DATABASE_URL`) is the direct Postgres connection string used by Drizzle ORM for server-side queries, caching, rate-limiting, and embeddings.

1. In your Supabase dashboard, go to **Project Settings** → **Database**
2. Under **Connection string**, find the **URI** section
3. Click **Copy**

   It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.ikmpbfmattuecerbqrhe.supabase.co:5432/postgres
   ```

4. Paste it as `SUPABASE_DB_URL` in `.env.local`:
   ```
   SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.ikmpbfmattuecerbqrhe.supabase.co:5432/postgres
   ```

> ⚠️ **Important:** If you need to reuse the pooler connection (for serverless environments with connection limits), use the **Pooled** connection string from the **Connection pooler** section instead. For local development, the direct connection is fine.

---

## Step 3: Get Supabase API Keys

You need two keys: the **anon public** key (safe for browser) and the **service_role** key (server-side only).

1. In your Supabase dashboard, go to **Project Settings** → **API**
2. Under **Project API keys**, you'll find:

   | Key | Value | Used For |
   |-----|-------|----------|
   | `anon` public | `sb_publishable_***` | Browser client → `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
   | `service_role` (secret) | `eyJ...` | Server-side admin → `SUPABASE_SERVICE_ROLE_KEY` |

3. Copy each into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

> ⚠️ **Never expose `service_role` key** — it bypasses Row Level Security (RLS). Keep it server-side only.

---

## Step 4: Run SQL Migration

The migration creates all required tables: `users`, `tracks`, `events`, `snapshots`, `spotify_cache`, `embeddings`, `feature_flags`, plus the `find_similar_profiles` function.

1. Open the migration file to review what will be created:

   ```
   db/migrations/0000_supabase_setup.sql
   ```

2. In your Supabase dashboard, go to **SQL Editor**

3. Click **New query**

4. Open the file `db/migrations/0000_supabase_setup.sql` and copy its entire contents

5. Paste into the SQL Editor and click **Run** (or press `Cmd+Enter`)

6. Verify everything was created by running these queries in the SQL Editor:
   ```sql
   -- Check extensions
   SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

   -- Check tables
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';

   -- Check seed data
   SELECT key, value FROM feature_flags;
   ```

**Tables created** (7 total):

| Table | Purpose |
|-------|---------|
| `users` | Core user accounts (Spotify-linked) |
| `tracks` | Stored user listening data |
| `events` | Event/activity log |
| `snapshots` | Shareable snapshots for comparisons |
| `spotify_cache` | Cache tier (replaces Redis) |
| `embeddings` | pgvector embeddings for similarity search |
| `feature_flags` | Toggleable features |

---

## Step 5: Set Up Sentry (Error Tracking)

Resona uses Sentry for error monitoring on the free tier.

1. Go to https://sentry.io and sign in / create an account
2. Click **Create Project**
3. Choose **Next.js** as the platform
4. Give it a name (e.g., `resona-web`)
5. Click **Create Project**
6. In the project dashboard, go to **Settings** → **Client Keys (DSN)**
7. Copy the **DSN** value (looks like `https://[hash]@[org].ingest.sentry.io/[project]`)
8. Set it in `.env.local`:
   ```
   SENTRY_DSN=https://[hash]@[org].ingest.sentry.io/[project]
   SENTRY_TRACES_SAMPLE_RATE=0.1
   ```

> `SENTRY_TRACES_SAMPLE_RATE=0.1` means 10% of requests are traced — good balance for the free tier.

---

## Step 6: Generate Supabase Worker Secret

The `SUPABASE_WORKER_SECRET` is used for internal auth between Supabase Edge Functions and the main app. Generate a random string:

```bash
openssl rand -base64 32
```

Or use any secure random generator. Set it in `.env.local`:

```
SUPABASE_WORKER_SECRET=your-generated-random-secret
```

This secret must match between the app and any Edge Functions you deploy.

---

## Step 7: Update `.env.local`

After completing steps 1-6, your `.env.local` should look like this:

```env
# --- Existing (preserved) ---
SPOTIFY_CLIENT_ID=9238aefaa01b49c1a5d2d3168bc6e93d
SPOTIFY_CLIENT_SECRET=c3f290f47331492e879bce339c2531fb
NEXT_PUBLIC_SUPABASE_URL=https://ikmpbfmattuecerbqrhe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_jOPoDp4qtlB--DRrQ3PBgw_IkqO9NxP
GEMINI_API_KEY=AIzaSyC-1hrU8n21yp82Wd6TTZv_2ctnUfOYeZA
NEXTAUTH_SECRET=F8b3rhtSgzjmeArxQzdJK84RQ2QFxjnxEa8yhMTSMk0=
NEXTAUTH_URL=http://localhost:3000

# --- New (fill these in) ---
SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.ikmpbfmattuecerbqrhe.supabase.co:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_WORKER_SECRET=your-generated-random-secret
SENTRY_DSN=https://[hash]@[org].ingest.sentry.io/[project]
SENTRY_TRACES_SAMPLE_RATE=0.1
```

If you haven't yet, also fill in:
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` from your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/)
- `NEXTAUTH_SECRET` (run `openssl rand -base64 32`)

---

## Step 8: Verify the Setup

Run these commands to confirm everything works:

```bash
# 1. Build — catches missing env vars at compile time
pnpm build

# 2. Tests — confirms database connectivity and query correctness
pnpm vitest run
```

If the build fails with missing env vars, double-check that all variables in `.env.example` are present in `.env.local`.

---

## Optional: Configure Redis / QStash Fallbacks

These are **not required** — Supabase Postgres replaces Redis (via the `spotify_cache` table) and Supabase workers replace QStash. But if you want to use them as a hot cache layer or external queue system:

**Upstash Redis** (optional cache tier):
1. Create an account at https://upstash.com
2. Create a Redis database (free tier)
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

**QStash** (optional async messaging):
1. From your Upstash dashboard, navigate to QStash
2. Create a new topic/queue
3. Enable in `.env.local`:
   ```
   QSTASH_ENABLED=true
   QSTASH_URL=https://qstash.upstash.io/...
   QSTASH_SIGNING_KEY=your-signing-key
   ```

---

## Reference: Environment Variables Summary

| Variable | Required | Source | Notes |
|----------|----------|--------|-------|
| `SPOTIFY_CLIENT_ID` | ✅ | Spotify Dev Dashboard | |
| `SPOTIFY_CLIENT_SECRET` | ✅ | Spotify Dev Dashboard | |
| `GEMINI_API_KEY` | ✅ | Google AI Studio | |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Settings → API | Safe for browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase Settings → API | Safe for browser |
| `SUPABASE_DB_URL` | ✅ | Supabase Settings → Database | Server-only |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase Settings → API | Server-only |
| `SUPABASE_WORKER_SECRET` | ✅ | Self-generated | Must match Edge Functions |
| `NEXTAUTH_SECRET` | ✅ | Self-generated | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Local env | `http://localhost:3000` for dev |
| `SENTRY_DSN` | ✅ | Sentry project settings | |
| `SENTRY_TRACES_SAMPLE_RATE` | ✅ | Configured | `0.1` recommended |
| `OTEL_ENABLED` | ❌ | Configured | Defaults to `false` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | ❌ | OTEL collector | |
| `UPSTASH_REDIS_REST_URL` | ❌ | Upstash Dashboard | Fallback only |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ | Upstash Dashboard | Fallback only |
| `QSTASH_ENABLED` | ❌ | Configured | Defaults to `false` |
| `QSTASH_URL` | ❌ | QStash Dashboard | Fallback only |
| `QSTASH_SIGNING_KEY` | ❌ | QStash Dashboard | Fallback only |

---

## Troubleshooting

### "Cannot find module" or build fails
```bash
pnpm install
```

### Supabase connection refused
- Verify the password in `SUPABASE_DB_URL` is correct
- Check that your IP is not blocked (Supabase free tier allows all IPs by default)
- Ensure the project isn't paused (free tier projects pause after 1 week of inactivity — restart in dashboard)

### Migration SQL errors
- If a table already exists, the `IF NOT EXISTS` clauses will prevent errors
- If `pgvector` extension fails to install, ensure it's enabled in your Supabase project: **Project Settings** → **Add-ons** → **pgvector**

### Sentry not reporting
- Verify `SENTRY_DSN` is correct
- Check that `sentry.client.config.ts` or `next.config.js` has Sentry configured
- Confirm the project platform is set to **Next.js**
