import type { Redis as UpstashRedis } from "@upstash/redis";
let client: UpstashRedis | null = null;

// Lazy init so importing this module doesn't throw when env is missing
function initClient() {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_TOKEN;

  if (!url || !token) {
    // Redis not configured — keep client null for graceful degradation
    return null;
  }

  // Import at runtime to avoid hard dependency during environments that don't need Redis
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Redis } = require("@upstash/redis");
  client = new Redis({ url, token });
  return client;
}

// Ensure client is attempted to be initialized on module load, but allow missing env
initClient();

export type CacheValue<T> = T | null;

export const cache = {
  async get<T = unknown>(key: string): Promise<CacheValue<T>> {
    const c = initClient();
    if (!c) return null;
    try {
      const res = await c.get(key);
      // Upstash returns null if not found; when present it returns string or parsed JSON
      return res as T | null;
    } catch (err) {
      // Graceful degradation: log and return null
      // eslint-disable-next-line no-console
      console.warn("Redis GET failed:", err);
      return null;
    }
  },

  async set<T = unknown>(key: string, value: T, opts?: { ex?: number }): Promise<boolean> {
    const c = initClient();
    if (!c) return false;
    try {
      if (opts?.ex) {
        await c.set(key, value as any, { ex: opts.ex });
      } else {
        await c.set(key, value as any);
      }
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Redis SET failed:", err);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    const c = initClient();
    if (!c) return false;
    try {
      await c.del(key);
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Redis DEL failed:", err);
      return false;
    }
  },

  async exists(key: string): Promise<boolean> {
    const c = initClient();
    if (!c) return false;
    try {
      // Upstash doesn't provide EXISTS directly on the JS client; emulate with GET
      const res = await c.get(key);
      return res !== null && typeof res !== "undefined";
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Redis EXISTS failed:", err);
      return false;
    }
  },

  async keys(pattern: string): Promise<string[]> {
    const c = initClient();
    if (!c) return [];
    try {
      // Upstash supports the KEYS command via `keys` method
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const res: string[] = await c.keys(pattern);
      return res || [];
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Redis KEYS failed:", err);
      return [];
    }
  },
};

export const redisClient = client;
