"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, Clock, ExternalLink } from "lucide-react";
import useReducedMotion from "@/hooks/useReducedMotion";
import type { SpotifyArtist } from "@/lib/spotify";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";

interface ArtistCardsSectionProps {
  topArtists: SpotifyArtist[];
  listeningAura: string;
  loading?: boolean;
}

const artistLabels = ["Top Artist", "Rising Influence", "The Classic"];
const artistColors = ["text-neon-purple", "text-neon-pink", "text-secondary"];
const labelColors = ["text-neon-cyan", "text-neon-pink", "text-secondary"];
const gradientColors = ["#22D3EE", "#F472B6", "#A855F7"];

export default function ArtistCardsSection({
  topArtists,
  listeningAura,
  loading = false,
}: ArtistCardsSectionProps) {
  const reduced = useReducedMotion();
  const topThreeArtists = topArtists.slice(0, 3);

  if (loading) {
    return (
      <div className="md:col-span-12 mt-20">
        <LoadingSkeleton variant="text" className="w-64 h-10 rounded-2xl mb-4" />
        <LoadingSkeleton variant="text" className="w-96 h-6 rounded-xl mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-3xl overflow-hidden">
              <LoadingSkeleton variant="rect" className="w-full h-48 rounded-none" />
              <div className="p-6 space-y-3">
                <LoadingSkeleton variant="text" className="w-24 h-3" />
                <LoadingSkeleton variant="text" className="w-40 h-6" />
                <div className="flex gap-2">
                  <LoadingSkeleton variant="text" className="w-16 h-6 rounded-full" />
                  <LoadingSkeleton variant="text" className="w-20 h-6 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topThreeArtists.length === 0) {
    return (
      <div className="md:col-span-12 mt-20">
        <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
          Sonic Influences
        </h2>
        <EmptyState
          title="No artists found"
          description="Sync your Spotify data to discover your sonic influences."
        />
      </div>
    );
  }

  return (
    <div className="md:col-span-12 mt-20">
      {/* Section Heading */}
      <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
        Sonic Influences
      </h2>
      <p className="text-lg text-on-surface-variant mb-12">
        The architects of your personal soundscape.
      </p>

      {/* Artist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topThreeArtists.map((artist, idx) => {
          const artistImage = (artist as any).images?.[0]?.url;
          const spotifyUrl = (artist as any).external_urls?.spotify;

          return (
            <motion.div
              key={artist.id}
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.6, delay: 0.5 + idx * 0.15 }
              }
              className="md:col-span-4"
            >
              <Card className="glass-card rounded-3xl overflow-hidden transition-transform duration-500 hover:-translate-y-2 border-0 h-full group">
                {/* Artist visual — gradient header or image */}
                <div
                  className="w-full h-48 relative overflow-hidden"
                  style={{
                    background: artistImage
                      ? undefined
                      : `linear-gradient(135deg, ${listeningAura}40 0%, rgba(22,17,27,0.8) 50%, ${gradientColors[idx]}40 100%)`,
                  }}
                >
                  {artistImage ? (
                    <img
                      src={artistImage}
                      alt={artist.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {idx === 0 && (
                        <Star className={`w-10 h-10 ${artistColors[idx]} opacity-60`} />
                      )}
                      {idx === 1 && (
                        <TrendingUp
                          className={`w-10 h-10 ${artistColors[idx]} opacity-60`}
                        />
                      )}
                      {idx === 2 && (
                        <Clock className={`w-10 h-10 ${artistColors[idx]} opacity-60`} />
                      )}
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p
                        className={`text-xs ${labelColors[idx]} uppercase tracking-[0.1em] mb-1 font-semibold`}
                      >
                        {artistLabels[idx]}
                      </p>
                      <h3 className="font-[var(--font-outfit)] text-2xl font-semibold text-on-surface">
                        {artist.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {spotifyUrl && (
                        <a
                          href={spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full glass-card flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors"
                          title="Open in Spotify"
                        >
                          <ExternalLink className="w-4 h-4 text-on-surface-variant" />
                        </a>
                      )}
                      <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center shrink-0">
                        {idx === 0 && (
                          <Star className={`w-5 h-5 ${artistColors[idx]}`} />
                        )}
                        {idx === 1 && (
                          <TrendingUp className={`w-5 h-5 ${artistColors[idx]}`} />
                        )}
                        {idx === 2 && (
                          <Clock className={`w-5 h-5 ${artistColors[idx]}`} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {artist.genres.slice(0, 3).map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="bg-white/5 border-white/10 text-on-surface-variant text-xs"
                      >
                        {genre}
                      </Badge>
                    ))}
                    {artist.genres.length === 0 && (
                      <span className="text-base text-on-surface-variant">
                        Genre-defying artist
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
