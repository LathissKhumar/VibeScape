"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import {
  Sparkles,
  Map,
  Globe,
  Heart,
  Share2,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Personality Archetypes",
    description: "Discover your unique sonic identity through AI-analyzed listening patterns and genre affinities.",
    glow: "glow-purple",
  },
  {
    icon: Map,
    title: "Listening Heatmaps",
    description: "Visualize when and how you listen with beautiful temporal heatmaps of your music habits.",
    glow: "glow-cyan",
  },
  {
    icon: Globe,
    title: "Music Galaxy",
    description: "Explore your personal universe where every artist is a star and every genre a nebula.",
    glow: "glow-pink",
  },
  {
    icon: Heart,
    title: "Mood Analytics",
    description: "Track how your music taste shifts with your mood across days, weeks, and seasons.",
    glow: "glow-purple",
  },
  {
    icon: Share2,
    title: "Shareable Cards",
    description: "Create stunning visual cards of your music identity to share on social media.",
    glow: "glow-cyan",
  },
  {
    icon: Users,
    title: "Friend Compatibility",
    description: "Compare your sonic DNA with friends and discover your musical compatibility score.",
    glow: "glow-pink",
  },
];

const featureColors = ["neon-purple", "neon-cyan", "neon-pink", "neon-purple", "neon-cyan", "neon-pink"];

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  "neon-purple": {
    bg: "bg-neon-purple/5",
    border: "border-neon-purple/20",
    text: "text-neon-purple",
  },
  "neon-cyan": {
    bg: "bg-neon-cyan/5",
    border: "border-neon-cyan/20",
    text: "text-neon-cyan",
  },
  "neon-pink": {
    bg: "bg-neon-pink/5",
    border: "border-neon-pink/20",
    text: "text-neon-pink",
  },
};

function PremiumFeatureIcon({ Icon, colorKey, reduced }: { Icon: React.ComponentType<{ className?: string }>; colorKey: string; reduced: boolean }) {
          const colors = colorMap[colorKey]!;
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {!reduced && (
        <motion.div
          className={`absolute inset-2 rounded-full ${colors.bg}`}
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className={`relative z-10 w-14 h-14 rounded-full bg-surface-container/60 backdrop-blur-sm flex items-center justify-center border ${colors.border} group-hover:scale-110 transition-transform duration-500`}>
        <Icon className={`w-7 h-7 ${colors.text}`} />
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative z-10 py-24 px-5 md:px-16 max-w-[1440px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-[var(--font-space-grotesk)] text-fluid-headline gradient-text-animated mb-4">
          Everything Your Music Says About You
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto text-lg font-light">
          Deep insights powered by AI that understand your listening DNA.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const colorKey = featureColors[index]!;
          return (
            <motion.div
              key={feature.title}
              initial={reduced ? {} : { opacity: 0, y: 40 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="h-full"
            >
              <div className={`glass-enhanced p-8 h-full flex flex-col group hover:scale-[1.02] transition-all duration-500 ${feature.glow}`}>
                <PremiumFeatureIcon Icon={Icon} colorKey={colorKey} reduced={reduced} />
                <h3 className="font-[var(--font-space-grotesk)] text-xl font-semibold text-on-surface mb-3 mt-6">
                  {feature.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed font-light flex-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
