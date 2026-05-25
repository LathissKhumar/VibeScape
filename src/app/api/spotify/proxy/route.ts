import { NextResponse } from 'next/server';
import { searchTrack, getTrackAudioFeatures } from '../../../../lib/lastfm';
import { getListeningHistory, getTopArtists, getTopTracks } from '../../../../lib/ytmusic';
import rateLimit from '../../../../lib/rateLimiter';
import coreCache from '../../../../lib/cache';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '';
  const action = url.searchParams.get('action') || '';

  const key = `ytmusic:${action}:${path}`;

  const rl = await rateLimit(key, 60, 60);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: 'rate_limited', remaining: rl.remaining }, { status: 429 });
  }

  const cached = await coreCache.get(key);
  if (cached) return NextResponse.json(cached, { status: 200 });

  try {
    let data;

    if (action === 'history') {
      data = await getListeningHistory(50);
    } else if (action === 'top-artists') {
      data = await getTopArtists(20);
    } else if (action === 'top-tracks') {
      data = await getTopTracks(20);
    } else if (action === 'lastfm-search') {
      const title = url.searchParams.get('title') || '';
      const artist = url.searchParams.get('artist') || '';
      data = await searchTrack(title, artist);
    } else if (action === 'lastfm-features') {
      const trackName = url.searchParams.get('track') || '';
      const artistName = url.searchParams.get('artist') || '';
      data = await getTrackAudioFeatures(trackName, artistName);
    } else {
      return NextResponse.json({ ok: false, error: 'unknown_action' }, { status: 400 });
    }

    await coreCache.set(key, data, { ex: 60 });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: (err as Error)?.message || 'api_error' }, { status: 502 });
  }
}

export const runtime = 'edge';
