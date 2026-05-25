import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getTopArtists,
  getTopTracks,
  getListeningHistory,
  type YTHistoryItem,
  type YTArtist,
} from "@/lib/ytmusic";
import {
  searchTrack,
  getArtistGenres,
  getTracksAudioFeatures,
  type LastFMAudioFeatures,
} from "@/lib/lastfm";
import { analyzePersonality } from "@/lib/gemini";
import { PersonalitySchema } from "@/lib/schemas/personality";
import type { Personality } from "@/types/next-auth";
import coreCache from "@/lib/cache";
import { userPersonalityKey } from "@/lib/cache/keys";
import DashboardClient from "./DashboardClient";

interface MappedTrack {
  id: string;
  name: string;
  artists: { name: string }[];
}

function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  return fn().then((result) => {
    const elapsed = Math.round(performance.now() - start);
    console.log(`[TIMING] ${label}: ${elapsed}ms`);
    return result;
  });
}

async function cachedAnalyzePersonality(
  userId: string,
  topArtists: Parameters<typeof analyzePersonality>[0],
  topTracks: Parameters<typeof analyzePersonality>[1],
  audioFeatures: Parameters<typeof analyzePersonality>[2]
): Promise<Personality> {
  const cacheKey = userPersonalityKey(userId);

  // Try cache first — if found and valid, return immediately (avoids Gemini call)
  const cached = await coreCache.get<Record<string, unknown>>(cacheKey);
  if (cached) {
    const result = PersonalitySchema.safeParse(cached);
    if (result.success) return result.data;
    console.warn("Cached personality invalid, re-fetching:", result.error.issues);
  }

  // Cache miss: call Gemini
  const result = await analyzePersonality(topArtists, topTracks, audioFeatures);

  // Cache for 24 hours (86400 seconds)
  await coreCache.set(cacheKey, result, { ex: 86400 });

  return result;
}

export default async function DashboardPage() {
  const totalStart = performance.now();

  const session = await timed("getServerSession", () => getServerSession(authOptions));

  if (!session) {
    redirect("/");
  }

  const [ytArtists, ytTracks, ytHistory] = await Promise.all([
    timed("getTopArtists", () => getTopArtists(20)),
    timed("getTopTracks", () => getTopTracks(20)),
    timed("getListeningHistory", () => getListeningHistory(50)),
  ]);

  const mappedTracks: MappedTrack[] = [];
  const trackFeatures: Array<{ title: string; artist: string; duration?: number; listeners?: number }> = [];
  const artistGenreMap = new Map<string, string[]>();

  const searchStart = performance.now();

  const searchResults = await Promise.all(
    ytTracks.slice(0, 10).map(async (track) => {
      const artistName = track.artists[0]?.name || "";
      return { track, artistName, result: await searchTrack(track.title, artistName) };
    })
  );

  const uniqueArtistNames = new Set<string>();
  for (const { track, artistName, result } of searchResults) {
    if (result) {
      mappedTracks.push({
        id: result.id,
        name: result.title,
        artists: [{ name: result.artist.name }],
      });

      trackFeatures.push({
        title: result.title,
        artist: result.artist.name,
        duration: track.duration,
        listeners: result.listeners,
      });

      uniqueArtistNames.add(result.artist.name);
    }
  }

  const genreEntries = await Promise.all(
    [...uniqueArtistNames].map(async (name) => [name, await getArtistGenres(name)] as const)
  );
  for (const [name, genres] of genreEntries) {
    artistGenreMap.set(name, genres);
  }
  console.log(`[TIMING] lastfmSearch (10 tracks): ${Math.round(performance.now() - searchStart)}ms`);

  let audioFeatures: (LastFMAudioFeatures | null)[] = [];
  if (trackFeatures.length > 0) {
    audioFeatures = await timed("getTracksAudioFeatures", () => getTracksAudioFeatures(trackFeatures));
  }

  const enrichedArtists: YTArtist[] = ytArtists.map((a) => ({
    ...a,
    genres: artistGenreMap.get(a.name) || [],
  }));

  const allGenres = [...new Set(enrichedArtists.flatMap((a) => a.genres || []))].filter(Boolean) as string[];

  const validFeatures = audioFeatures.filter((f): f is LastFMAudioFeatures => f !== null);
  const avgAudioFeatures = validFeatures.length > 0
    ? {
        energy: Math.round((validFeatures.reduce((sum, f) => sum + f.energy, 0) / validFeatures.length) * 100) / 100,
        valence: Math.round((validFeatures.reduce((sum, f) => sum + f.valence, 0) / validFeatures.length) * 100) / 100,
        danceability: Math.round((validFeatures.reduce((sum, f) => sum + f.danceability, 0) / validFeatures.length) * 100) / 100,
        acousticness: Math.round((validFeatures.reduce((sum, f) => sum + f.acousticness, 0) / validFeatures.length) * 100) / 100,
        instrumentalness: Math.round((validFeatures.reduce((sum, f) => sum + f.instrumentalness, 0) / validFeatures.length) * 100) / 100,
        speechiness: Math.round((validFeatures.reduce((sum, f) => sum + f.speechiness, 0) / validFeatures.length) * 100) / 100,
        tempo: Math.round(validFeatures.reduce((sum, f) => sum + f.tempo, 0) / validFeatures.length),
      }
    : undefined;

  const totalListeningMs = ytHistory.reduce((sum, h) => sum + (h.duration || 240) * 1000, 0);
  const totalListeningMinutes = Math.round(totalListeningMs / 60000);

  const personality = await timed("cachedAnalyzePersonality", () => cachedAnalyzePersonality(
    session.user.id,
    enrichedArtists.map((a) => ({
      id: a.id,
      name: a.name,
      genres: a.genres || [],
      popularity: 0,
      images: a.thumbnails?.map((t) => ({ url: t.url, height: t.height, width: t.width })) || [],
      external_urls: { spotify: "" },
      followers: { total: 0 },
    })),
    mappedTracks,
    audioFeatures
  ));

  const mappedHistory: YTHistoryItem[] = ytHistory.map((h) => ({
    ...h,
    playedAt: h.playedAt || new Date().toISOString(),
  }));

  const totalTime = Math.round(performance.now() - totalStart);
  console.log(`[TIMING] === DashboardPage TOTAL: ${totalTime}ms ===`);
  console.log(`[DATA] Artists: ${ytArtists.length}, Tracks: ${ytTracks.length}, Genres: ${allGenres.length}, History: ${ytHistory.length}, Listening: ${totalListeningMinutes}min`);

  return (
    <DashboardClient
      personality={personality}
      topArtists={enrichedArtists.map((a) => ({
        id: a.id,
        name: a.name,
        genres: a.genres || [],
        popularity: 0,
        images: a.thumbnails?.map((t) => ({ url: t.url, height: t.height, width: t.width })) || [],
        external_urls: { spotify: "" },
        followers: { total: 0 },
      }))}
      audioFeatures={audioFeatures}
      avgAudioFeatures={avgAudioFeatures}
      recentlyPlayed={mappedHistory.map((h) => ({
        played_at: h.playedAt,
        track: { id: h.videoId, name: h.title },
      }))}
      totalListeningMinutes={totalListeningMinutes}
      topGenres={allGenres.slice(0, 5)}
    />
  );
}
