import { NextResponse } from 'next/server';
import { fetchFromSpotify } from '../../../../lib/spotify';
import rateLimit from '../../../../lib/rateLimiter';
import coreCache from '../../../../lib/cache';

// Minimal Spotify proxy route — GET only for demonstration
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '';
  const token = request.headers.get('authorization')?.replace(/^Bearer\s*/i, '') || '';

  // Simple key per token+path for rate-limiting and caching
  const key = `spotify:proxy:${token || 'anonymous'}:${path}`;

  // Rate limit: 60 requests per minute per token
  const rl = await rateLimit(key, 60, 60);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: 'rate_limited', remaining: rl.remaining }, { status: 429 });
  }

  // Try cache
  const cached = await coreCache.get(key);
  if (cached) return NextResponse.json(cached, { status: 200 });

  if (!token) return NextResponse.json({ ok: false, error: 'missing_token' }, { status: 401 });

  try {
    const data = await fetchFromSpotify(path, token);
    // Store in hot/warm cache with TTL of 60 seconds
    await coreCache.set(key, data, { ex: 60 });
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'spotify_error' }, { status: 502 });
  }
}

export const runtime = 'edge';
