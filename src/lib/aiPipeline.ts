// Minimal AI pipeline optimization helpers
// - structToCompactMetrics: reduce structured audio/track metrics into compact numeric summary
// - buildCompactPrompt: combine compact metrics into a short prompt string
// - fingerprintMetrics: deterministic fingerprint (hash) for metrics to detect changes
// - prepareAiInput: end-to-end helper that returns { prompt, fingerprint }

import crypto from "crypto";
import type { SpotifyTrack, SpotifyAudioFeatures, SpotifyArtist } from "./spotify";

export function structToCompactMetrics(
  topArtists: SpotifyArtist[],
  topTracks: SpotifyTrack[],
  audioFeatures: (SpotifyAudioFeatures | null)[]
) {
  // Compute simple summaries: counts, avg energy/valence/danceability, genre diversity
  const avg = { energy: 0, valence: 0, danceability: 0, acousticness: 0 };
  const valid = audioFeatures.filter((f) => !!f) as SpotifyAudioFeatures[];
  if (valid.length > 0) {
    for (const f of valid) {
      avg.energy += f.energy ?? 0;
      avg.valence += f.valence ?? 0;
      avg.danceability += f.danceability ?? 0;
      avg.acousticness += f.acousticness ?? 0;
    }
    avg.energy /= valid.length;
    avg.valence /= valid.length;
    avg.danceability /= valid.length;
    avg.acousticness /= valid.length;
  }

  const genres = [...new Set(topArtists.flatMap((a) => a.genres))];
  const metrics = {
    topArtistCount: topArtists.length,
    topTrackCount: topTracks.length,
    genreCount: genres.length,
    avgEnergy: Number(avg.energy.toFixed(3)),
    avgValence: Number(avg.valence.toFixed(3)),
    avgDanceability: Number(avg.danceability.toFixed(3)),
    avgAcousticness: Number(avg.acousticness.toFixed(3))
  };
  return metrics;
}

export function buildCompactPrompt(metrics: Record<string, number>, maxTokens = 120) {
  // Build a compact single-line prompt focusing on numeric metrics
  const parts: string[] = [];
  for (const k of Object.keys(metrics)) {
    parts.push(`${k}:${metrics[k as keyof typeof metrics]}`);
  }
  const compact = parts.join("|");
  // Ensure not too long
  if (compact.length > maxTokens) {
    return compact.slice(0, maxTokens);
  }
  return compact;
}

export function fingerprintMetrics(obj: unknown) {
  try {
    const s = typeof obj === "string" ? obj : JSON.stringify(obj);
    const h = crypto.createHash("sha256").update(s).digest("hex");
    return h.slice(0, 16);
  } catch (e) {
    return null;
  }
}

export function prepareAiInput(
  topArtists: SpotifyArtist[],
  topTracks: SpotifyTrack[],
  audioFeatures: (SpotifyAudioFeatures | null)[]
) {
  const metrics = structToCompactMetrics(topArtists, topTracks, audioFeatures);
  const prompt = buildCompactPrompt(metrics);
  const fingerprint = fingerprintMetrics(metrics);
  return { prompt, fingerprint, metrics };
}

export default { structToCompactMetrics, buildCompactPrompt, fingerprintMetrics, prepareAiInput };
