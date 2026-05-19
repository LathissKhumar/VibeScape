"use client";

import { signOut } from "next-auth/react";

export default function DashboardNav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-3xl border-b border-glass-border">
      <div className="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1440px] mx-auto">
        <div className="font-[var(--font-outfit)] text-2xl font-bold text-on-surface tracking-tight">
          VibeDNA
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a className="text-neon-cyan font-bold border-b-2 border-neon-cyan pb-1 text-sm" href="#archetype">
            Archetypes
          </a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors text-sm" href="#galaxy">
            Galaxy
          </a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors text-sm" href="#science">
            Science
          </a>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full text-sm font-bold hover:brightness-110 active:scale-95 transition-all neon-glow-purple cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
