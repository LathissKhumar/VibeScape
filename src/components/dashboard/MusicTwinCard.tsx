"use client";

import { motion } from "framer-motion";
import { UsersIcon, MusicIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { MusicTwinCandidate } from "@/lib/recommend";

interface MusicTwinCardProps {
  twin: MusicTwinCandidate | null;
  loading?: boolean;
}

function scoreToColor(score: number): string {
  if (score >= 0.9) return "text-neon-purple";
  if (score >= 0.7) return "text-neon-cyan";
  if (score >= 0.5) return "text-neon-pink";
  if (score >= 0.3) return "text-secondary";
  return "text-on-surface-variant";
}

function scoreToBarColor(score: number): string {
  if (score >= 0.7) return "bg-gradient-to-r from-neon-purple to-neon-cyan";
  if (score >= 0.5) return "bg-gradient-to-r from-neon-pink to-neon-purple";
  return "bg-gradient-to-r from-secondary to-neon-cyan";
}

export default function MusicTwinCard({ twin, loading }: MusicTwinCardProps) {
  if (loading) {
    return (
      <Card className="glass-card rounded-3xl border-0 overflow-hidden">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-white/10" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-32 bg-white/10" />
          <Skeleton className="h-2 w-full bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
            <Skeleton className="h-6 w-24 rounded-full bg-white/10" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!twin) {
    return (
      <Card className="glass-card rounded-3xl border-0 overflow-hidden">
        <CardHeader>
          <CardTitle className="font-[var(--font-outfit)] text-lg text-white flex items-center gap-2">
            <UsersIcon className="size-5 text-on-surface-variant" />
            Music Twin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <MusicIcon className="size-8 text-on-surface-variant" />
            </div>
            <p className="text-on-surface-variant text-sm mb-1">
              No music twin data yet
            </p>
            <p className="text-outline text-xs">
              Connect with friends or sync more music to discover your vibe twin.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const displayScore = Math.round(twin.compatibility.score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-card rounded-3xl border-0 overflow-hidden transition-transform duration-500 hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-[var(--font-outfit)] text-lg text-white flex items-center gap-2">
            <UsersIcon className="size-5 text-neon-cyan" />
            Music Twin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center shrink-0">
              <UsersIcon className="size-6 text-white" />
            </div>
            <div>
              <p className="font-[var(--font-outfit)] text-xl font-semibold text-white">
                {twin.name}
              </p>
              <p className={`text-xs font-medium ${scoreToColor(twin.compatibility.score)}`}>
                {twin.compatibility.label}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-on-surface-variant mb-1">
              <span>Compatibility</span>
              <span className={`font-semibold ${scoreToColor(twin.compatibility.score)}`}>
                {displayScore}%
              </span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${displayScore}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full rounded-full ${scoreToBarColor(twin.compatibility.score)}`}
              />
            </div>
          </div>

          {twin.sharedGenres.length > 0 && (
            <div>
              <p className="text-xs text-on-surface-variant mb-2 font-medium">
                Shared Genres
              </p>
              <div className="flex flex-wrap gap-1.5">
                {twin.sharedGenres.slice(0, 5).map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-on-surface-variant text-xs capitalize"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
