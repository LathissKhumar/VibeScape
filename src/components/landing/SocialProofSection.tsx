"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const testimonials = [
  {
    name: "Alex Rivera",
    archetype: "Sonic Architect",
    quote: "I never realized how much my music taste said about me. Resona revealed patterns I never knew existed.",
  },
  {
    name: "Maya Chen",
    archetype: "Midnight Dreamer",
    quote: "The Music Galaxy is absolutely mesmerizing. It's like looking into my own soul through sound.",
  },
  {
    name: "Jordan Blake",
    archetype: "Rhythm Rebel",
    quote: "Sharing my archetype card broke the internet among my friends. Everyone wants to discover theirs now.",
  },
];

export default function SocialProofSection() {
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
        <div className="font-[var(--font-space-grotesk)] text-fluid-mega gradient-text-animated mb-4">
          <AnimatedCounter target={50000} suffix="+" />
        </div>
        <p className="text-on-surface-variant text-xl font-light">
          music explorers and counting
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={reduced ? {} : { opacity: 0, y: 40 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
            className="h-full"
          >
            <div className="glass-enhanced p-8 h-full flex flex-col group hover:scale-[1.02] transition-all duration-500 glow-purple">
              <p className="text-on-surface-variant leading-relaxed mb-6 font-light italic flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  {!reduced && (
                    <motion.div
                      className="absolute inset-1 rounded-full bg-neon-purple/5"
                      animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                    />
                  )}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-surface-container/60 backdrop-blur-sm flex items-center justify-center border border-neon-purple/20">
                    <span className="font-[var(--font-space-grotesk)] text-lg font-semibold text-neon-purple">
                      {testimonial.name[0]!}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-[var(--font-space-grotesk)] font-semibold text-on-surface">
                    {testimonial.name}
                  </p>
                  <p className="text-neon-cyan text-sm font-light">
                    {testimonial.archetype}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
