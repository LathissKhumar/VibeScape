import { NextResponse } from "next/server";
import { getPersonalizedRecommendations } from "../../../../lib/recommend";
import rateLimit from "../../../../lib/rateLimiter";
import coreCache from "../../../../lib/cache";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { profile, candidates } = body as {
    profile?: { genres?: string[]; topArtists?: string[] };
    candidates?: { genres?: string[]; topArtists?: string[] };
  };

  if (!profile) {
    return NextResponse.json(
      { ok: false, error: "missing profile" },
      { status: 400 },
    );
  }

  const normalizedProfile = {
    genres: Array.isArray(profile.genres) ? profile.genres : [],
    topArtists: Array.isArray(profile.topArtists) ? profile.topArtists : [],
  };

  const rateKey = `recommend:personalized:${request.headers.get("x-forwarded-for") || "anonymous"}`;
  const rl = await rateLimit(rateKey, 30, 60);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const cacheKey = `recommend:personalized:${JSON.stringify(normalizedProfile)}`;

  const cached = await coreCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached, { status: 200 });
  }

  const candidateGenres = candidates?.genres?.filter(Boolean) ?? undefined;
  const candidateArtists = candidates?.topArtists?.filter(Boolean) ?? undefined;

  const result = getPersonalizedRecommendations(normalizedProfile, {
    candidateGenres,
    candidateArtists,
  });

  const response = { ok: true, ...result };

  await coreCache.set(cacheKey, response, { ex: 300 });

  return NextResponse.json(response, { status: 200 });
}
