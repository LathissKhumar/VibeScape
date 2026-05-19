import { redisClient } from "./cache/redis";

// Define a minimal interface for the redis client methods we use.
interface RedisLike {
  zadd?: (key: string, score: number | string, member: string) => Promise<any>;
  zAdd?: (key: string, score: number | string, member: string) => Promise<any>;
  zremrangebyscore?: (key: string, min: number | string, max: number | string) => Promise<any>;
  zRemRangeByScore?: (key: string, min: number | string, max: number | string) => Promise<any>;
  zcard?: (key: string) => Promise<number> | Promise<string>;
  zCard?: (key: string) => Promise<number> | Promise<string>;
  expire?: (key: string, seconds: number) => Promise<any>;
  expireat?: (key: string, epoch: number) => Promise<any>;
}

/**
 * Sliding-window rate limiter using Redis sorted sets.
 * - key: unique identifier per actor (e.g., ip:route or user:id)
 * - limit: max events allowed in window
 * - windowSec: window size in seconds
 *
 * Returns: { allowed, remaining, reset }
 * - allowed: boolean whether the action is allowed
 * - remaining: number of remaining allowed events in current window
 * - reset: epoch seconds when the window will reset
 *
 * Graceful degradation: when Redis is not configured, the limiter always allows
 * requests (returns allowed: true) to avoid blocking functionality.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<{ allowed: boolean; remaining: number; reset: number }>
{
  const client = (redisClient as unknown) as RedisLike | null;
  if (!client) {
    // Redis not configured — do not block
    return { allowed: true, remaining: limit, reset: Math.floor(Date.now() / 1000) + windowSec };
  }

  const now = Date.now();
  const windowStart = now - windowSec * 1000;
  const member = `${now}-${Math.random().toString(36).slice(2)}`;

  try {
    // Add current event with score = timestamp
    // Upstash/redis clients typically expose zadd/zremrangebyscore/zcard/expire
    // Use any-calls to avoid static type issues if methods are not present.
    if (client.zadd) {
      await client.zadd(key, now, member);
    } else if (client.zAdd) {
      await client.zAdd(key, now, member);
    }

    // Remove old entries
    if (client.zremrangebyscore) {
      await client.zremrangebyscore(key, 0, windowStart);
    } else if (client.zRemRangeByScore) {
      await client.zRemRangeByScore(key, 0, windowStart);
    }

    // Count current members
    let rawCount: number | string | undefined = undefined;
    if (client.zcard) {
      rawCount = await client.zcard(key);
    } else if (client.zCard) {
      rawCount = await client.zCard(key);
    }
    const count = rawCount ? Number(rawCount) : 0;

    // Ensure key expires after window to avoid unbounded growth
    if (client.expire) {
      await client.expire(key, windowSec);
    } else if (client.expireat) {
      await client.expireat(key, Math.floor((now + windowSec * 1000) / 1000));
    }

    const allowed = count <= limit;
    const remaining = Math.max(0, limit - count);
    const reset = Math.floor((now + windowSec * 1000) / 1000);

    return { allowed, remaining, reset };
  } catch (err) {
    // On any Redis error, degrade to allow
    // eslint-disable-next-line no-console
    console.warn("rateLimit redis error:", err);
    return { allowed: true, remaining: limit, reset: Math.floor(Date.now() / 1000) + windowSec };
  }
}

export default rateLimit;
