"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { SparklesIcon, RefreshCw, Music, Zap, Heart, Activity } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SpotifyArtist, SpotifyAudioFeatures } from "@/lib/spotify";
import type { Personality } from "@/types/next-auth";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

interface AIInsightsSheetProps {
  personality: Personality | null;
  topArtists: SpotifyArtist[];
  audioFeatures: (SpotifyAudioFeatures | null)[];
  loading?: boolean;
}

export default function AIInsightsSheet({
  personality,
  topArtists,
  audioFeatures,
  loading = false,
}: AIInsightsSheetProps) {
  const reduced = useReducedMotion();
  const [refreshing, setRefreshing] = useState(false);
  const validFeatures = audioFeatures.filter((f): f is SpotifyAudioFeatures => f !== null);

  const avgEnergy = validFeatures.length > 0
    ? Math.round((validFeatures.reduce((a, f) => a + (f.energy || 0), 0) / validFeatures.length) * 100)
    : 0;
  const avgDanceability = validFeatures.length > 0
    ? Math.round((validFeatures.reduce((a, f) => a + (f.danceability || 0), 0) / validFeatures.length) * 100)
    : 0;
  const avgAcousticness = validFeatures.length > 0
    ? Math.round((validFeatures.reduce((a, f) => a + (f.acousticness || 0), 0) / validFeatures.length) * 100)
    : 0;
  const topGenres = [...new Set(topArtists.flatMap((a) => a.genres))].slice(0, 3);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/profile/refresh-personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topArtists,
          audioFeatures,
        }),
      });
      if (!res.ok) {
        console.warn("refresh-personality failed:", res.status);
      }
    } catch (err) {
      console.warn("refresh-personality error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger
        render={
          <motion.button
            initial={reduced ? {} : { scale: 0 }}
            animate={reduced ? {} : { scale: 1 }}
            transition={{ duration: 0.4, delay: 1, type: "spring" }}
            className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Open AI Insights"
          >
            <SparklesIcon className="size-6 mx-auto" />
          </motion.button>
        }
      />
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-bg-deep border-glass-border overflow-y-auto"
      >
        <SheetHeader className="border-b border-glass-border pb-4 mb-4">
          <SheetTitle className="font-[var(--font-outfit)] text-2xl text-white flex items-center gap-2">
            <SparklesIcon className="size-5 text-neon-cyan" />
            Your AI Insights
          </SheetTitle>
          <SheetDescription className="text-on-surface-variant">
            Personalized listening intelligence
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="space-y-6 px-1">
            <div className="glass-card rounded-xl p-6">
              <LoadingSkeleton variant="text" className="w-40 h-6 mb-4" />
              <LoadingSkeleton variant="text" className="w-full h-4 mb-2" />
              <LoadingSkeleton variant="text" className="w-3/4 h-4 mb-4" />
              <div className="flex gap-2">
                <LoadingSkeleton variant="text" className="w-20 h-6 rounded-full" />
                <LoadingSkeleton variant="text" className="w-24 h-6 rounded-full" />
              </div>
            </div>
          </div>
        ) : personality ? (
          <motion.div
            initial={reduced ? {} : { opacity: 0, x: 20 }}
            animate={reduced ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 px-1"
          >
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">
                  {personality.primaryArchetype}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-on-surface-variant mb-3">{personality.summary}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                    {personality.secondaryTrait}
                  </Badge>
                  <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                    Chaos: {personality.chaosIndex}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">
                  Mood Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Energy", value: avgEnergy, color: "from-neon-purple to-neon-cyan" },
                  { label: "Danceability", value: avgDanceability, color: "from-neon-pink to-neon-purple" },
                  { label: "Acousticness", value: avgAcousticness, color: "from-secondary to-neon-cyan" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-on-surface-variant">{item.label}</span>
                      <span className="font-medium" style={{ color: "var(--color-neon-cyan)" }}>
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">
                  Top Genres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {topGenres.map((genre) => (
                    <Badge key={genre} className="bg-white/10 text-on-surface hover:bg-white/20 border-0 capitalize">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <Music className="w-5 h-5 mx-auto mb-1 text-neon-cyan" />
                  <p className="text-neon-cyan text-2xl font-bold font-[var(--font-outfit)]">
                    {topArtists.length}
                  </p>
                  <p className="text-xs text-outline">Artists</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <Activity className="w-5 h-5 mx-auto mb-1 text-neon-pink" />
                  <p className="text-neon-pink text-2xl font-bold font-[var(--font-outfit)]">
                    {validFeatures.length}
                  </p>
                  <p className="text-xs text-outline">Tracks</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-neon-purple" />
                  <p className="text-neon-purple text-2xl font-bold font-[var(--font-outfit)]">
                    {avgEnergy}%
                  </p>
                  <p className="text-xs text-outline">Energy</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-neon-pink" />
                  <p className="text-neon-pink text-2xl font-bold font-[var(--font-outfit)]">
                    {avgDanceability}%
                  </p>
                  <p className="text-xs text-outline">Dance</p>
                </div>
              </CardContent>
            </Card>

            <div className="px-1 pb-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-on-surface-variant text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh Analysis"}
              </button>
              <p className="text-xs text-outline text-center mt-2">
                Personality auto-updates when you sync new listening data.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <SparklesIcon className="size-12 text-on-surface-variant mb-4 opacity-40" />
            <p className="text-on-surface-variant text-sm">
              No personality data yet. Sync your Spotify to unlock insights.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
