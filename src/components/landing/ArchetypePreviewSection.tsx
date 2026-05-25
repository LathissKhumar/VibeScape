"use client";

import { Badge } from "@/components/ui/badge";
import { Layers, Moon, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";

const ARCHETYPES = [
  {
    title: "The Sonic Architect",
    description:
      "Precision, structure, and complex layers. You appreciate the mathematical beauty of high-production soundscapes.",
    icon: Layers,
    color: "neon-purple",
    badges: ["Techno", "Jazz"],
  },
  {
    title: "The Midnight Dreamer",
    description:
      "Atmospheric, ethereal, and emotive. Your soul resonates with the quiet intensity of lo-fi and cinematic scores.",
    icon: Moon,
    color: "neon-cyan",
    badges: ["Ambient", "Indie"],
  },
  {
    title: "The Rhythm Rebel",
    description:
      "High energy, disruptive, and pulse-driven. You lead the charge with heavy bass and unapologetic tempo.",
    icon: Zap,
    color: "neon-pink",
    badges: ["Phonk", "Drill"],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; ring: string }> = {
  "neon-purple": {
    bg: "bg-neon-purple/5",
    border: "border-neon-purple/20",
    text: "text-neon-purple",
    glow: "",
    ring: "",
  },
  "neon-cyan": {
    bg: "bg-neon-cyan/5",
    border: "border-neon-cyan/20",
    text: "text-neon-cyan",
    glow: "",
    ring: "",
  },
  "neon-pink": {
    bg: "bg-neon-pink/5",
    border: "border-neon-pink/20",
    text: "text-neon-pink",
    glow: "",
    ring: "",
  },
};

function PremiumIcon({ Icon, colors, reduced }: { Icon: React.ComponentType<{ className?: string }>; colors: typeof colorMap[string]; reduced: boolean }) {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {!reduced && (
        <motion.div
          className={`absolute inset-2 rounded-full ${colors.bg}`}
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {!reduced && (
        <motion.div
          className={`absolute inset-0 rounded-full border ${colors.border}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ borderStyle: "dashed" }}
        />
      )}
      <div className={`relative z-10 w-16 h-16 rounded-full bg-surface-container/60 backdrop-blur-sm flex items-center justify-center border ${colors.border} group-hover:scale-110 transition-transform duration-500`}>
        <Icon className={`w-8 h-8 ${colors.text}`} />
      </div>
    </div>
  );
}

export default function ArchetypePreviewSection() {
  const reduced = useReducedMotion();

  return (
    <section id="archetypes" className="relative z-10 py-24 px-5 md:px-16 max-w-[1440px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <span className="text-neon-pink font-[var(--font-inter)] text-sm tracking-[0.15em] uppercase mb-4 block font-semibold">
          Personal Identity
        </span>
        <h2 className="font-[var(--font-space-grotesk)] text-fluid-headline gradient-text-animated mb-4">
          Discover Your Audio Archetype
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto text-lg font-light">
          Our algorithms analyze over 50 sonic vectors to place you within one of our high-fidelity archetypes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARCHETYPES.map((archetype, index) => {
            const colors = colorMap[archetype.color]!;
            const Icon = archetype.icon;
          return (
            <motion.div
              key={archetype.title}
              initial={reduced ? {} : { opacity: 0, y: 40 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              className="h-full"
            >
              <div
                className={`glass-enhanced rounded-2xl flex flex-col h-full group ${colors.glow} transition-all duration-500 hover:scale-[1.02]`}
              >
                <div className="flex flex-col items-center pt-10 px-8">
                  <PremiumIcon Icon={Icon} colors={colors} reduced={reduced} />
                  <h3 className="font-[var(--font-space-grotesk)] text-[28px] leading-[1.3] font-semibold text-on-surface mt-6 text-center">
                    {archetype.title}
                  </h3>
                </div>
                <div className="px-8 pb-10 flex-1 flex flex-col">
                  <p className="text-on-surface-variant text-base leading-relaxed mb-8 font-light flex-1 text-center">
                    {archetype.description}
                  </p>
                  <div className="flex gap-2 justify-center">
                    {archetype.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="outline"
                        className={`${colors.bg} ${colors.border} ${colors.text}`}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
