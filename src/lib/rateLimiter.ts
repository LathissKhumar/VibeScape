import type { SupabaseClient } from "@supabase/supabase-js";
import { redisClient } from "./cache/redis";

// ---------- Lazy Supabase client ----------
// We avoid importing supabase.ts directly because it throws at module level
// when env vars are missing. Instead we lazy-init here with graceful handling.
let _supabase: SupabaseClient | undefined | null = null;
function getSupabase(): SupabaseClient | undefined | null {
  if (_supabase !== null) return _supabase;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    _supabase = undefined;
    return undefined;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createClient } = require("@supabase/supabase-js");
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return _supabase;
  } catch {
    _supabase = undefined;
    return undefined;
  }
}

// ---------- Types ----------
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

// ---------- Redis helpers (fallback) ----------
interface RedisLike {
  zadd?: (key: string, score: number | string, member: string) => Promise<unknown>;
  zAdd?: (key: string, score: number | string, member: string) => Promise<unknown>;
  zremrangebyscore?: (key: string, min: number | string, max: number | string) => Promise<unknown>;
  zRemRangeByScore?: (key: string, min: number | string, max: number | string) => Promise<unknown>;
  zcard?: (key: string) => Promise<number> | Promise<string>;
  zCard?: (key: string) => Promise<number> | Promise<string>;
  expire?: (key: string, seconds: number) => Promise<unknown>;
  expireat?: (key: string, epoch: number) => Promise<unknown>;
}

function getRedisClient(): RedisLike | null {
  return (redisClient as unknown) as RedisLike | null;
}

async function rateLimitWithRedis(
  client: RedisLike,
  key: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowSec * 1000;
  const member = `${now}-${Math.random().toString(36).slice(2)}`;

  if (client.zadd) {
    await client.zadd(key, now, member);
  } else if (client.zAdd) {
    await client.zAdd(key, now, member);
  }

  if (client.zremrangebyscore) {
    await client.zremrangebyscore(key, 0, windowStart);
  } else if (client.zRemRangeByScore) {
    await client.zRemRangeByScore(key, 0, windowStart);
  }

  let rawCount: number | string | undefined;
  if (client.zcard) {
    rawCount = await client.zcard(key);
  } else if (client.zCard) {
    rawCount = await client.zCard(key);
  }
  const count = rawCount ? Number(rawCount) : 0;

  if (client.expire) {
    await client.expire(key, windowSec);
  } else if (client.expireat) {
    await client.expireat(key, Math.floor((now + windowSec * 1000) / 1000));
  }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: Math.floor((now + windowSec * 1000) / 1000),
  };
}

// ---------- Supabase Postgres helpers (primary) ----------
async function rateLimitWithSupabase(
  supabase: SupabaseClient,
  key: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  // Use RPC (atomic, requires increment_rate_limit function to exist)
  // If RPC fails, throw so the caller falls through to Redis fallback
  const { data, error } = await supabase.rpc("increment_rate_limit", {
    p_key: key,
    p_window_sec: windowSec,
  });

  if (error || !data || data.length === 0) {
    throw error ?? new Error("RPC returned no data");
  }

  const row = data[0]!;
  const dbCount = row.count ?? 0;
  const dbWindowStart = row.window_start;
  const dbWindowSec = row.window_sec ?? windowSec;
  const windowStartMs = new Date(dbWindowStart).getTime();
  const resetAt = Math.floor(windowStartMs / 1000) + dbWindowSec;

  return {
    allowed: dbCount <= limit,
    remaining: Math.max(0, limit - dbCount),
    reset: resetAt,
  };
}

// ---------- In-memory fallback (dev / no-DB) ----------
const memStore = new Map<string, { count: number; windowStart: number; windowSec: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memStore) {
    if (now - entry.windowStart > entry.windowSec * 1000) {
      memStore.delete(key);
    }
  }
}, 60_000).unref();

function rateLimitInMemory(key: string, limit: number, windowSec: number): RateLimitResult {
  const now = Date.now();
  let entry = memStore.get(key);

  if (!entry || now - entry.windowStart > entry.windowSec * 1000) {
    entry = { count: 1, windowStart: now, windowSec };
    memStore.set(key, entry);
    return { allowed: true, remaining: limit - 1, reset: Math.floor(now / 1000) + windowSec };
  }

  entry.count++;
  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    reset: Math.floor(entry.windowStart / 1000) + windowSec,
  };
}

// ---------- Main export ----------
/**
 * Rate limiter with 3-tier fallback:
 * 1. Supabase Postgres RPC (atomic, primary)
 * 2. Redis sorted sets (approximate, for multi-instance deployments)
 * 3. In-memory Map (process-local, always available)
 *
 * The in-memory tier ensures the app functions even without
 * database migrations applied or Redis configured.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  // Tier 1: Supabase Postgres (atomic RPC)
  const supabase = getSupabase();
  if (supabase) {
    try {
      return await rateLimitWithSupabase(supabase as SupabaseClient, key, limit, windowSec);
    } catch (err) {
      console.warn("rateLimit supabase error:", err);
    }
  }

  // Tier 2: Redis (approximate, multi-instance)
  const redis = getRedisClient();
  if (redis) {
    try {
      return await rateLimitWithRedis(redis, key, limit, windowSec);
    } catch (err) {
      console.warn("rateLimit redis error:", err);
    }
  }

  // Tier 3: In-memory (process-local, always available)
  return rateLimitInMemory(key, limit, windowSec);
}

export default rateLimit;
