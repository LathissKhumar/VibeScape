import coreCache from "./cache";

// Minimal observability helpers
// Cache events use console.debug to avoid flooding Sentry quota.
// TODO: Replace console.debug with a proper metrics pipeline (e.g., OpenTelemetry
// counters or a dedicated analytics service) when observability infra matures.

export function recordCacheHit(key: string) {
  console.debug(`[Cache] HIT: ${key}`);
}

export function recordCacheMiss(key: string) {
  console.debug(`[Cache] MISS: ${key}`);
}

export async function cacheHitRatio(
  _namespacePrefix = "",
): Promise<{ hits: number; misses: number; ratio: number } | null> {
  // TODO: Implement cache hit ratio tracking via counters. Requires incrementing
  // counters in recordCacheHit/recordCacheMiss and querying them here. coreCache
  // is ephemeral and not suitable for aggregated metrics — consider using a
  // persistent store (e.g., Supabase row or Redis counter).
  return null;
}

export default { recordCacheHit, recordCacheMiss, cacheHitRatio };
