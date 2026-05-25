const LASTFM_API_BASE = "https://ws.audioscrobbler.com/2.0/";
const API_KEY = process.env.LASTFM_API_KEY || "";

export interface LastFMTrack {
  id: string;
  title: string;
  artist: {
    name: string;
    mbid?: string;
  };
  album?: {
    title: string;
    image?: Array<{ "#text": string; size: string }>;
  };
  duration?: number;
  listeners?: number;
  playcount?: number;
  tags?: string[];
}

export interface LastFMAudioFeatures {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  tempo: number;
}

export interface LastFMSearchResponse {
  results: {
    trackmatches: {
      track: Array<{
        name: string;
        artist: string;
        url: string;
        listeners: string;
        image: Array<{ "#text": string; size: string }>;
      }>;
    };
  };
}

export interface LastFMTrackInfo {
  track: {
    name: string;
    artist: { name: string; mbid: string };
    album?: { name: string; image: Array<{ "#text": string; size: string }> };
    duration: string;
    listeners: string;
    playcount: string;
    toptags: { tag: Array<{ name: string; url: string }> };
  };
}

export interface LastFMArtistInfo {
  artist: {
    name: string;
    mbid: string;
    stats: { listeners: string; playcount: string };
    tags: { tag: Array<{ name: string; url: string; count: string }> };
    similar: { artist: Array<{ name: string; url: string; image: Array<{ "#text": string; size: string }> }> };
  };
}

async function fetchLastFM(params: Record<string, string>) {
  if (!API_KEY) {
    throw new Error("LASTFM_API_KEY not configured");
  }

  const url = new URL(LASTFM_API_BASE);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Last.fm API error: ${response.statusText}`);
  }
  return response.json();
}

export async function searchTrack(title: string, artist: string): Promise<LastFMTrack | null> {
  try {
    const data: LastFMSearchResponse = await fetchLastFM({
      method: "track.search",
      track: `${title} ${artist}`,
      limit: "1",
    });

    const tracks = data.results?.trackmatches?.track;
    if (!tracks || tracks.length === 0) return null;

    const track = tracks[0]!;
    return {
      id: track.url,
      title: track.name,
      artist: { name: track.artist },
      listeners: parseInt(track.listeners, 10) || 0,
      tags: [],
    };
  } catch {
    return null;
  }
}

export async function getTrackInfo(trackName: string, artistName: string): Promise<LastFMTrack | null> {
  try {
    const data: LastFMTrackInfo = await fetchLastFM({
      method: "track.getInfo",
      track: trackName,
      artist: artistName,
    });

    const track = data.track;
    if (!track) return null;

    const tags = track.toptags?.tag?.slice(0, 10).map((t) => t.name.toLowerCase()) || [];

    return {
      id: track.artist.mbid || track.name,
      title: track.name,
      artist: { name: track.artist.name, mbid: track.artist.mbid },
      album: track.album ? { title: track.album.name, image: track.album.image } : undefined,
      duration: parseInt(track.duration, 10) / 1000,
      listeners: parseInt(track.listeners, 10) || 0,
      playcount: parseInt(track.playcount, 10) || 0,
      tags,
    };
  } catch {
    return null;
  }
}

export async function getArtistGenres(artistName: string): Promise<string[]> {
  try {
    const data: LastFMArtistInfo = await fetchLastFM({
      method: "artist.getInfo",
      artist: artistName,
    });

    const artist = data.artist;
    if (!artist) return [];

    return artist.tags?.tag?.slice(0, 10).map((t) => t.name.toLowerCase()) || [];
  } catch {
    return [];
  }
}

const TAG_FEATURE_MAP: Record<string, Partial<LastFMAudioFeatures>> = {
  energy: { energy: 0.85, valence: 0.6, danceability: 0.7, acousticness: 0.1, tempo: 130 },
  energetic: { energy: 0.9, valence: 0.7, danceability: 0.8, acousticness: 0.05, tempo: 140 },
  upbeat: { energy: 0.8, valence: 0.9, danceability: 0.85, acousticness: 0.1, tempo: 125 },
  dance: { energy: 0.85, valence: 0.75, danceability: 0.95, acousticness: 0.05, tempo: 128 },
  electronic: { energy: 0.8, valence: 0.6, danceability: 0.8, acousticness: 0.05, instrumentalness: 0.4, tempo: 128 },
  house: { energy: 0.85, valence: 0.7, danceability: 0.9, acousticness: 0.05, tempo: 125 },
  techno: { energy: 0.9, valence: 0.5, danceability: 0.85, acousticness: 0.05, instrumentalness: 0.6, tempo: 135 },
  trance: { energy: 0.85, valence: 0.6, danceability: 0.75, acousticness: 0.05, instrumentalness: 0.5, tempo: 138 },
  dubstep: { energy: 0.95, valence: 0.4, danceability: 0.7, acousticness: 0.05, tempo: 140 },
  rock: { energy: 0.85, valence: 0.5, danceability: 0.5, acousticness: 0.2, tempo: 130 },
  metal: { energy: 0.95, valence: 0.3, danceability: 0.4, acousticness: 0.05, tempo: 150 },
  punk: { energy: 0.9, valence: 0.6, danceability: 0.6, acousticness: 0.1, tempo: 160 },
  indie: { energy: 0.6, valence: 0.6, danceability: 0.5, acousticness: 0.4, tempo: 110 },
  alternative: { energy: 0.7, valence: 0.5, danceability: 0.5, acousticness: 0.3, tempo: 120 },
  "indie rock": { energy: 0.75, valence: 0.5, danceability: 0.5, acousticness: 0.3, tempo: 125 },
  "alternative rock": { energy: 0.8, valence: 0.5, danceability: 0.5, acousticness: 0.2, tempo: 130 },
  pop: { energy: 0.7, valence: 0.8, danceability: 0.8, acousticness: 0.2, tempo: 120 },
  "dance pop": { energy: 0.75, valence: 0.85, danceability: 0.9, acousticness: 0.1, tempo: 125 },
  "hip hop": { energy: 0.75, valence: 0.6, danceability: 0.8, acousticness: 0.1, speechiness: 0.7, tempo: 95 },
  rap: { energy: 0.8, valence: 0.5, danceability: 0.75, acousticness: 0.1, speechiness: 0.8, tempo: 95 },
  trap: { energy: 0.85, valence: 0.5, danceability: 0.8, acousticness: 0.05, speechiness: 0.6, tempo: 140 },
  rnb: { energy: 0.6, valence: 0.7, danceability: 0.7, acousticness: 0.2, tempo: 90 },
  "r&b": { energy: 0.6, valence: 0.7, danceability: 0.7, acousticness: 0.2, tempo: 90 },
  soul: { energy: 0.5, valence: 0.7, danceability: 0.6, acousticness: 0.4, tempo: 95 },
  "neo soul": { energy: 0.5, valence: 0.75, danceability: 0.65, acousticness: 0.3, tempo: 90 },
  jazz: { energy: 0.4, valence: 0.6, danceability: 0.5, acousticness: 0.6, instrumentalness: 0.5, tempo: 100 },
  blues: { energy: 0.4, valence: 0.4, danceability: 0.4, acousticness: 0.7, tempo: 95 },
  classical: { energy: 0.3, valence: 0.5, danceability: 0.2, acousticness: 0.9, instrumentalness: 0.9, tempo: 80 },
  acoustic: { energy: 0.3, valence: 0.6, danceability: 0.3, acousticness: 0.9, tempo: 100 },
  folk: { energy: 0.4, valence: 0.6, danceability: 0.4, acousticness: 0.8, tempo: 100 },
  country: { energy: 0.5, valence: 0.7, danceability: 0.6, acousticness: 0.6, tempo: 115 },
  americana: { energy: 0.5, valence: 0.65, danceability: 0.5, acousticness: 0.7, tempo: 110 },
  ambient: { energy: 0.2, valence: 0.4, danceability: 0.2, acousticness: 0.5, instrumentalness: 0.8, tempo: 70 },
  chill: { energy: 0.3, valence: 0.5, danceability: 0.4, acousticness: 0.4, tempo: 90 },
  "chillout": { energy: 0.3, valence: 0.5, danceability: 0.4, acousticness: 0.4, tempo: 90 },
  lofi: { energy: 0.3, valence: 0.4, danceability: 0.5, acousticness: 0.5, tempo: 85 },
  "lo-fi": { energy: 0.3, valence: 0.4, danceability: 0.5, acousticness: 0.5, tempo: 85 },
  sad: { energy: 0.3, valence: 0.15, danceability: 0.2, acousticness: 0.6, tempo: 80 },
  melancholy: { energy: 0.3, valence: 0.2, danceability: 0.2, acousticness: 0.6, tempo: 80 },
  happy: { energy: 0.7, valence: 0.9, danceability: 0.8, acousticness: 0.2, tempo: 120 },
  party: { energy: 0.85, valence: 0.9, danceability: 0.9, acousticness: 0.1, tempo: 125 },
  instrumental: { energy: 0.5, valence: 0.5, danceability: 0.4, acousticness: 0.4, instrumentalness: 0.9, tempo: 100 },
  vocal: { energy: 0.6, valence: 0.6, danceability: 0.6, acousticness: 0.3, speechiness: 0.3, tempo: 110 },
  "female vocalists": { energy: 0.6, valence: 0.7, danceability: 0.6, acousticness: 0.3, tempo: 110 },
  "male vocalists": { energy: 0.6, valence: 0.6, danceability: 0.6, acousticness: 0.3, tempo: 110 },
  funk: { energy: 0.7, valence: 0.8, danceability: 0.9, acousticness: 0.2, tempo: 110 },
  disco: { energy: 0.8, valence: 0.85, danceability: 0.9, acousticness: 0.1, tempo: 120 },
  reggae: { energy: 0.5, valence: 0.7, danceability: 0.7, acousticness: 0.3, tempo: 85 },
  ska: { energy: 0.7, valence: 0.75, danceability: 0.7, acousticness: 0.2, tempo: 140 },
  latin: { energy: 0.7, valence: 0.8, danceability: 0.85, acousticness: 0.2, tempo: 110 },
  reggaeton: { energy: 0.75, valence: 0.75, danceability: 0.9, acousticness: 0.1, tempo: 100 },
  "k-pop": { energy: 0.75, valence: 0.75, danceability: 0.8, acousticness: 0.15, tempo: 120 },
  jpop: { energy: 0.7, valence: 0.7, danceability: 0.7, acousticness: 0.2, tempo: 130 },
  "j-pop": { energy: 0.7, valence: 0.7, danceability: 0.7, acousticness: 0.2, tempo: 130 },
  "post-rock": { energy: 0.6, valence: 0.4, danceability: 0.3, acousticness: 0.4, instrumentalness: 0.6, tempo: 110 },
  shoegaze: { energy: 0.6, valence: 0.3, danceability: 0.3, acousticness: 0.3, instrumentalness: 0.4, tempo: 110 },
  "hard rock": { energy: 0.9, valence: 0.4, danceability: 0.5, acousticness: 0.1, tempo: 140 },
  "singer-songwriter": { energy: 0.4, valence: 0.6, danceability: 0.3, acousticness: 0.7, tempo: 100 },
};

export function computeAudioFeaturesFromTags(tags: string[], durationSec = 240, listeners = 0): LastFMAudioFeatures {
  const matchedTags = tags.filter((t) => TAG_FEATURE_MAP[t]);
  if (matchedTags.length === 0) {
    return computeDefaultFeatures(durationSec, listeners);
  }

  const features: LastFMAudioFeatures = {
    energy: 0,
    valence: 0,
    danceability: 0,
    acousticness: 0,
    instrumentalness: 0,
    speechiness: 0,
    tempo: 0,
  };

  let energyCount = 0, valenceCount = 0, danceCount = 0, acousticCount = 0, instrCount = 0, speechCount = 0, tempoCount = 0;

  for (const tag of matchedTags) {
    const map = TAG_FEATURE_MAP[tag];
    if (!map) continue;

    if (map.energy !== undefined) { features.energy += map.energy; energyCount++; }
    if (map.valence !== undefined) { features.valence += map.valence; valenceCount++; }
    if (map.danceability !== undefined) { features.danceability += map.danceability; danceCount++; }
    if (map.acousticness !== undefined) { features.acousticness += map.acousticness; acousticCount++; }
    if (map.instrumentalness !== undefined) { features.instrumentalness += map.instrumentalness; instrCount++; }
    if (map.speechiness !== undefined) { features.speechiness += map.speechiness; speechCount++; }
    if (map.tempo !== undefined) { features.tempo += map.tempo; tempoCount++; }
  }

  features.energy = energyCount > 0 ? Math.round((features.energy / energyCount) * 100) / 100 : 0.5;
  features.valence = valenceCount > 0 ? Math.round((features.valence / valenceCount) * 100) / 100 : 0.5;
  features.danceability = danceCount > 0 ? Math.round((features.danceability / danceCount) * 100) / 100 : 0.5;
  features.acousticness = acousticCount > 0 ? Math.round((features.acousticness / acousticCount) * 100) / 100 : 0.3;
  features.instrumentalness = instrCount > 0 ? Math.round((features.instrumentalness / instrCount) * 100) / 100 : 0.1;
  features.speechiness = speechCount > 0 ? Math.round((features.speechiness / speechCount) * 100) / 100 : 0.1;
  features.tempo = tempoCount > 0 ? Math.round(features.tempo / tempoCount) : 100;

  return features;
}

function computeDefaultFeatures(durationSec: number, listeners: number): LastFMAudioFeatures {
  const durationMin = durationSec / 60;
  const popularity = Math.min(1, listeners / 1000000);

  return {
    energy: Math.round((0.4 + popularity * 0.3 + (durationMin < 3 ? 0.2 : 0)) * 100) / 100,
    valence: Math.round((0.5 + popularity * 0.2) * 100) / 100,
    danceability: Math.round((0.5 + popularity * 0.3) * 100) / 100,
    acousticness: Math.round(Math.max(0, 0.5 - popularity * 0.3) * 100) / 100,
    instrumentalness: Math.round((durationMin > 5 ? 0.4 : 0.1) * 100) / 100,
    speechiness: 0.1,
    tempo: Math.round(90 + popularity * 30),
  };
}

export async function getTrackAudioFeatures(trackName: string, artistName: string, durationSec = 240, listeners = 0): Promise<LastFMAudioFeatures | null> {
  try {
    const trackInfo = await getTrackInfo(trackName, artistName);
    if (trackInfo && trackInfo.tags && trackInfo.tags.length > 0) {
      return computeAudioFeaturesFromTags(trackInfo.tags, trackInfo.duration || durationSec, trackInfo.listeners || listeners);
    }
    return computeDefaultFeatures(durationSec, listeners);
  } catch {
    return computeDefaultFeatures(durationSec, listeners);
  }
}

export async function getTracksAudioFeatures(tracks: Array<{ title: string; artist: string; duration?: number; listeners?: number }>): Promise<(LastFMAudioFeatures | null)[]> {
  const batch = tracks.slice(0, 50).map((track) =>
    getTrackAudioFeatures(track.title, track.artist, track.duration || 240, track.listeners || 0)
  );

  // Process in batches of 10 to avoid rate limiting
  const CHUNK_SIZE = 10;
  const results: (LastFMAudioFeatures | null)[] = [];
  for (let i = 0; i < batch.length; i += CHUNK_SIZE) {
    const chunk = batch.slice(i, i + CHUNK_SIZE);
    const chunkResults = await Promise.all(chunk);
    results.push(...chunkResults);
  }
  return results;
}
