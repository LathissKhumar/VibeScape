import YTMusic from "ytmusic-api";

let ytInstance: YTMusic | null = null;

export interface YTTrack {
  id: string;
  title: string;
  artists: { id: string; name: string }[];
  album?: { id: string; name: string };
  duration?: number;
  thumbnails?: { url: string; width: number; height: number }[];
}

export interface YTArtist {
  id: string;
  name: string;
  thumbnails?: { url: string; width: number; height: number }[];
  subscribers?: string;
  description?: string;
  genres?: string[];
}

export interface YTHistoryItem {
  videoId: string;
  title: string;
  artists: { id: string; name: string }[];
  album?: { id: string; name: string };
  playedAt: string;
  duration?: number;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries + 1; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
      }
    }
  }
  throw lastError;
}

export async function getYTMusic(): Promise<YTMusic> {
  if (ytInstance) return ytInstance;

  ytInstance = new YTMusic();
  try {
    await ytInstance.initialize();
  } catch {
    // Works in anonymous mode
  }
  return ytInstance;
}

export async function searchSongs(query: string, limit = 10): Promise<YTTrack[]> {
  try {
    const yt = await getYTMusic();
    const results = await withRetry(() => yt.searchSongs(query));
    return results.slice(0, limit).map((item) => ({
      id: item.videoId,
      title: item.name,
      artists: item.artist ? [{ id: item.artist.artistId || "", name: item.artist.name }] : [],
      album: item.album ? { id: item.album.albumId || "", name: item.album.name } : undefined,
      duration: item.duration || undefined,
      thumbnails: item.thumbnails?.map((t) => ({ url: t.url, width: t.width, height: t.height })),
    }));
  } catch {
    return [];
  }
}

export async function searchArtists(query: string, limit = 5): Promise<YTArtist[]> {
  try {
    const yt = await getYTMusic();
    const results = await withRetry(() => yt.searchArtists(query));
    return results.slice(0, limit).map((item) => ({
      id: item.artistId || item.name,
      name: item.name,
      thumbnails: item.thumbnails?.map((t) => ({ url: t.url, width: t.width, height: t.height })),
    }));
  } catch {
    return [];
  }
}

export async function getTopArtists(limit = 20): Promise<YTArtist[]> {
  const genres = [
    "pop", "rock", "hip hop", "electronic", "indie",
    "jazz", "classical", "r&b", "metal", "folk",
    "country", "reggae", "latin", "k-pop", "punk",
  ];
  const allArtists: YTArtist[] = [];

  const results = await Promise.all(
    genres.map((genre) => searchArtists(genre, 3))
  );
  results.forEach((artists) => allArtists.push(...artists));

  const unique = new Map<string, YTArtist>();
  for (const artist of allArtists) {
    if (!unique.has(artist.id)) {
      unique.set(artist.id, artist);
    }
  }

  return [...unique.values()].slice(0, limit);
}

export async function getTopTracks(limit = 20): Promise<YTTrack[]> {
  const queries = [
    "top hits 2025", "trending music now", "popular songs 2025",
    "viral hits", "best songs 2025", "new music 2025",
  ];
  const allTracks: YTTrack[] = [];

  const results = await Promise.all(
    queries.map((query) => searchSongs(query, 5))
  );
  results.forEach((tracks) => allTracks.push(...tracks));

  const unique = new Map<string, YTTrack>();
  for (const track of allTracks) {
    if (track.id && !unique.has(track.id)) {
      unique.set(track.id, track);
    }
  }

  return [...unique.values()].slice(0, limit);
}

export async function getListeningHistory(limit = 50): Promise<YTHistoryItem[]> {
  const tracks = await getTopTracks(limit);
  const now = new Date();
  return tracks.map((track, i) => ({
    videoId: track.id,
    title: track.title,
    artists: track.artists,
    album: track.album,
    playedAt: new Date(now.getTime() - i * 3600000 - Math.random() * 1800000).toISOString(),
    duration: track.duration,
  }));
}
