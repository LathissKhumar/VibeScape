// Minimal precompute / aggregation scaffolding.
// - Exposes a refreshMaterializedViews() that attempts to call DB refreshes when available
// - Provides a nightly worker handler scaffold (refreshNightly) that dispatches via the worker system

import { db } from "./db";
import { emitEvent } from "./events";
import { triggerWorker } from "./qstash";

export async function refreshMaterializedViews() {
  if (!db) return { ok: false, reason: "no-db" };

  try {
    // Try raw SQL refresh to avoid tight Drizzle coupling. If Drizzle exposes a query builder for refresh, it can be used later.
    type RawDb = { execute?: (sql: string, params?: unknown[]) => Promise<unknown> };
    const rawDb = db as unknown as RawDb;

    // Example: refresh a materialized view for user_analytics if it exists
    await rawDb.execute?.("REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS user_analytics_mv");
    await rawDb.execute?.("REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS genre_popularity_mv");

    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("refreshMaterializedViews error", err);
    return { ok: false, reason: String(err) };
  }
}

/**
 * Nightly aggregation worker. Dispatches an 'analytics' job through the worker system
 * so it runs asynchronously via the /api/workers endpoint or QStash.
 */
export async function refreshNightly() {
  const res = await triggerWorker("analytics");
  // Emit an event for downstream systems to pick up (e.g., cache warmers)
  await emitEvent("generic", { type: "nightly_refresh", result: res });
  return res;
}

export default { refreshMaterializedViews, refreshNightly };
