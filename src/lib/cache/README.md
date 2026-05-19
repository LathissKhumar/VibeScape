Cache layer (hot/warm/cold)

Overview
- hot: Redis via src/lib/cache/redis.ts — low-latency, ephemeral cache
- warm: Postgres table `spotify_cache` — durable, used as fallback when hot misses occur
- cold: Placeholder for long-term archival (S3) — not implemented yet

Usage
- Import src/lib/cache/index.ts and use coreCache.get/set/del(key, value)

Env
- UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN (or REDIS_REST_URL/REDIS_REST_TOKEN)
- DATABASE_URL (optional — enables warm-tier persistence)

Notes
- Warm tier currently uses a minimal raw SQL path against `spotify_cache` table to avoid requiring Drizzle at build time. Replace with Drizzle queries when drizzle-orm is installed and configured.
