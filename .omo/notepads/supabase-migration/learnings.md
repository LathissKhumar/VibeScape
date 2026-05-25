# Supabase Migration - Learnings

- Migration file `db/migrations/0000_supabase_setup.sql` already existed at time of task
- It combines all infrastructure into single Supabase Postgres backend: core schema (users, tracks, events, snapshots) + spotify_cache (with expires_at) + embeddings (pgvector) + feature_flags
- The spotify_cache table has `expires_at timestamptz` which enables client-side expiry filtering
- `0000` prefix ensures it runs before `0001_create_core_schema.sql` alphabetically
- Uses `CREATE TABLE IF NOT EXISTS` so safe to run alongside existing `0001` migration (0001's tables will be no-ops if 0000 runs first)

## Cache Layer Simplification (multi-tier → single-tier)

- Rewrote `src/lib/cache/index.ts` from multi-tier (Redis hot + Postgres warm + cold) to single Supabase Postgres primary with optional Redis fallback
- `getSupabase()` uses lazy dynamic `import("@/lib/supabase")` so the cache module never throws at import time even when Supabase env vars are missing — graceful degradation
- Expired cache rows are filtered client-side: `get` checks `data.expires_at === null || new Date(data.expires_at) > new Date()` before returning; expired rows are treated as misses
- `isRedisConfigured()` checks `UPSTASH_REDIS_REST_URL || REDIS_REST_URL` env vars to decide whether to attempt Redis fallback
- Redis is now purely opportunistic — writes happen for backward compatibility but don't block Supabase operations
- No new npm dependencies added
- Build passes, all 22 cache tests pass
- `redis.ts` left unchanged (already had lazy init + graceful degradation)
- `cold.ts` left as-is (placeholder)
