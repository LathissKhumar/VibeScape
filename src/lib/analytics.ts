// Minimal precompute / aggregation scaffolding.
// - Exposes a refreshMaterializedViews() that attempts to call DB refreshes when available
// - Provides a nightly worker handler scaffold (refreshNightly) that can be scheduled via QStash or cron

import { db } from "./db";
import { emitEvent } from "./events";

export async function refreshMaterializedViews() {
  if (!db) return { ok: false, reason: "no-db" };

  try {
    // Try raw SQL refresh to avoid tight Drizzle coupling. If Drizzle exposes a query builder for refresh, it can be used later.
    type RawDb = { execute?: (sql: string, params?: unknown[]) => Promise<any> };
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

export async function refreshNightly() {
  // Nightly aggregation worker scaffold
  const res = await refreshMaterializedViews();
  // Emit an event for downstream systems to pick up (e.g., cache warmers)
  await emitEvent("generic", { type: "nightly_refresh", result: res });
  return res;
}

export default { refreshMaterializedViews, refreshNightly };
