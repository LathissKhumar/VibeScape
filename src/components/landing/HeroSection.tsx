"use client";

import { signIn } from "next-auth/react";
import { Music, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";

const words = ["Decode", "Your", "Sonic", "Soul"];

const particles = [
  { x: "10%", y: "20%", delay: 0, duration: 6 },
  { x: "80%", y: "15%", delay: 1.5, duration: 7 },
  { x: "25%", y: "70%", delay: 3, duration: 5 },
  { x: "70%", y: "65%", delay: 2, duration: 8 },
];

export default function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <header className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden z-10 mesh-gradient">
      <div className="ambient-light-purple" style={{ top: "-10%", left: "10%" }} />
      <div className="ambient-light-cyan" style={{ bottom: "5%", right: "5%" }} />
      <div className="ambient-light-pink" style={{ top: "40%", left: "60%" }} />

      {!reduced && particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-neon-purple/30"
          style={{ left: p.x, top: p.y }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        >
          <Music className="w-6 h-6" />
        </motion.div>
      ))}

      <div className="relative z-10 px-5 md:px-16 max-w-[1440px] mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-block rounded-full bg-neon-purple/10 px-5 py-2 text-xs font-semibold tracking-widest uppercase text-neon-purple border border-neon-purple/20">
            AI-Powered Listening Intelligence
          </span>
        </motion.div>

        <h1 className="font-[var(--font-space-grotesk)] text-fluid-display gradient-text-animated mb-8">
          {reduced ? (
            <span>{words.join(" ")} </span>
          ) : (
            words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: "easeOut" }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))
          )}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: reduced ? 0 : 0.8 }}
          className="font-[var(--font-inter)] text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed font-light"
        >
          AI-powered YouTube Music listening intelligence that reveals the hidden patterns in your music taste.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reduced ? 0.2 : 1 }}
        >
          <button
            onClick={() => signIn("credentials")}
            className="gradient-button px-12 py-5 rounded-full font-[var(--font-space-grotesk)] text-xl text-white flex items-center gap-3 font-semibold cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.3)] glow-purple hover:scale-105 transition-transform"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Connect with YouTube Music
          </button>
        </motion.div>
      </div>
    </header>
  );
}
