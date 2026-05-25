"use client";

import { Globe, Share2, SparklesIcon, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";

export default function GalaxyPreviewSection() {
  const reduced = useReducedMotion();

  return (
    <section id="galaxy" className="relative z-10 py-24 bg-surface-container-lowest">
      <div className="px-5 md:px-16 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div
          initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
          whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-neon-purple/20 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="glass-enhanced rounded-3xl overflow-hidden p-2">
            <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-neon-purple/20 via-surface-container to-neon-cyan/20 flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-16 h-16 text-neon-cyan mb-4 block mx-auto" />
                <p className="text-on-surface-variant text-sm uppercase tracking-widest">
                  Interactive 3D Galaxy
                </p>
                <p className="text-on-surface-variant text-xs mt-2">
                  Connect with Spotify to explore
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 right-0 md:-right-6 glass-enhanced p-6 rounded-2xl glow-cyan">
            <div className="flex items-center gap-4">
              <div className="text-neon-cyan">
                <Share2 className="w-8 h-8" />
              </div>
              <div>
                <p className="font-[var(--font-inter)] text-sm text-on-surface-variant uppercase tracking-wide font-medium">
                  Neural Mapping
                </p>
                <p className="font-[var(--font-space-grotesk)] text-2xl font-semibold">1.2B Connections</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? {} : { opacity: 0, x: 30 }}
          whileInView={reduced ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:pl-12"
        >
          <span className="text-neon-cyan font-[var(--font-inter)] text-sm tracking-[0.15em] uppercase mb-4 block font-semibold">
            Your Music, Visualized
          </span>
          <h2 className="font-[var(--font-space-grotesk)] text-fluid-headline gradient-text-animated mb-6">
            3D Music Galaxy
          </h2>
          <p className="font-[var(--font-inter)] text-lg text-on-surface-variant mb-8 leading-relaxed font-light">
            Step inside your own personal universe. Resona doesn&apos;t just list your songs; it
            visualizes the celestial geometry of your taste. Every artist is a star, every genre
            a nebula, forming a unique map of your identity that evolves as you listen.
          </p>
          <ul className="space-y-6 mb-10">
            <motion.li
              initial={reduced ? {} : { opacity: 0, x: -20 }}
              whileInView={reduced ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start gap-4"
            >
              <SparklesIcon className="w-5 h-5 text-neon-cyan mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-on-surface font-[var(--font-space-grotesk)]">Spatial Exploration</h4>
                <p className="text-on-surface-variant font-light">
                  Navigate your library in a fully immersive 3D space designed for discovery.
                </p>
              </div>
            </motion.li>
            <motion.li
              initial={reduced ? {} : { opacity: 0, x: -20 }}
              whileInView={reduced ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-start gap-4"
            >
              <BarChart2 className="w-5 h-5 text-neon-purple mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-on-surface font-[var(--font-space-grotesk)]">Genre Drift Analysis</h4>
                <p className="text-on-surface-variant font-light">
                  Visualize how your musical orbit has shifted over months or years.
                </p>
              </div>
            </motion.li>
          </ul>
          <a
            href="#galaxy"
            className="glass-enhanced px-8 py-4 rounded-full font-[var(--font-space-grotesk)] text-xl text-on-surface inline-flex items-center gap-2 hover:bg-white/5 transition-all font-semibold border border-glass-border"
          >
            Explore Your Universe
          </a>
        </motion.div>
      </div>
    </section>
  );
}
