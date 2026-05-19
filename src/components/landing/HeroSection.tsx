"use client";

import { signIn } from "next-auth/react";
import { SlidersHorizontal } from "lucide-react";
import useReducedMotion from "@/hooks/useReducedMotion";

export default function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <header
      className="relative min-h-screen flex items-center pt-24 overflow-hidden z-10"
      style={reducedMotion ? undefined : { animation: "float 6s ease-in-out infinite" }}
    >
      <div className="relative z-10 px-5 md:px-16 max-w-[1440px] mx-auto w-full">
        <div className="max-w-4xl">
          <h1 className="font-[var(--font-outfit)] text-[40px] md:text-[64px] leading-[1.1] font-bold mb-8 tracking-tighter">
            Make people obsessed with{" "}
            <span className="text-gradient-cyan">discovering themselves</span>{" "}
            through music.
          </h1>
          <p className="font-[var(--font-inter)] text-lg text-on-surface-variant mb-12 max-w-2xl leading-relaxed">
            VibeDNA decodes your listening habits into a digital fingerprint. Explore your
            sonic galaxy and find the archetypes that define your soul.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => signIn("spotify")}
              className="gradient-button px-8 py-4 rounded-xl font-[var(--font-outfit)] text-2xl text-white flex items-center gap-2 font-semibold cursor-pointer"
            >
              <SlidersHorizontal className="w-6 h-6" />
              Connect with Spotify
            </button>
            <a
              href="#galaxy"
              className="glass-card px-8 py-4 rounded-xl font-[var(--font-outfit)] text-2xl text-on-surface flex items-center gap-2 hover:bg-white/5 transition-all font-semibold border border-glass-border h-auto inline-flex items-center justify-center"
            >
              Explore Galaxy
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
