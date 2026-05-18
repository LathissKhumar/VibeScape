import { supabase } from "./supabase";

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
  // Try to get from cache first
  const { data: cacheData, error: cacheError } = await supabase
    .from("spotify_cache")
    .select("data, updated_at")
    .eq("id", cacheKey)
    .single();

  if (!cacheError && cacheData) {
    const updatedAt = new Date(cacheData.updated_at).getTime();
    if (Date.now() - updatedAt < CACHE_TTL_MS) {
      console.log(`Cache HIT for ${cacheKey}`);
      return cacheData.data;
    }
  }

  // Cache miss or expired, fetch fresh data
  console.log(`Cache MISS or EXPIRED for ${cacheKey}`);
  try {
    const freshData = await fetcher();

    // Store in cache
    const { error: upsertError } = await supabase.from("spotify_cache").upsert({
      id: cacheKey,
      user_id: userId,
      data: freshData,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      console.error(`Failed to cache ${cacheKey}:`, upsertError);
    }

    return freshData;
  } catch (error) {
    // If rate limited but we have stale cache, return stale cache
    if (cacheData) {
      console.warn(`Returning STALE cache for ${cacheKey} due to fetch error.`);
      return cacheData.data;
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
