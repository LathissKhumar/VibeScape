"use client";

import type { SpotifyAudioFeatures } from "@/lib/spotify";
import AudioFeaturesChart from "@/components/AudioFeaturesChart";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";

interface AudioRadarSectionProps {
  audioFeatures: (SpotifyAudioFeatures | null)[];
  auraColor: string;
  loading?: boolean;
}

export default function AudioRadarSection({
  audioFeatures,
  auraColor,
  loading = false,
}: AudioRadarSectionProps) {
  if (loading) {
    return (
      <div className="h-[400px] glass-card rounded-3xl p-6 flex flex-col">
        <LoadingSkeleton variant="text" className="w-40 h-8 rounded-xl mb-2" />
        <LoadingSkeleton variant="text" className="w-56 h-4 rounded-lg mb-6" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSkeleton variant="rect" className="w-72 h-72 rounded-full" />
        </div>
      </div>
    );
  }

  const validFeatures = audioFeatures.filter(
    (f): f is SpotifyAudioFeatures => f !== null
  );

  if (validFeatures.length === 0) {
    return (
      <div className="h-[400px] glass-card rounded-3xl p-6 flex items-center justify-center">
        <EmptyState
          title="No audio features yet"
          description="Sync more tracks to see your sonic profile radar."
        />
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <AudioFeaturesChart
        audioFeatures={audioFeatures}
        auraColor={auraColor}
      />
    </div>
  );
}
