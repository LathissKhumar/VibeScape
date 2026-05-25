export { computeProfileEmbedding } from "./embeddings-core";

export async function upsertEmbedding(entityType: string, entityId: string, vector: number[]) {
  try {
    const { db } = await import("./db");
    if (!db) return { ok: false, reason: "no-db" };
    type RawDb = { execute?: (sql: string, params?: unknown[]) => Promise<unknown> };
    const rawDb = db as unknown as RawDb;
    const vecStr = JSON.stringify(vector);
    await rawDb.execute?.(
      "INSERT INTO embeddings (entity_type, entity_id, vector, created_at) VALUES ($1, $2, $3, now()) ON CONFLICT (entity_type, entity_id) DO UPDATE SET vector = $3, created_at = now()",
      [entityType, entityId, vecStr]
    );
    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("upsertEmbedding error", err);
    return { ok: false, reason: String(err) };
  }
}

export default { computeProfileEmbedding: (g: string[], a: string[], d?: number) => import("./embeddings-core").then(m => m.computeProfileEmbedding(g, a, d)), upsertEmbedding };
