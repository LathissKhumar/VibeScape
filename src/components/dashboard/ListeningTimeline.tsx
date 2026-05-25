"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import useReducedMotion from "@/hooks/useReducedMotion";
import { TrendingUp, TrendingDown, Music2 } from "lucide-react";
import type { SpotifyRecentlyPlayed } from "@/lib/spotify";

const GENRE_COLORS: Record<string, string> = {
  "indie rock": "#A855F7",
  electronic: "#22D3EE",
  ambient: "#34D399",
  "post-rock": "#F472B6",
  "hip hop": "#FBBF24",
  pop: "#F97316",
  rock: "#EF4444",
  jazz: "#8B5CF6",
  classical: "#6366F1",
  "r&b": "#EC4899",
  folk: "#14B8A6",
  metal: "#DC2626",
};

interface TimelineSegment {
  genre: string;
  startHour: number;
  endHour: number;
  valence: number;
  energy: number;
}

interface Annotation {
  hour: number;
  label: string;
  type: "peak" | "dip";
}

function deriveTimelineFromHistory(recentlyPlayed: SpotifyRecentlyPlayed[]): { segments: TimelineSegment[]; annotations: Annotation[] } {
  if (!recentlyPlayed.length) {
    return { segments: [], annotations: [] };
  }

  const now = new Date();
  const hoursAgo = recentlyPlayed.map((item) => {
    const playedAt = new Date(item.played_at);
    return Math.max(0, (now.getTime() - playedAt.getTime()) / 3600000);
  });

  const maxHours = Math.max(...hoursAgo, 24);
  const segments: TimelineSegment[] = [];
  const chunkSize = Math.max(1, Math.floor(recentlyPlayed.length / 6));

  for (let i = 0; i < recentlyPlayed.length; i += chunkSize) {
    const chunk = recentlyPlayed.slice(i, i + chunkSize);
    const chunkHoursAgo = hoursAgo.slice(i, i + chunkSize);

    const avgHour = chunkHoursAgo.reduce((a, b) => a + b, 0) / chunkHoursAgo.length;

    const trackName = chunk[0]?.track.name || "Unknown";
    const inferredGenre = inferGenreFromTrackName(trackName);

    const valence = computeValenceFromTracks(chunk);
    const energy = computeEnergyFromTracks(chunk);

    segments.push({
      genre: inferredGenre,
      startHour: Math.round(avgHour),
      endHour: Math.round(avgHour + (maxHours / segments.length)),
      valence,
      energy,
    });
  }

  const annotations: Annotation[] = [];
  if (segments.length > 0) {
    let peakIdx = 0;
    let dipIdx = 0;
    for (let i = 1; i < segments.length; i++) {
      if (segments[i]!.valence > segments[peakIdx]!.valence) peakIdx = i;
      if (segments[i]!.valence < segments[dipIdx]!.valence) dipIdx = i;
    }
    annotations.push({ hour: segments[peakIdx]!.startHour, label: "Peak Mood", type: "peak" });
    if (dipIdx !== peakIdx) {
      annotations.push({ hour: segments[dipIdx]!.startHour, label: "Deep Dive", type: "dip" });
    }
  }

  return { segments, annotations };
}

function inferGenreFromTrackName(trackName: string): string {
  const lower = trackName.toLowerCase();

  const genreKeywords: Record<string, string[]> = {
    "electronic": ["beat", "synth", "bass", "drop", "edm", "techno", "house"],
    "hip hop": ["rap", "trap", "flow", "bars", "hip hop"],
    "rock": ["rock", "guitar", "riff", "punk", "metal"],
    "pop": ["pop", "dance", "hit", "love", "night"],
    "indie rock": ["indie", "alternative", "garage"],
    "jazz": ["jazz", "swing", "blues", "soul"],
    "ambient": ["ambient", "chill", "atmosphere", "dream"],
    "classical": ["classical", "symphony", "orchestra", "piano"],
    "r&b": ["r&b", "soul", "groove", "funk"],
    "folk": ["folk", "acoustic", "country", "americana"],
  };

  for (const [genre, keywords] of Object.entries(genreKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return genre;
    }
  }

  return "pop";
}

function computeValenceFromTracks(tracks: SpotifyRecentlyPlayed[]): number {
  if (!tracks.length) return 0.5;

  const positiveWords = ["love", "happy", "joy", "sun", "bright", "dance", "up", "good", "great", "fun", "party", "smile"];
  const negativeWords = ["sad", "dark", "night", "rain", "cry", "pain", "lost", "alone", "break", "fall", "down", "blue"];

  let score = 0;
  for (const track of tracks) {
    const name = track.track.name.toLowerCase();
    for (const word of positiveWords) {
      if (name.includes(word)) score += 0.1;
    }
    for (const word of negativeWords) {
      if (name.includes(word)) score -= 0.1;
    }
  }

  return Math.round(Math.min(1, Math.max(0, 0.5 + score / tracks.length)) * 100) / 100;
}

function computeEnergyFromTracks(tracks: SpotifyRecentlyPlayed[]): number {
  if (!tracks.length) return 0.5;

  const highEnergyWords = ["fire", "burn", "run", "fast", "power", "strong", "loud", "hard", "rock", "beat", "drop", "bass"];
  const lowEnergyWords = ["soft", "slow", "quiet", "calm", "peace", "dream", "sleep", "whisper", "gentle"];

  let score = 0;
  for (const track of tracks) {
    const name = track.track.name.toLowerCase();
    for (const word of highEnergyWords) {
      if (name.includes(word)) score += 0.1;
    }
    for (const word of lowEnergyWords) {
      if (name.includes(word)) score -= 0.1;
    }
  }

  return Math.round(Math.min(1, Math.max(0, 0.5 + score / tracks.length)) * 100) / 100;
}

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}h`);

function TrendLine({ segments, color, label }: { segments: TimelineSegment[]; color: string; label: string }) {
  const width = 600;
  const height = 60;
  const padding = 10;

  const points = segments.flatMap((seg, i) => {
    const x = padding + (i / Math.max(1, segments.length - 1)) * (width - padding * 2);
    const y = height - padding - seg[label === "Valence" ? "valence" : "energy"] * (height - padding * 2);
    return [{ x, y }];
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16" preserveAspectRatio="none">
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
      ))}
    </svg>
  );
}

interface ListeningTimelineProps {
  recentlyPlayed: SpotifyRecentlyPlayed[];
}

export default function ListeningTimeline({ recentlyPlayed }: ListeningTimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  const { segments, annotations } = useMemo(() => deriveTimelineFromHistory(recentlyPlayed), [recentlyPlayed]);

  if (!segments.length) {
    return (
      <div className="glass-enhanced rounded-3xl p-8 md:p-12 text-center">
        <Music2 className="size-8 text-neon-purple mx-auto mb-4" />
        <h3 className="font-[var(--font-outfit)] text-lg font-bold text-white mb-2">Your Listening Journey</h3>
        <p className="text-sm text-on-surface-variant">
          Play some music to see your listening patterns emerge.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-enhanced rounded-3xl p-8 md:p-12">
      <div className="flex items-center gap-2 mb-2">
        <Music2 className="size-4 text-neon-purple" />
        <h3 className="font-[var(--font-outfit)] text-lg font-bold text-white">Your Listening Journey</h3>
      </div>
      <p className="text-xs text-outline mb-6 italic">
        Derived from your actual listening history
      </p>

      <div className="mb-6">
        <p className="text-xs text-outline mb-3 uppercase tracking-[0.1em] font-semibold">Genre Evolution</p>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[600px]">
            {segments.map((seg, i) => {
              const color = GENRE_COLORS[seg.genre] || "#A855F7";
              const width = ((seg.endHour - seg.startHour) / 24) * 100;
              return (
                <motion.div
                  key={i}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ width: `${Math.max(width, 12)}%`, minWidth: 60 }}
                >
                  <div
                    className="h-16 flex items-center justify-center text-xs font-medium text-white/90 px-2 text-center"
                    style={{ backgroundColor: color }}
                  >
                    {seg.genre}
                  </div>
                  {i < segments.length - 1 && (() => {
                    const nextGenre = segments[i + 1]?.genre;
                    const nextColor = nextGenre ? GENRE_COLORS[nextGenre] : undefined;
                    return (
                    <div
                      className="absolute right-0 top-0 bottom-0 w-4"
                      style={{
                        background: `linear-gradient(to right, ${color}, ${nextColor || "#A855F7"})`,
                        opacity: 0.6,
                      }}
                    />
                    );
                  })()}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between mt-1 min-w-[600px]">
          {HOURS.map((h) => (
            <span key={h} className="text-[9px] text-white/20 w-8 text-center">
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-outline mb-3 uppercase tracking-[0.1em] font-semibold">Emotional Transitions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan" />
              <span className="text-xs text-on-surface-variant">Valence (Mood)</span>
            </div>
            <TrendLine segments={segments} color="#22D3EE" label="Valence" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-neon-pink" />
              <span className="text-xs text-on-surface-variant">Energy</span>
            </div>
            <TrendLine segments={segments} color="#F472B6" label="Energy" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {annotations.map((ann, i) => (
          <Badge
            key={i}
            variant="outline"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
              ann.type === "peak"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-neon-pink/10 border-neon-pink/30 text-neon-pink"
            }`}
          >
            {ann.type === "peak" ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {ann.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
