import { computeProfileEmbedding } from "../../lib/embeddings-core";
import { upsertEmbedding } from "../../lib/embeddings";

interface EmbeddingPayload {
  entityType: string;
  entityId: string;
  genres: string[];
  topArtists: string[];
}

export default async function handleEmbeddingJob(payload: unknown) {
  const { entityType, entityId, genres, topArtists } = payload as EmbeddingPayload;

  if (!entityType || !entityId) {
    throw new Error("Invalid embedding job payload: missing entityType or entityId");
  }

  const vector = computeProfileEmbedding(genres ?? [], topArtists ?? []);
  await upsertEmbedding(entityType, entityId, vector);
}
