import coreCache from "../cache";

type FlagValue = boolean;

const PREFIX = "feature_flag:";

// in-memory fallback for environments without Redis/DB
const localStore: Record<string, FlagValue> = {};

export const featureFlags = {
  async get(key: string, defaultValue = false): Promise<FlagValue> {
    const cacheKey = PREFIX + key;
    // Try cache layer
    try {
      const v = await coreCache.get<FlagValue>(cacheKey);
      if (v !== null && typeof v !== "undefined") return Boolean(v);
    } catch (e) {
      // ignore and fall through to local
    }

    // local fallback
    if (key in localStore) return localStore[key]!;
    return defaultValue;
  },

  async set(key: string, value: FlagValue): Promise<boolean> {
    const cacheKey = PREFIX + key;
    try {
      // store in cache hot+warm via coreCache.set
      await coreCache.set<FlagValue>(cacheKey, value, { ex: 60 * 60 * 24 * 7 }); // 7d
    } catch (e) {
      // ignore
    }

    // update local fallback as well
    localStore[key] = Boolean(value);
    return true;
  },

  async getAll(): Promise<Record<string, FlagValue>> {
    const result: Record<string, FlagValue> = {};
    // Attempt to list keys via Redis if available
    try {
      // coreCache relies on redis client for keys; import redis client directly
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { cache: redisCache } = require("../cache/redis");
      if (redisCache && typeof redisCache.keys === "function") {
        const keys: string[] = await redisCache.keys(`${PREFIX}*`);
        for (const k of keys) {
          try {
            const v = await redisCache.get(k);
            const short = k.replace(PREFIX, "");
            result[short] = Boolean(v);
          } catch (e) {
            // ignore per-key
          }
        }
        // merge localStore entries not present
        for (const k of Object.keys(localStore)) {
          if (!(k in result)) result[k] = localStore[k]!;
        }
        return result;
      }
    } catch (e) {
      // ignore
    }

    // fallback: return local store
    return { ...localStore };
  },
};

export default featureFlags;
