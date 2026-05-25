import { analyzePersonality } from "../../lib/gemini";
import coreCache from "../../lib/cache";
import { userPersonalityKey } from "../../lib/cache/keys";
import type { SpotifyArtist, SpotifyTrack, SpotifyAudioFeatures } from "../../lib/spotify";
import type { Personality } from "@/types/next-auth";

interface PersonalityPayload {
  userId: string;
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  audioFeatures: (SpotifyAudioFeatures | null)[];
}

export default async function handlePersonalityJob(payload: unknown) {
  const { userId, topArtists, topTracks, audioFeatures } = payload as PersonalityPayload;

  if (!userId || !Array.isArray(topArtists)) {
    throw new Error("Invalid personality job payload: missing userId or topArtists");
  }

  const result: Personality = await analyzePersonality(topArtists, topTracks, audioFeatures ?? []);

  const cacheKey = userPersonalityKey(userId);
  await coreCache.set(cacheKey, result, { ex: 86_400 });
}
