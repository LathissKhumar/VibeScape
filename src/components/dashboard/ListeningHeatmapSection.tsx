"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import type { SpotifyRecentlyPlayed } from "@/lib/spotify";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Clock } from "lucide-react";

interface ListeningHeatmapSectionProps {
  recentlyPlayed: SpotifyRecentlyPlayed[];
  loading?: boolean;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function computeHeatmapFromPlays(plays: SpotifyRecentlyPlayed[]) {
  const heatmap = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const play of plays) {
    const date = new Date(play.played_at);
    const day = date.getDay();
    const hour = date.getHours();
    const row = heatmap[day];
    if (row) row[hour] = (row[hour] ?? 0) + 1;
  }
  const maxCount = Math.max(...heatmap.flat(), 1);
  return heatmap.map((row) => row.map((cell) => cell / maxCount));
}

function getCellColor(value: number): string {
  if (value === 0) return "bg-surface-container/30";
  if (value < 0.25) return "bg-neon-purple/20";
  if (value < 0.5) return "bg-neon-purple/40";
  if (value < 0.75) return "bg-neon-purple/60";
  return "bg-neon-purple/80";
}

function getCellGlow(value: number): string {
  if (value === 0) return "";
  if (value < 0.5) return "shadow-[0_0_8px_rgba(168,85,247,0.2)]";
  if (value < 0.75) return "shadow-[0_0_12px_rgba(168,85,247,0.4)]";
  return "shadow-[0_0_16px_rgba(168,85,247,0.6)]";
}

function computeInsights(data: number[][]) {
  const hourAverages = HOURS.map((hour) => {
    const sum = data.reduce((acc, row) => acc + (row[hour] ?? 0), 0);
    return sum / 7;
  });

  const dayAverages = data.map((row) => row.reduce((acc, val) => acc + val, 0) / 24);

  const peakHour = HOURS.reduce((max, hour) => ((hourAverages[hour] ?? 0) > (hourAverages[max] ?? 0) ? hour : max), 0);
  const peakDay = dayAverages.reduce((max, val, idx) => (val > (dayAverages[max] ?? 0) ? idx : max), 0);

  let minAvg = Infinity;
  let quietDay = 0;
  let quietHour = 0;
  data.forEach((row, dayIdx) => {
    row.forEach((val, hourIdx) => {
      if (val < minAvg) {
        minAvg = val;
        quietDay = dayIdx;
        quietHour = hourIdx;
      }
    });
  });

  return [
    { label: "Peak Hour", value: `${peakHour}:00` },
    { label: "Peak Day", value: FULL_DAYS[peakDay] },
    { label: "Quietest", value: `${DAYS[quietDay]} ${quietHour}:00` },
  ];
}

export default function ListeningHeatmapSection({
  recentlyPlayed,
  loading = false,
}: ListeningHeatmapSectionProps) {
  const reduced = useReducedMotion();
  const [tooltip, setTooltip] = useState<{ day: string; hour: number; intensity: number; x: number; y: number } | null>(null);

  const heatmapData = useMemo(() => computeHeatmapFromPlays(recentlyPlayed), [recentlyPlayed]);
  const insights = useMemo(() => computeInsights(heatmapData), [heatmapData]);

  if (loading) {
    return (
      <div className="md:col-span-12">
        <LoadingSkeleton variant="text" className="w-64 h-10 rounded-2xl mb-4" />
        <LoadingSkeleton variant="text" className="w-96 h-6 rounded-xl mb-8" />
        <div className="glass-card rounded-3xl p-8">
          {Array.from({ length: 7 }).map((_, row) => (
            <div key={row} className="flex gap-2 h-7 items-center mb-2">
              <LoadingSkeleton variant="text" className="w-10 h-3" />
              <div className="flex-1 grid grid-cols-12 gap-1">
                {Array.from({ length: 12 }).map((_, col) => (
                  <LoadingSkeleton key={col} variant="card" className="h-5 w-full rounded-sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentlyPlayed.length === 0) {
    return (
      <div className="md:col-span-12">
        <EmptyState
          icon={Clock}
          title="No listening data yet"
          description="Play some music on Spotify and come back to see your real listening rhythm."
        />
      </div>
    );
  }

  return (
    <div className="md:col-span-12 relative">
      <motion.h2
        initial={reduced ? {} : { opacity: 0, y: 10 }}
        animate={reduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-[var(--font-space-grotesk)] text-2xl font-semibold gradient-text-animated text-on-surface mb-2"
      >
        Your Listening Rhythm
      </motion.h2>
      <p className="text-sm text-on-surface-variant mb-6">
        When you listen, mapped across days and hours.
      </p>

      <div className="glass-enhanced rounded-3xl p-6 overflow-x-auto relative">
        <div className="min-w-[600px]">
          <div className="flex justify-between mb-2 pl-12">
            {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
              <span key={h} className="text-xs text-outline w-6 text-center">{h}h</span>
            ))}
          </div>

          {DAYS.map((day, row) => (
            <div key={day} className="flex gap-1 h-6 items-center mb-1">
              <span className="text-xs text-outline w-10 flex-shrink-0">{day}</span>
              <div className="flex-1 grid grid-cols-24 gap-px">
                {HOURS.map((hour, col) => {
                  const value = heatmapData[row]?.[hour] ?? 0;
                  return (
                    <motion.div
                      key={`${row}-${col}`}
                      initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
                      whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (row * 24 + col) * 0.002 }}
                      className={`h-5 rounded-sm ${getCellColor(value)} ${getCellGlow(value)} hover:ring-1 hover:ring-white/30 transition-all cursor-default relative`}
                      onMouseEnter={(e) => {
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setTooltip({ day: FULL_DAYS[row]!, hour, intensity: value, x: rect.left + rect.width / 2, y: rect.top });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 text-xs text-outline">
          <span>Low</span>
          <div className="w-32 h-3 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.2), rgba(168,85,247,0.4), rgba(168,85,247,0.6), rgba(168,85,247,0.8))" }} />
          <span>High</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {insights.map((insight) => (
            <div key={insight.label} className="glass-enhanced px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="text-xs text-on-surface-variant">{insight.label}</span>
              <span className="text-xs font-semibold text-neon-purple">{insight.value}</span>
            </div>
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none glass-enhanced px-3 py-2 rounded-lg"
          style={{ left: tooltip.x - 60, top: tooltip.y - 60 }}
        >
          <p className="text-xs font-medium text-on-surface">{tooltip.day} {tooltip.hour}:00</p>
          <p className="text-xs text-neon-purple">Intensity: {tooltip.intensity.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
