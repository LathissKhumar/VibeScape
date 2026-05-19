// Minimal, build-safe embedding scaffolding for pgvector usage.
// - Provides helper to compute a deterministic "profile" vector from genres/top artists (simple hashed floats)
// - Exposes a placeholder function `upsertEmbedding` that will persist to Postgres when db present

import { db } from "./db";
import crypto from "crypto";

// Simple deterministic pseudo-embedding: hash genre/artist strings to floats in [-1,1]
function strToFloatVec(input: string[], dim = 64) {
  const vec: number[] = new Array(dim).fill(0);
  for (let i = 0; i < input.length; i++) {
    const s = input[i] || "";
    const h = crypto.createHash("sha256").update(s).digest();
    for (let j = 0; j < dim; j++) {
      const byte = h[j % h.length];
      const val = (byte / 255) * 2 - 1; // map 0..255 to -1..1
      vec[j] += val / (i + 1);
    }
  }
  // normalize
  const mag = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0)) || 1;
  return vec.map((v) => v / mag);
}

export async function upsertEmbedding(entityType: string, entityId: string, vector: number[]) {
  if (!db) return { ok: false, reason: "no-db" };
  try {
    type RawDb = { execute?: (sql: string, params?: unknown[]) => Promise<any> };
    const rawDb = db as unknown as RawDb;
    // Ensure pgvector extension and embeddings table are created externally. Insert or update the vector column (assumes pgvector type)
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

export function computeProfileEmbedding(genres: string[], topArtists: string[], dim = 64) {
  // Merge genres and artist strings into a single vector
  const input = [...genres.slice(0, 10), ...topArtists.slice(0, 10)];
  return strToFloatVec(input, dim);
}

export default { computeProfileEmbedding, upsertEmbedding };
