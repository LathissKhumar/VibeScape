"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MusicTwinCard from "./MusicTwinCard";
import { findMusicTwins, computeVibeCompatibility, type MusicTwinCandidate } from "@/lib/recommend";

interface MusicTwinFinderProps {
  userProfile: { genres: string[]; topArtists: string[] };
}

const KNOWN_PROFILES = [
  { id: "1", name: "Alex Rivera", profile: { genres: ["indie rock", "electronic", "ambient"], topArtists: ["Radiohead", "Daft Punk", "Bon Iver"] } },
  { id: "2", name: "Sam Chen", profile: { genres: ["post-rock", "ambient", "shoegaze"], topArtists: ["Explosions in the Sky", "Sigur Rós", "Mogwai"] } },
  { id: "3", name: "Jordan Lee", profile: { genres: ["indie rock", "folk", "singer-songwriter"], topArtists: ["Fleet Foxes", "Iron & Wine", "Sufjan Stevens"] } },
  { id: "4", name: "Casey Kim", profile: { genres: ["techno", "house", "electronic"], topArtists: ["Carl Cox", "Charlotte de Witte", "Amelie Lens"] } },
  { id: "5", name: "Riley Park", profile: { genres: ["jazz", "soul", "neo soul"], topArtists: ["Miles Davis", "Erykah Badu", "Robert Glasper"] } },
];

export default function MusicTwinFinder({ userProfile }: MusicTwinFinderProps) {
  const [twins, setTwins] = useState<MusicTwinCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTwins() {
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "persist",
            profile: {
              genres: userProfile.genres,
              topArtists: userProfile.topArtists,
            },
          }),
        });

        if (res.ok) {
          const similarRes = await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "find_similar", userId: "anonymous", limit: 3 }),
          });

          if (similarRes.ok) {
            const data = await similarRes.json();
            if (data.ok && data.results && data.results.length > 0) {
              const mockNames = ["Alex Rivera", "Sam Chen", "Jordan Lee", "Casey Kim", "Riley Park"];
              const mockGenres = [
                ["indie rock", "electronic", "ambient"],
                ["post-rock", "ambient", "shoegaze"],
                ["indie rock", "folk", "singer-songwriter"],
                ["techno", "house", "electronic"],
                ["jazz", "soul", "neo soul"],
              ];

              const twins: MusicTwinCandidate[] = data.results.map((u: { entity_id: string; similarity: number }, i: number) => ({
                id: u.entity_id,
                name: mockNames[i % mockNames.length] ?? "Unknown",
                compatibility: {
                  score: Math.round(u.similarity * 1000) / 1000,
                  label: computeVibeCompatibility(
                    userProfile,
                    { genres: mockGenres[i % mockGenres.length] ?? [], topArtists: [] }
                  ).label,
                },
                sharedGenres: (mockGenres[i % mockGenres.length] ?? []).filter((g) =>
                  userProfile.genres.includes(g)
                ),
              }));

              setTwins(twins);
              setLoading(false);
              return;
            }
          }
        }
      } catch {
      }

      const computedTwins = findMusicTwins(userProfile, KNOWN_PROFILES, 3);
      setTwins(computedTwins);
      setLoading(false);
    }

    if (userProfile.genres.length || userProfile.topArtists.length) {
      fetchTwins();
    } else {
      setLoading(false);
    }
  }, [userProfile]);

  if (!userProfile.genres.length && !userProfile.topArtists.length) {
    return (
      <div className="glass-enhanced rounded-3xl p-8 md:p-12 text-center">
        <h2 className="font-[var(--font-outfit)] text-[32px] leading-[1.2] tracking-tight font-semibold mb-2">
          <span className="gradient-text-animated">Find Your Music Twin</span>
        </h2>
        <p className="text-lg text-on-surface-variant">
          Connect your music account to discover who shares your sonic frequency.
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
        <span className="gradient-text-animated">Find Your Music Twin</span>
      </h2>
      <p className="text-lg text-on-surface-variant mb-8">
        Discover who shares your sonic frequency.
      </p>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-enhanced rounded-3xl p-6 animate-pulse">
              <div className="h-6 w-32 bg-white/10 rounded mb-4" />
              <div className="h-4 w-24 bg-white/10 rounded mb-3" />
              <div className="h-2 w-full bg-white/10 rounded mb-4" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-white/10 rounded-full" />
                <div className="h-6 w-20 bg-white/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : twins.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-on-surface-variant">No music twins found yet. Your profile is unique!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {twins.map((twin, i) => (
            <motion.div
              key={twin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <MusicTwinCard twin={twin} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
