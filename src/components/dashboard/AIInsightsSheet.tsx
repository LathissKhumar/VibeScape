"use client";

import { SparklesIcon, RefreshCw } from "lucide-react";
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
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

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
  const validFeatures = audioFeatures.filter(
    (f): f is SpotifyAudioFeatures => f !== null
  );
  const avgEnergy =
    validFeatures.length > 0
      ? Math.round(
          (validFeatures.reduce((a, f) => a + (f.energy || 0), 0) /
            validFeatures.length) *
            100
        )
      : 0;
  const avgDanceability =
    validFeatures.length > 0
      ? Math.round(
          (validFeatures.reduce((a, f) => a + (f.danceability || 0), 0) /
            validFeatures.length) *
            100
        )
      : 0;
  const avgAcousticness =
    validFeatures.length > 0
      ? Math.round(
          (validFeatures.reduce((a, f) => a + (f.acousticness || 0), 0) /
            validFeatures.length) *
            100
        )
      : 0;
  const topGenres = [
    ...new Set(topArtists.flatMap((a) => a.genres)),
  ].slice(0, 3);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
            <SparklesIcon className="size-6 mx-auto" />
          </button>
        }
      />
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-surface border-glass-border overflow-y-auto"
      >
        <SheetHeader className="border-b border-glass-border pb-4 mb-4">
          <SheetTitle className="font-[var(--font-outfit)] text-2xl text-white flex items-center gap-2">
            <SparklesIcon className="size-5 text-neon-cyan" />
            AI Insights
          </SheetTitle>
          <SheetDescription className="text-on-surface-variant">
            Your personalized listening intelligence
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
            <div className="glass-card rounded-xl p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <LoadingSkeleton variant="text" className="w-16 h-4" />
                    <LoadingSkeleton variant="text" className="w-10 h-4" />
                  </div>
                  <LoadingSkeleton variant="text" className="w-full h-2 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : personality ? (
          <div className="space-y-6 px-1">
            {/* Archetype Card */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">
                  {personality.primaryArchetype}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-on-surface-variant mb-3">
                  {personality.summary}
                </p>
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

            {/* Mood Overview */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">
                  Mood Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Energy</span>
                    <span className="text-neon-cyan font-medium">
                      {avgEnergy}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
                      style={{ width: `${avgEnergy}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">
                      Danceability
                    </span>
                    <span className="text-neon-pink font-medium">
                      {avgDanceability}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-pink to-neon-purple rounded-full"
                      style={{ width: `${avgDanceability}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">
                      Acousticness
                    </span>
                    <span className="text-secondary font-medium">
                      {avgAcousticness}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-neon-cyan rounded-full"
                      style={{ width: `${avgAcousticness}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Genres */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">
                  Top Genres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {topGenres.map((genre) => (
                    <Badge
                      key={genre}
                      className="bg-white/10 text-on-surface hover:bg-white/20 border-0 capitalize"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <p className="text-neon-cyan text-2xl font-bold font-[var(--font-outfit)]">
                    {topArtists.length}
                  </p>
                  <p className="text-xs text-outline">Artists Analyzed</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <p className="text-neon-pink text-2xl font-bold font-[var(--font-outfit)]">
                    {validFeatures.length}
                  </p>
                  <p className="text-xs text-outline">Tracks Analyzed</p>
                </div>
              </CardContent>
            </Card>

            {/* Refresh Analysis Button */}
            <div className="px-1 pb-4">
              <button
                disabled
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-on-surface-variant text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                title="Auto-refresh coming soon — personality updates after new Spotify syncs"
              >
                <RefreshCw className="size-4" />
                Refresh Analysis
              </button>
              <p className="text-xs text-outline text-center mt-2">
                Personality auto-updates when you sync new listening data.
              </p>
            </div>
          </div>
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
