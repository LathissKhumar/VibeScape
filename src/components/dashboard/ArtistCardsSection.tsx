"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { Star, TrendingUp, Clock, ExternalLink, Music } from "lucide-react";
import type { SpotifyArtist } from "@/lib/spotify";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface ArtistCardsSectionProps {
  topArtists: SpotifyArtist[];
  listeningAura: string;
  loading?: boolean;
}

const gradientColors = ["#22D3EE", "#F472B6", "#A855F7"];
const artistIcons = [Star, TrendingUp, Clock];

function getArtistLabel(idx: number, artist: SpotifyArtist) {
  if (idx === 0) return "Most Played";
  if (idx === 1) {
    return artist.popularity > 70 ? "Rising Star" : "Deep Cut";
  }
  return artist.popularity > 60 ? "Timeless Favorite" : "Hidden Gem";
}

function getArtistTrait(artist: SpotifyArtist) {
  if (artist.genres.length === 0) return "Genre-defying";
  const genre = artist.genres[0]!.toLowerCase();
  if (genre.includes("electronic") || genre.includes("dance") || genre.includes("edm")) return "High Energy";
  if (genre.includes("ambient") || genre.includes("chill") || genre.includes("lo-fi")) return "Mellow Vibe";
  if (genre.includes("rock") || genre.includes("metal") || genre.includes("punk")) return "Raw Power";
  if (genre.includes("jazz") || genre.includes("blues") || genre.includes("soul")) return "Soulful Depth";
  if (genre.includes("hip") || genre.includes("rap") || genre.includes("trap")) return "Lyrical Flow";
  if (genre.includes("pop")) return "Catchy Appeal";
  if (genre.includes("classical") || genre.includes("orchestral")) return "Timeless Sound";
  if (genre.includes("indie")) return "Indie Spirit";
  return "Unique Voice";
}

function TiltCard({ children, reduced }: { children: React.ReactNode; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [-8, 8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [8, -8]);

  const springConfig = { stiffness: 300, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const posX = (e.clientX - rect.left) / rect.width;
    const posY = (e.clientY - rect.top) / rect.height;
    x.set(posX);
    y.set(posY);
    spotlightX.set(posX * 100);
    spotlightY.set(posY * 100);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    spotlightX.set(50);
    spotlightY.set(50);
  };

  if (reduced) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl z-10"
          style={{ background: spotlightBackground }}
        />
        {children}
      </div>
    </motion.div>
  );
}

export default function ArtistCardsSection({
  topArtists,
  listeningAura,
  loading = false,
}: ArtistCardsSectionProps) {
  const reduced = useReducedMotion();
  const topThreeArtists = topArtists.slice(0, 3);

  if (loading) {
    return (
      <div className="md:col-span-12">
        <LoadingSkeleton variant="text" className="w-64 h-10 rounded-2xl mb-4" />
        <LoadingSkeleton variant="text" className="w-96 h-6 rounded-xl mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-enhanced rounded-2xl overflow-hidden">
              <LoadingSkeleton variant="card" className="w-full h-48 rounded-none" />
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
      <div className="md:col-span-12">
        <EmptyState
          icon={Music}
          title="Keep listening to discover your top artists"
          description="Your sonic influences will appear here as you explore more music."
        />
      </div>
    );
  }

  return (
    <div className="md:col-span-12">
      <motion.h2
        initial={reduced ? {} : { opacity: 0, y: 10 }}
        animate={reduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-[var(--font-space-grotesk)] text-2xl font-semibold gradient-text-animated mb-2"
      >
        Your Top Artists
      </motion.h2>
      <p className="text-sm text-on-surface-variant mb-8">
        The architects of your personal soundscape.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: 1200 }}>
        {topThreeArtists.map((artist, idx) => {
          const artistImage = artist.images?.[0]?.url;
          const spotifyUrl = artist.external_urls?.spotify;
          const Icon = artistIcons[idx]!;
          const label = getArtistLabel(idx, artist);
          const trait = getArtistTrait(artist);

          return (
            <motion.div
              key={artist.id}
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={reduced ? {} : { duration: 0.5, delay: idx * 0.15 }}
            >
              <TiltCard reduced={reduced}>
                <Card className="glass-enhanced rounded-2xl overflow-hidden transition-all duration-500 hover:glow-purple border-0 h-full group relative gradient-border-animated">
                  <div
                    className="w-full h-48 relative overflow-hidden"
                    style={{
                      background: artistImage
                        ? undefined
                        : `linear-gradient(135deg, ${listeningAura}40 0%, rgba(22,17,27,0.8) 50%, ${gradientColors[idx]!}40 100%)`,
                    }}
                  >
                    {artistImage ? (
                      <Image
                        src={artistImage}
                        alt={artist.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-10 h-10 text-neon-purple opacity-60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container/80 to-transparent pointer-events-none" />
                  </div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-neon-cyan uppercase tracking-[0.1em] mb-1 font-semibold">
                          {label}
                        </p>
                        <h3 className="font-[var(--font-space-grotesk)] text-xl font-semibold text-on-surface truncate">
                          {artist.name}
                        </h3>
                        <p className="text-xs text-outline mt-1">{trait}</p>
                      </div>
                      {spotifyUrl && (
                        <a
                          href={spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full glass-enhanced flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors"
                          aria-label={`Open ${artist.name} in Spotify`}
                        >
                          <ExternalLink className="w-4 h-4 text-on-surface-variant" />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                        <span className="text-xs text-on-surface-variant">Genre-defying</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
