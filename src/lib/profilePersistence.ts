import { supabase } from "./supabase";
import { computeProfileEmbedding, upsertEmbedding } from "./embeddings";

export interface UserProfile {
  email?: string;
  name?: string;
  genres: string[];
  topArtists: string[];
}

export async function persistUserProfile(profile: UserProfile): Promise<{ ok: boolean; reason?: string }> {
  try {
    const { error } = await supabase
      .from("users")
      .upsert({
        email: profile.email || null,
        name: profile.name || null,
        created_at: new Date().toISOString(),
      }, {
        onConflict: "email",
      });

    if (error) {
      return { ok: false, reason: error.message };
    }

    const vector = computeProfileEmbedding(profile.genres, profile.topArtists);

    const embeddingResult = await upsertEmbedding("user_profile", profile.email || "anonymous", vector);

    return embeddingResult;
  } catch (err) {
    return { ok: false, reason: String(err) };
  }
}

export async function fetchUserEmbedding(userId: string): Promise<number[] | null> {
  try {
    const { data, error } = await supabase
      .from("embeddings")
      .select("vector")
      .eq("entity_type", "user_profile")
      .eq("entity_id", userId)
      .single();

    if (error || !data) return null;

    return data.vector as number[];
  } catch {
    return null;
  }
}

export async function findSimilarUsers(userId: string, limit = 5): Promise<Array<{ entity_id: string; similarity: number }>> {
  try {
    const userVector = await fetchUserEmbedding(userId);
    if (!userVector) return [];

    const { data, error } = await supabase
      .rpc("find_similar_profiles", {
        query_vector: `[${userVector.join(",")}]`,
        match_threshold: 0.3,
        match_count: limit,
      });

    if (error || !data) return [];

    return data as Array<{ entity_id: string; similarity: number }>;
  } catch {
    return [];
  }
}

export default { persistUserProfile, fetchUserEmbedding, findSimilarUsers };
