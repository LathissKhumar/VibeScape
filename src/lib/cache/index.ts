import type { SupabaseClient } from "@supabase/supabase-js";
import { cache as redisCache } from "./redis";

export type CacheValue<T> = T | null;

function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_URL);
}

let _supabase: SupabaseClient | null | undefined = undefined;

async function getSupabase(): Promise<SupabaseClient | null | undefined> {
  if (_supabase !== undefined) return _supabase;
  try {
    const { supabase } = await import("@/lib/supabase");
    _supabase = supabase;
  } catch {
    _supabase = null;
  }
  return _supabase;
}

export const coreCache = {
  async get<T = unknown>(key: string): Promise<CacheValue<T>> {
    const sb = await getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb
          .from("spotify_cache")
          .select("data, expires_at")
          .eq("id", key)
          .single();

        if (!error && data) {
          if (data.expires_at === null || new Date(data.expires_at) > new Date()) {
            return data.data as T;
          }
        }
      } catch {
        // fall through
      }
    }

    if (isRedisConfigured()) {
      try {
        const hit = await redisCache.get<T>(key);
        if (hit !== null) return hit;
      } catch {
        // fall through
      }
    }

    return null;
  },

  async set<T = unknown>(key: string, value: T, opts?: { ex?: number }): Promise<boolean> {
    let supabaseOk = false;

    const sb = await getSupabase();
    if (sb) {
      try {
        const expiresAt = opts?.ex ? new Date(Date.now() + opts.ex * 1000).toISOString() : null;

        const { error } = await sb.from("spotify_cache").upsert(
          {
            id: key,
            user_id: null,
            data: value,
            expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );

        if (!error) supabaseOk = true;
      } catch {
        // fall through
      }
    }

    if (isRedisConfigured()) {
      try {
        await redisCache.set(key, value, { ex: opts?.ex });
        return true;
      } catch {
        // fall through
      }
    }

    return supabaseOk;
  },

  async del(key: string): Promise<boolean> {
    let supabaseOk = false;

    const sb = await getSupabase();
    if (sb) {
      try {
        const { error } = await sb.from("spotify_cache").delete().eq("id", key);
        if (!error) supabaseOk = true;
      } catch {
        // fall through
      }
    }

    if (isRedisConfigured()) {
      try {
        await redisCache.del(key);
        return true;
      } catch {
        // fall through
      }
    }

    return supabaseOk;
  },
};

export default coreCache;
