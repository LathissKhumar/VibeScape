# Infrastructure Setup Learnings

## Rate Limiter Rewrite (Supabase Postgres + Redis fallback)

### What was done
- Rewrote `src/lib/rateLimiter.ts` to use Supabase Postgres as primary backend
- Kept Redis sorted sets as optional fallback (when `UPSTASH_REDIS_REST_URL` is set)
- Created migration SQL at `db/migrations/0002_rate_limits.sql`

### Architecture
- **Two-tier Postgres approach**:
  1. Try `supabase.rpc('increment_rate_limit', ...)` first (atomic, uses `SELECT FOR UPDATE`)
  2. Fall back to Supabase table API (`from('rate_limits').select/insert/update`) if RPC function doesn't exist
- **Redis fallback**: same sliding-window sorted set approach as before
- **Ultimate fallback**: allow all requests (graceful degradation)

### Key design decisions
- Lazy-init Supabase client in rateLimiter.ts instead of importing from `@/lib/supabase.ts` (which throws at module level when env vars missing)
- The `increment_rate_limit` RPC function atomically handles: create, reset-on-expiry, and increment
- `reset` is computed as `window_start + window_sec` for Postgres path vs `now + windowSec` for Redis path

### Migration required
Run `db/migrations/0002_rate_limits.sql` in Supabase SQL editor to create:
1. `rate_limits` table (key PK, count, window_start, window_sec)
2. `increment_rate_limit(p_key, p_window_sec)` function
