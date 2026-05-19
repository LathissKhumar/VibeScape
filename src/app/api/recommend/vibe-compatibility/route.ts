import { NextResponse } from "next/server";
import { computeVibeCompatibility } from "../../../../lib/recommend";
import rateLimit from "../../../../lib/rateLimiter";
import coreCache from "../../../../lib/cache";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { profileA, profileB } = body as {
    profileA?: { genres?: string[]; topArtists?: string[] };
    profileB?: { genres?: string[]; topArtists?: string[] };
  };

  if (!profileA || !profileB) {
    return NextResponse.json(
      { ok: false, error: "missing profileA and/or profileB" },
      { status: 400 },
    );
  }

  const normalizedA = {
    genres: Array.isArray(profileA.genres) ? profileA.genres : [],
    topArtists: Array.isArray(profileA.topArtists) ? profileA.topArtists : [],
  };

  const normalizedB = {
    genres: Array.isArray(profileB.genres) ? profileB.genres : [],
    topArtists: Array.isArray(profileB.topArtists) ? profileB.topArtists : [],
  };

  const rateKey = `recommend:vibe-comp:${request.headers.get("x-forwarded-for") || "anonymous"}`;
  const rl = await rateLimit(rateKey, 30, 60);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const cacheKey = `recommend:vibe-comp:${JSON.stringify(normalizedA)}:${JSON.stringify(normalizedB)}`;

  const cached = await coreCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached, { status: 200 });
  }

  const result = computeVibeCompatibility(normalizedA, normalizedB);
  const response = {
    ok: true,
    compatibility: result,
    profiles: {
      a: { genreCount: normalizedA.genres.length, artistCount: normalizedA.topArtists.length },
      b: { genreCount: normalizedB.genres.length, artistCount: normalizedB.topArtists.length },
    },
  };

  await coreCache.set(cacheKey, response, { ex: 300 });

  return NextResponse.json(response, { status: 200 });
}
