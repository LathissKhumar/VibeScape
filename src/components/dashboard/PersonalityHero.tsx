"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks";
import { Fingerprint, Share2, Compass } from "lucide-react";
import type { Personality } from "@/types/next-auth";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Music } from "lucide-react";

interface PersonalityHeroProps {
  personality: Personality | null;
  loading?: boolean;
}

function useParallax(reduced: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const iconY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration check: single mount-time setState, no cascading renders
    setIsHydrated(true);
  }, []);

  if (reduced || !isHydrated) {
    return { iconY: 0, contentY: 0 };
  }

  return { iconY, contentY };
}

interface PersonalityHeroProps {
  personality: Personality | null;
  loading?: boolean;
}

const AuraRing = ({ delay, aura }: { delay: number; aura: string }) => (
  <motion.div
    className="absolute inset-0 rounded-full"
    style={{ border: `2px solid ${aura}30` }}
    initial={{ scale: 1, opacity: 0.4 }}
    animate={{ scale: 3, opacity: 0 }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeOut",
      delay,
    }}
  />
);

export default function PersonalityHero({
  personality,
  loading = false,
}: PersonalityHeroProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { iconY, contentY } = useParallax(reduced, containerRef);

  if (loading) {
    return (
      <section id="archetype" className="flex flex-col items-center text-center mb-20">
        <div className="relative mb-8">
          <div className="archetype-aura absolute inset-0 blur-3xl scale-150 rounded-full opacity-30" />
          <div className="relative z-10 p-1 rounded-full bg-gradient-to-tr from-neon-purple/30 via-neon-cyan/30 to-neon-pink/30">
            <div className="bg-bg-deep rounded-full w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
              <LoadingSkeleton variant="card" className="w-20 h-20 rounded-full" />
            </div>
          </div>
        </div>
        <LoadingSkeleton variant="text" className="w-96 h-16 rounded-2xl mb-4" />
        <LoadingSkeleton variant="text" className="w-[600px] max-w-full h-6 rounded-xl mb-2" />
        <LoadingSkeleton variant="text" className="w-80 h-6 rounded-xl mb-8" />
        <div className="flex gap-4">
          <LoadingSkeleton variant="card" className="w-40 h-14 rounded-xl" />
          <LoadingSkeleton variant="card" className="w-40 h-14 rounded-xl" />
        </div>
      </section>
    );
  }

  if (!personality) {
    return (
      <section id="archetype" className="flex flex-col items-center text-center mb-20">
        <EmptyState
          icon={Music}
          title="No personality data yet"
          description="Sync your Spotify data to discover your music archetype."
        />
      </section>
    );
  }

  const staggerChildren: Variants = reduced
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      };

  const itemAnimation: Variants = reduced
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" as const },
        },
      };

  return (
    <motion.section
      ref={containerRef}
      id="archetype"
      initial={reduced ? {} : { opacity: 0 }}
      animate={reduced ? {} : { opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex flex-col items-center text-center mb-20"
    >
      <div className="glass-enhanced mesh-gradient w-full p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="ambient-light-purple -top-32 -left-32" />
          <div className="ambient-light-cyan -bottom-24 -right-24" />
        </div>

        <motion.div style={{ y: reduced ? 0 : contentY }} className="relative z-10">
          <motion.div
            className="relative mb-8 flex justify-center"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.div style={{ y: reduced ? 0 : iconY }} className="relative">
              <AuraRing delay={0} aura={personality.listeningAura} />
              <AuraRing delay={1} aura={personality.listeningAura} />
              <AuraRing delay={2} aura={personality.listeningAura} />

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
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemAnimation}
            initial="hidden"
            animate="visible"
            className="font-[var(--font-space-grotesk)] text-fluid-display gradient-text-animated mb-4"
          >
            {personality.primaryArchetype}
          </motion.h1>

          <motion.div
            variants={itemAnimation}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-3 mb-4"
          >
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
          </motion.div>

          <motion.p
            variants={itemAnimation}
            initial="hidden"
            animate="visible"
            className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {personality.summary}
          </motion.p>

          <motion.div
            variants={itemAnimation}
            initial="hidden"
            animate="visible"
            className="flex justify-center gap-4"
          >
            <button className="glass-card px-8 py-4 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-all border-white/20 cursor-pointer">
              <Share2 className="w-5 h-5" /> Share DNA
            </button>
            <a
              href="#galaxy"
              className="bg-secondary text-on-secondary px-8 py-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all neon-glow-cyan"
            >
              <Compass className="w-5 h-5" /> Explore Galaxy
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
