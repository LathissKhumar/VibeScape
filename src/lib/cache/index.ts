import { cache as redisCache } from "./redis";
import { db } from "../db";
// When Drizzle is available, import table helpers. Use try/catch to allow build-time safety.
let spotify_cache_table: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { pgTable, text, jsonb, timestamp } = require("drizzle-orm/pg-core");
  // Define minimal table shape for use by Drizzle queries if needed elsewhere.
  spotify_cache_table = pgTable("spotify_cache", {
    id: text("id").primaryKey(),
    user_id: text("user_id"),
    data: jsonb("data"),
    updated_at: timestamp("updated_at").defaultNow(),
  });
} catch (e) {
  // Drizzle not available at build time — keep null
}

// Multi-tier cache abstraction: hot (Redis), warm (Postgres), cold (placeholder)

export type CacheValue<T> = T | null;

export const coreCache = {
  // Try hot cache first (Redis). If miss, fall back to warm (Postgres) if available.
  async get<T = unknown>(key: string): Promise<CacheValue<T>> {
    // Hot
    try {
      const hot = await redisCache.get<T>(key);
      if (hot !== null) return hot;
    } catch (e) {
      // swallow — will try warm
    }

    // Warm: use Postgres table `spotify_cache` as a generic key-value store when available.
    try {
      if (!db) return null;
      const rawDb: any = db;

      // If Drizzle is available and table is defined, use it for typed queries.
      if (spotify_cache_table && rawDb.select) {
        const row = await rawDb.select().from(spotify_cache_table).where(spotify_cache_table.id.eq(key)).limit(1).execute?.();
        // Drizzle may return array or object depending on adapter
        if (Array.isArray(row) && row[0]) return row[0].data as T;
        if (row && row.data) return row.data as T;
      }

      // Fallback: raw SQL for environments without Drizzle or when table not defined
      const res = await rawDb.execute?.("SELECT data FROM spotify_cache WHERE id = $1 LIMIT 1", [key]);
      if (res && res.rows && res.rows[0]) return res.rows[0].data as T;
    } catch (e) {
      // noop
    }

    // Cold: not implemented yet — return null
    return null;
  },

  async set<T = unknown>(key: string, value: T, opts?: { ex?: number }): Promise<boolean> {
    // Set hot cache first
    try {
      await redisCache.set<T>(key, value, { ex: opts?.ex });
    } catch (e) {
      // ignore
    }

    // Also persist to warm cache (Postgres) when available
    try {
      if (!db) return true;

      const rawDb: any = db;
      if (spotify_cache_table && rawDb.insert) {
        await rawDb.insert(spotify_cache_table).values({ id: key, user_id: null, data: value }).onConflictDoUpdate({ target: spotify_cache_table.id, set: { data: value } }).execute?.();
        return true;
      }

      // Fallback raw SQL
      await rawDb.execute?.("INSERT INTO spotify_cache (id, user_id, data, updated_at) VALUES ($1, $2, $3, now()) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()", [key, null, value]);
    } catch (e) {
      // ignore
    }

    return true;
  },

  async del(key: string): Promise<boolean> {
    try {
      await redisCache.del(key);
    } catch (e) {
      // ignore
    }

    try {
      if (!db) return true;

      const rawDb: any = db;
      if (spotify_cache_table && rawDb.delete) {
        await rawDb.delete(spotify_cache_table).where(spotify_cache_table.id.eq(key)).execute?.();
        return true;
      }

      // Fallback raw SQL
      await rawDb.execute?.("DELETE FROM spotify_cache WHERE id = $1", [key]);
    } catch (e) {
      // ignore
    }

    return true;
  },
};

export default coreCache;
