"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import { Link, Brain, Fingerprint } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect Spotify",
    description: "Link your Spotify account securely and let us access your listening history.",
    icon: Link,
    glow: "glow-purple",
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Our AI processes thousands of data points from your listening patterns and preferences.",
    icon: Brain,
    glow: "glow-cyan",
  },
  {
    number: "03",
    title: "Discover Your Identity",
    description: "Unlock your sonic archetypes, music galaxy, and personalized listening insights.",
    icon: Fingerprint,
    glow: "glow-pink",
  },
];

function PremiumStepIcon({ Icon, reduced }: { Icon: React.ComponentType<{ className?: string }>; reduced: boolean }) {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {!reduced && (
        <motion.div
          className="absolute inset-2 rounded-full bg-neon-purple/5"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="relative z-10 w-14 h-14 rounded-full bg-surface-container/60 backdrop-blur-sm flex items-center justify-center border border-neon-purple/20 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-7 h-7 text-neon-purple" />
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
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
          How It Works
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto text-lg font-light">
          Three simple steps to unlock the secrets hidden in your listening habits.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={reduced ? {} : { opacity: 0, y: 40 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              className="h-full"
            >
              <div className={`glass-enhanced p-8 h-full flex flex-col group hover:scale-[1.02] transition-all duration-500 ${step.glow}`}>
                <div className="flex items-center gap-5 mb-6">
                  <span className="font-[var(--font-space-grotesk)] text-5xl font-bold text-on-surface/10">
                    {step.number}
                  </span>
                  <PremiumStepIcon Icon={Icon} reduced={reduced} />
                </div>
                <h3 className="font-[var(--font-space-grotesk)] text-2xl font-semibold text-on-surface mb-3">
                  {step.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed font-light flex-1">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
