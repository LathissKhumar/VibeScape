"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/lib/recommend";

interface RecommendationsSectionProps {
  userProfile: { genres: string[]; topArtists: string[] };
}

function typeToColor(type: string): string {
  switch (type) {
    case "artist": return "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30";
    case "genre": return "bg-neon-purple/10 text-neon-purple border-neon-purple/30";
    case "mood": return "bg-neon-pink/10 text-neon-pink border-neon-pink/30";
    default: return "bg-white/10 text-white border-white/20";
  }
}

export default function RecommendationsSection({ userProfile }: RecommendationsSectionProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch("/api/recommend/personalized", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: userProfile }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.recommendations) {
            setRecommendations(data.recommendations);
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }

    if (userProfile.genres.length || userProfile.topArtists.length) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [userProfile]);

  if (!userProfile.genres.length && !userProfile.topArtists.length) {
    return (
      <div className="glass-enhanced rounded-3xl p-8 md:p-12 text-center">
        <h2 className="font-[var(--font-outfit)] text-[32px] leading-[1.2] tracking-tight font-semibold mb-2">
          <span className="gradient-text-animated">Recommended For You</span>
        </h2>
        <p className="text-lg text-on-surface-variant">
          Connect your music account to get personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-enhanced rounded-3xl p-8 md:p-12"
    >
      <h2 className="font-[var(--font-outfit)] text-[32px] leading-[1.2] tracking-tight font-semibold mb-2">
        <span className="gradient-text-animated">Recommended For You</span>
      </h2>
      <p className="text-lg text-on-surface-variant mb-8">
        Curated picks based on your unique sonic DNA.
      </p>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-enhanced rounded-2xl p-6 animate-pulse">
              <div className="h-5 w-16 bg-white/10 rounded-full mb-4" />
              <div className="h-6 w-48 bg-white/10 rounded mb-3" />
              <div className="h-4 w-full bg-white/10 rounded mb-4" />
              <div className="h-2 w-full bg-white/10 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && recommendations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-on-surface-variant">No recommendations yet. Keep listening to discover new music!</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-enhanced rounded-2xl p-6 border border-white/5 hover:border-neon-purple/30 transition-colors"
            >
              <Badge
                variant="outline"
                className={`mb-3 ${typeToColor(rec.type)}`}
              >
                {rec.type}
              </Badge>
              <h3 className="font-[var(--font-space-grotesk)] text-xl font-semibold text-white mb-2">
                {rec.label}
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                {rec.reason}
              </p>
              <div>
                <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                  <span>Confidence</span>
                  <span className="font-semibold text-neon-cyan">
                    {Math.round(rec.confidence * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(rec.confidence * 100)}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
