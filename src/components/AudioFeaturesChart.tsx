"use client";

import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import type { SpotifyAudioFeatures } from "@/lib/spotify";
import { Card, CardContent } from "@/components/ui/card";

export default function AudioFeaturesChart({
  audioFeatures,
  auraColor,
}: {
  audioFeatures: (SpotifyAudioFeatures | null)[];
  auraColor: string;
}) {
  const data = useMemo(() => {
    if (!audioFeatures || audioFeatures.length === 0) return [];

    const sums = audioFeatures.reduce(
      (acc, track) => {
        if (!track) return acc;
        return {
          acousticness: acc.acousticness + (track.acousticness || 0),
          danceability: acc.danceability + (track.danceability || 0),
          energy: acc.energy + (track.energy || 0),
          instrumentalness: acc.instrumentalness + (track.instrumentalness || 0),
          valence: acc.valence + (track.valence || 0),
          speechiness: acc.speechiness + (track.speechiness || 0),
        };
      },
      {
        acousticness: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        valence: 0,
        speechiness: 0,
      }
    );

    const count = audioFeatures.filter(Boolean).length || 1;

    return [
      { subject: "Acoustic", A: (sums.acousticness / count) * 100 },
      { subject: "Danceable", A: (sums.danceability / count) * 100 },
      { subject: "Energy", A: (sums.energy / count) * 100 },
      { subject: "Instrumental", A: (sums.instrumentalness / count) * 100 },
      { subject: "Vibe", A: (sums.valence / count) * 100 },
      { subject: "Speech", A: (sums.speechiness / count) * 100 },
    ];
  }, [audioFeatures]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="h-full"
    >
      <Card className="glass-card border-0 h-full flex flex-col relative overflow-hidden">
        {/* Subtle background glow */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
          style={{ backgroundColor: auraColor }}
        />

        <CardContent className="relative z-10 flex flex-col h-full p-6">
          <div className="mb-2">
            <h2 className="font-[var(--font-outfit)] text-2xl font-semibold text-white">Sonic Profile</h2>
            <p className="text-xs text-outline uppercase tracking-[0.05em] font-semibold">
              Audio DNA Analysis
            </p>
          </div>

          <div className="flex-1 w-full relative z-0 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "Inter" }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(22, 17, 27, 0.9)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    backdropFilter: "blur(24px)",
                    fontFamily: "Inter",
                  }}
                  itemStyle={{ color: auraColor }}
                />
                <Radar
                  name="Your DNA"
                  dataKey="A"
                  stroke={auraColor}
                  fill={auraColor}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
