"use client";

import dynamic from "next/dynamic";
import type { SpotifyAudioFeatures } from "@/lib/spotify";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

const ListeningHeatmap = dynamic(
  () => import("@/components/ListeningHeatmap"),
  { ssr: false }
);

interface ListeningHeatmapSectionProps {
  audioFeatures: (SpotifyAudioFeatures | null)[];
  loading?: boolean;
}

export default function ListeningHeatmapSection({
  audioFeatures,
  loading = false,
}: ListeningHeatmapSectionProps) {
  if (loading) {
    return (
      <div className="md:col-span-12 mt-20">
        <LoadingSkeleton variant="text" className="w-64 h-10 rounded-2xl mb-4" />
        <LoadingSkeleton variant="text" className="w-96 h-6 rounded-xl mb-8" />
        <div className="glass-card rounded-3xl p-8">
          <div className="flex justify-between mb-4 pl-12">
            {Array.from({ length: 7 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="text" className="w-12 h-3" />
            ))}
          </div>
          {Array.from({ length: 7 }).map((_, row) => (
            <div key={row} className="flex gap-2 h-7 items-center mb-2">
              <LoadingSkeleton variant="text" className="w-10 h-3" />
              <div className="flex-1 grid grid-cols-24 gap-1">
                {Array.from({ length: 24 }).map((_, col) => (
                  <LoadingSkeleton
                    key={col}
                    variant="rect"
                    className="h-5 w-full rounded-sm"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const validFeatures = audioFeatures.filter(
    (f): f is SpotifyAudioFeatures => f !== null
  );

  if (validFeatures.length === 0) {
    return (
      <div className="md:col-span-12 mt-20">
        <div className="glass-card rounded-3xl p-12 text-center">
          <p className="text-lg text-on-surface-variant">
            No listening data available yet. Sync your Spotify to see your sonic rhythm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:col-span-12 mt-0">
      <ListeningHeatmap audioFeatures={audioFeatures} />
    </div>
  );
}
