"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { Clock, Music, TrendingUp, Calendar, Headphones, Zap } from "lucide-react";
import type { SpotifyRecentlyPlayed, SpotifyAudioFeatures } from "@/lib/spotify";
import { Card, CardContent } from "@/components/ui/card";

interface ListeningStatsSectionProps {
  recentlyPlayed: SpotifyRecentlyPlayed[];
  audioFeatures?: (SpotifyAudioFeatures | null)[];
  totalListeningMinutes: number;
}

interface MonthlyStats {
  month: string;
  count: number;
  totalMs: number;
}

function computeMonthlyBreakdown(plays: SpotifyRecentlyPlayed[]): MonthlyStats[] {
  const months = new Map<string, { count: number; totalMs: number }>();
  for (const play of plays) {
    const date = new Date(play.played_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleString("default", { month: "short", year: "numeric" });
    const existing = months.get(key) || { count: 0, totalMs: 0 };
    existing.count++;
    existing.totalMs += 240000; // assume ~4min per track
    months.set(key, existing);
  }
  return [...months.entries()]
    .map(([key, val]) => ({ month: key, count: val.count, totalMs: val.totalMs }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function computeStreak(plays: SpotifyRecentlyPlayed[]): number {
  if (!plays.length) return 0;
  const days = new Set(plays.map((p) => new Date(p.played_at).toDateString()));
  const sorted = [...days].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]!);
    const curr = new Date(sorted[i]!);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.abs(diff - 1) < 0.5) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function computePeakHours(plays: SpotifyRecentlyPlayed[]): number[] {
  const hours = new Array(24).fill(0);
  for (const play of plays) {
    const hour = new Date(play.played_at).getHours();
    hours[hour]++;
  }
  return hours;
}

export default function ListeningStatsSection({
  recentlyPlayed,
  totalListeningMinutes,
}: ListeningStatsSectionProps) {
  const reduced = useReducedMotion();

  const monthlyBreakdown = useMemo(() => computeMonthlyBreakdown(recentlyPlayed), [recentlyPlayed]);
  const streak = useMemo(() => computeStreak(recentlyPlayed), [recentlyPlayed]);
  const peakHours = useMemo(() => computePeakHours(recentlyPlayed), [recentlyPlayed]);
  const topPeakHour = peakHours.indexOf(Math.max(...peakHours));
  const avgDaily = recentlyPlayed.length > 0
    ? Math.round(totalListeningMinutes / Math.max(1, new Set(recentlyPlayed.map((p) => new Date(p.played_at).toDateString())).size))
    : 0;

  const statsCards = [
    {
      icon: Clock,
      label: "Total Listening Time",
      value: `${Math.round(totalListeningMinutes / 60)}h ${totalListeningMinutes % 60}m`,
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10",
      borderColor: "border-neon-cyan/20",
    },
    {
      icon: Headphones,
      label: "Tracks Played",
      value: recentlyPlayed.length.toString(),
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/10",
      borderColor: "border-neon-purple/20",
    },
    {
      icon: Zap,
      label: "Listening Streak",
      value: `${streak} day${streak !== 1 ? "s" : ""}`,
      color: "text-neon-pink",
      bgColor: "bg-neon-pink/10",
      borderColor: "border-neon-pink/20",
    },
    {
      icon: Calendar,
      label: "Peak Listening Hour",
      value: `${topPeakHour}:00`,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
  ];

  return (
    <div className="md:col-span-12">
      <motion.h2
        initial={reduced ? {} : { opacity: 0, y: 10 }}
        animate={reduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-[var(--font-space-grotesk)] text-2xl font-semibold gradient-text-animated mb-2"
      >
        Listening Stats
      </motion.h2>
      <p className="text-sm text-on-surface-variant mb-6">
        Your listening habits at a glance.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className={`glass-enhanced rounded-2xl border ${stat.borderColor} overflow-hidden`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-on-surface-variant">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {monthlyBreakdown.length > 0 && (
        <Card className="glass-enhanced rounded-2xl border border-white/5 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-neon-cyan" />
              <h3 className="font-[var(--font-space-grotesk)] text-sm font-semibold text-white">
                Monthly Activity
              </h3>
            </div>
            <div className="space-y-3">
              {monthlyBreakdown.map((m) => {
                const maxCount = Math.max(...monthlyBreakdown.map((x) => x.count), 1);
                const width = (m.count / maxCount) * 100;
                return (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="text-xs text-on-surface-variant w-20 flex-shrink-0">
                      {m.month}
                    </span>
                    <div className="flex-1 h-6 rounded-full bg-surface-container/50 overflow-hidden">
                      <motion.div
                        initial={reduced ? {} : { width: 0 }}
                        animate={reduced ? {} : { width: `${width}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-neon-purple/60 to-neon-cyan/60"
                      />
                    </div>
                    <span className="text-xs text-on-surface-variant w-12 text-right">
                      {m.count}
                    </span>
                    <span className="text-xs text-on-surface-variant w-16 text-right">
                      {Math.round(m.totalMs / 60000)}m
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
