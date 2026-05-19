import { Sentry } from "./sentry";
type SentryLike = { captureMessage?: (msg: string) => void } | {};
import coreCache from "./cache";

// Minimal observability helpers

export async function recordCacheHit(key: string) {
  // Increment a Sentry metric when available; if not, log for now
  try {
    const s = Sentry as unknown as { captureMessage?: (msg: string) => void } | null;
    if (s && typeof s.captureMessage === "function") {
      // Sentry doesn't have a direct custom metric API here; use breadcrumb or captureMessage for minimal scaffolding
      s.captureMessage(`cache:hit ${key}`);
    } else {
      // eslint-disable-next-line no-console
      console.debug("cache hit", key);
    }
  } catch (err) {
    // ignore
  }
}

export async function recordCacheMiss(key: string) {
  try {
    const s = Sentry as unknown as { captureMessage?: (msg: string) => void } | null;
    if (s && typeof s.captureMessage === "function") {
      s.captureMessage(`cache:miss ${key}`);
    } else {
      // eslint-disable-next-line no-console
      console.debug("cache miss", key);
    }
  } catch (err) {
    // ignore
  }
}

export async function cacheHitRatio(namespacePrefix = ""): Promise<{ hits: number; misses: number; ratio: number } | null> {
  // Minimal implementation: scan Redis keys with the prefix and count hits/misses
  try {
    // If coreCache is not configured, return null
    const c: any = coreCache;
    if (!c) return null;

    // This is a best-effort, not exact: assumes Redis provides keys and a convention for hit/miss counters.
    // For now, return null to indicate metric collection is not implemented fully.
    return null;
  } catch (err) {
    return null;
  }
}

export default { recordCacheHit, recordCacheMiss, cacheHitRatio };
