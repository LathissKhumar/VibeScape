"use client";

import { motion } from "framer-motion";
import { Fingerprint, Share2, Compass } from "lucide-react";
import useReducedMotion from "@/hooks/useReducedMotion";
import type { Personality } from "@/types/next-auth";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";

interface PersonalityHeroProps {
  personality: Personality | null;
  loading?: boolean;
}

export default function PersonalityHero({
  personality,
  loading = false,
}: PersonalityHeroProps) {
  const reduced = useReducedMotion();

  if (loading) {
    return (
      <section id="archetype" className="flex flex-col items-center text-center mb-20">
        <div className="relative mb-8">
          <div className="archetype-aura absolute inset-0 blur-3xl scale-150 rounded-full opacity-30" />
          <div className="relative z-10 p-1 rounded-full bg-gradient-to-tr from-neon-purple/30 via-neon-cyan/30 to-neon-pink/30">
            <div className="bg-bg-deep rounded-full w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
              <LoadingSkeleton variant="rect" className="w-20 h-20 rounded-full" />
            </div>
          </div>
        </div>
        <LoadingSkeleton variant="text" className="w-96 h-16 rounded-2xl mb-4" />
        <LoadingSkeleton variant="text" className="w-[600px] max-w-full h-6 rounded-xl mb-2" />
        <LoadingSkeleton variant="text" className="w-80 h-6 rounded-xl mb-8" />
        <div className="flex gap-4">
          <LoadingSkeleton variant="rect" className="w-40 h-14 rounded-xl" />
          <LoadingSkeleton variant="rect" className="w-40 h-14 rounded-xl" />
        </div>
      </section>
    );
  }

  if (!personality) {
    return (
      <section id="archetype" className="flex flex-col items-center text-center mb-20">
        <EmptyState
          title="No personality data yet"
          description="Sync your Spotify data to discover your music archetype."
        />
      </section>
    );
  }

  return (
    <motion.section
      id="archetype"
      initial={reduced ? {} : { opacity: 0, y: 30 }}
      animate={reduced ? {} : { opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.8 }}
      className="flex flex-col items-center text-center mb-20"
    >
      {/* Fingerprint with Aura Glow */}
      <div className="relative mb-8">
        <div className="archetype-aura absolute inset-0 blur-3xl scale-150 rounded-full animate-pulse" />
        <div className="relative z-10 p-1 rounded-full bg-gradient-to-tr from-neon-purple via-neon-cyan to-neon-pink">
          <div className="bg-bg-deep rounded-full p-6 overflow-hidden">
            <Fingerprint
              className="w-20 h-20"
              style={{
                color: personality.listeningAura,
                textShadow: `0 0 30px ${personality.listeningAura}80`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Archetype Name with Gradient on second word */}
      <h1 className="font-[var(--font-outfit)] text-[40px] md:text-[64px] leading-[1.1] tracking-tighter text-white mb-4 font-bold">
        {personality.primaryArchetype.split(" ").map((word: string, i: number) => {
          if (i === 0) return <span key={i}>{word} </span>;
          return (
            <span
              key={i}
              className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan"
            >
              {word}{" "}
            </span>
          );
        })}
      </h1>

      {/* Secondary Trait Badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-on-surface-variant">
          {personality.secondaryTrait}
        </span>
        <span
          className="px-4 py-1.5 rounded-full text-sm font-medium border"
          style={{
            borderColor: `${personality.listeningAura}40`,
            color: personality.listeningAura,
            backgroundColor: `${personality.listeningAura}15`,
          }}
        >
          Chaos: {personality.chaosIndex}
        </span>
      </div>

      {/* Summary */}
      <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
        {personality.summary}
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <button className="glass-card px-8 py-4 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-all border-white/20 cursor-pointer">
          <Share2 className="w-5 h-5" /> Share DNA
        </button>
        <a
          href="#galaxy"
          className="bg-secondary text-on-secondary px-8 py-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all neon-glow-cyan"
        >
          <Compass className="w-5 h-5" /> Explore Galaxy
        </a>
      </div>
    </motion.section>
  );
}
