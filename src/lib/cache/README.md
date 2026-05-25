## Cache layer

### Architecture (single-tier)

| Tier | Backend | Status |
|------|---------|--------|
| **Primary** | Supabase Postgres (`spotify_cache` table) | ✅ Active |
| **Fallback** | Redis (Upstash) via `redis.ts` | ✅ Optional — graceful degradation when env vars are set |
| **Cold** | Placeholder for long-term archival (S3, Glacier) | ❌ Not implemented |

The cache uses a **Supabase-first** strategy:
1. `get` queries `spotify_cache` on Supabase Postgres; if the row is expired or absent, it falls back to Redis.
2. `set` upserts into `spotify_cache` and opportunistically writes to Redis for backward compatibility.
3. `del` removes from `spotify_cache` and Redis.

Redis operations are purely opportunistic — if Redis env vars (`UPSTASH_REDIS_REST_URL` / `REDIS_REST_URL`) are not set, all Redis calls are silently skipped. If Supabase is not configured, operations degrade gracefully (returning `null` for `get`, `false` for `set`/`del`).

### Usage

```ts
import coreCache from '@/lib/cache';

await coreCache.get('key');
await coreCache.set('key', value, { ex: 3600 }); // 1-hour TTL
await coreCache.del('key');
```

### Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for primary cache) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (for primary cache) | Supabase anon key |
| `UPSTASH_REDIS_REST_URL` / `REDIS_REST_URL` | No | Redis fallback — omit to disable |
| `UPSTASH_REDIS_REST_TOKEN` / `REDIS_REST_TOKEN` | No | Redis fallback token |

### Table schema (`spotify_cache`)

```sql
CREATE TABLE spotify_cache (
  id text PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  data jsonb NOT NULL,
  expires_at timestamptz,
  updated_at timestamptz DEFAULT now() NOT NULL
);
```

Expired rows are filtered client-side: `get` checks `expires_at` and treats expired rows as cache misses. A periodic cleanup job can be scheduled via `pg_cron` or a cron-based Edge Function.
