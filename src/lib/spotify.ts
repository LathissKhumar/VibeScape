import { supabase } from "./supabase";
import coreCache from "./cache";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
}

export interface SpotifyAudioFeatures {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  tempo: number;
}

export async function fetchFromSpotify(endpoint: string, accessToken: string) {
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 429) {
      console.warn("Spotify API rate limit hit!");
    }
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch data with aggressive caching in Supabase
 */
export async function getCachedSpotifyData<T>(
  cacheKey: string,
  userId: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Prefer Redis/Postgres cache via coreCache (hot/warm). Fallback to Supabase for stale read if present.
  try {
    const hot = await coreCache.get<T>(cacheKey);
    if (hot !== null) {
      // Cache HIT
      console.log(`Cache HIT (coreCache) for ${cacheKey}`);
      return hot as T;
    }
  } catch (err) {
    // ignore and try fallback
  }

  // If coreCache miss, try Supabase as a fallback to return fresh-ish cached data before fetching
  let supabaseCache: any = null;
  try {
    const { data: cacheData, error: cacheError } = await supabase
      .from("spotify_cache")
      .select("data, updated_at")
      .eq("id", cacheKey)
      .single();

    if (!cacheError && cacheData) {
      const updatedAt = new Date(cacheData.updated_at).getTime();
      if (Date.now() - updatedAt < CACHE_TTL_MS) {
        console.log(`Cache HIT (supabase fallback) for ${cacheKey}`);
        return cacheData.data;
      }
      supabaseCache = cacheData.data;
    }
  } catch (err) {
    // ignore supabase errors
  }

  // Cache miss or expired, fetch fresh data
  console.log(`Cache MISS for ${cacheKey}; fetching fresh`);
  try {
    const freshData = await fetcher();

    // Store in coreCache (hot/warm) with TTL
    const ex = Math.max(1, Math.floor(CACHE_TTL_MS / 1000));
    try {
      await coreCache.set<T>(cacheKey, freshData, { ex });
    } catch (err) {
      // ignore cache set failures
    }

    // Also persist to Supabase for compatibility/backfill
    try {
      const { error: upsertError } = await supabase.from("spotify_cache").upsert({
        id: cacheKey,
        user_id: userId,
        data: freshData,
        updated_at: new Date().toISOString(),
      });
      if (upsertError) {
        console.error(`Failed to cache ${cacheKey} in supabase:`, upsertError);
      }
    } catch (err) {
      // ignore supabase upsert failures
    }

    return freshData;
  } catch (error) {
    // If fetch failed but we have supabaseCache (stale), return it
    if (supabaseCache) {
      console.warn(`Returning STALE supabase cache for ${cacheKey} due to fetch error.`);
      return supabaseCache;
    }
    throw error;
  }
}

export async function getTopArtists(accessToken: string, userId: string, timeRange = "long_term") {
  const cacheKey = `top_artists_${userId}_${timeRange}`;
  return getCachedSpotifyData(cacheKey, userId, () =>
    fetchFromSpotify(`/me/top/artists?time_range=${timeRange}&limit=50`, accessToken)
  );
}

export async function getTopTracks(accessToken: string, userId: string, timeRange = "long_term") {
  const cacheKey = `top_tracks_${userId}_${timeRange}`;
  return getCachedSpotifyData(cacheKey, userId, () =>
    fetchFromSpotify(`/me/top/tracks?time_range=${timeRange}&limit=50`, accessToken)
  );
}

export async function getAudioFeatures(accessToken: string, userId: string, trackIds: string[]) {
  // Spotify allows max 100 track IDs per request
  const ids = trackIds.slice(0, 100).join(",");
  const cacheKey = `audio_features_${userId}_${ids.substring(0, 20)}...`; // Simple hash approach could be better, but this works for demo
  
  return getCachedSpotifyData(cacheKey, userId, () =>
    fetchFromSpotify(`/audio-features?ids=${ids}`, accessToken)
  );
}
