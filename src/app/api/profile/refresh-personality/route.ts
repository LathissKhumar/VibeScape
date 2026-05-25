import { NextResponse } from "next/server";
import { analyzePersonality } from "@/lib/gemini";
import coreCache from "@/lib/cache";
import { userPersonalityKey } from "@/lib/cache/keys";
import type { SpotifyArtist, SpotifyTrack, SpotifyAudioFeatures } from "@/lib/spotify";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { userId, topArtists, topTracks, audioFeatures } = body as {
    userId?: string;
    topArtists?: SpotifyArtist[];
    topTracks?: SpotifyTrack[];
    audioFeatures?: (SpotifyAudioFeatures | null)[];
  };

  if (!Array.isArray(topArtists)) {
    return NextResponse.json({ ok: false, error: "missing topArtists" }, { status: 400 });
  }

  try {
    const result = await analyzePersonality(
      topArtists,
      (topTracks ?? []) as SpotifyTrack[],
      audioFeatures ?? []
    );

    if (userId) {
      const cacheKey = userPersonalityKey(userId);
      await coreCache.set(cacheKey, result, { ex: 86_400 });
    }

    return NextResponse.json({ ok: true, personality: result }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
