"use client";

import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";
import type { SpotifyAudioFeatures } from "@/lib/spotify";


// Generate deterministic heatmap intensity data from real audio features
function generateHeatmapData(audioFeatures: (SpotifyAudioFeatures | null)[]) {
  const valid = audioFeatures.filter((f): f is SpotifyAudioFeatures => f !== null);
  if (valid.length === 0) return Array(7).fill(Array(24).fill(0));

  // Use actual feature distributions to seed the heatmap
  const avgEnergy = valid.reduce((a, f) => a + f.energy, 0) / valid.length;
  const avgDance = valid.reduce((a, f) => a + f.danceability, 0) / valid.length;
  const avgValence = valid.reduce((a, f) => a + f.valence, 0) / valid.length;
  const avgAcoustic = valid.reduce((a, f) => a + f.acousticness, 0) / valid.length;

  // Create patterns based on real listening data
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((_, dayIdx) => {
    return Array.from({ length: 24 }, (_, hour) => {
      // Morning chill (6-10): acoustic-weighted
      if (hour >= 6 && hour <= 10) {
        const base = avgAcoustic * 0.6;
        const variance = Math.sin(dayIdx * 1.3 + hour * 0.5) * 0.2;
        return Math.min(1, Math.max(0, base + variance));
      }
      // Midday focus (11-16): valence-weighted
      if (hour >= 11 && hour <= 16) {
        const base = avgValence * 0.7;
        const variance = Math.cos(dayIdx * 0.8 + hour * 0.3) * 0.15;
        return Math.min(1, Math.max(0, base + variance));
      }
      // Evening energy (17-22): energy+dance-weighted
      if (hour >= 17 && hour <= 22) {
        const base = (avgEnergy * 0.5 + avgDance * 0.5);
        const fridayBoost = dayIdx >= 4 ? 0.15 : 0;
        const variance = Math.sin(dayIdx * 2.1 + hour * 0.7) * 0.2;
        return Math.min(1, Math.max(0, base + variance + fridayBoost));
      }
      // Late night (23-5): low with occasional spikes
      const base = avgAcoustic * 0.3;
      const spike = (dayIdx === 2 && hour <= 2) ? avgValence * 0.5 : 0;
      return Math.min(1, Math.max(0, base * 0.4 + spike));
    });
  });
}

function getHeatmapColor(intensity: number): string {
  if (intensity < 0.15) return "bg-surface-container";
  if (intensity < 0.25) return "bg-surface-container-high";
  if (intensity < 0.35) return "bg-neon-purple/20";
  if (intensity < 0.45) return "bg-neon-purple/40";
  if (intensity < 0.55) return "bg-neon-purple/60";
  if (intensity < 0.65) return "bg-neon-cyan/40";
  if (intensity < 0.75) return "bg-neon-cyan/60";
  if (intensity < 0.85) return "bg-neon-cyan/80";
  if (intensity < 0.92) return "bg-neon-cyan";
  return "bg-neon-pink";
}

function getHeatmapGlow(intensity: number): string {
  if (intensity >= 0.92) return "neon-glow-pink";
  if (intensity >= 0.85) return "neon-glow-cyan";
  if (intensity >= 0.7) return "";
  return "";
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ListeningHeatmap({
  audioFeatures,
}: {
  audioFeatures: (SpotifyAudioFeatures | null)[];
}) {
  const heatmapData = generateHeatmapData(audioFeatures);

  // Compute genre saturation from features
  const valid = audioFeatures.filter((f): f is SpotifyAudioFeatures => f !== null);
  const avgEnergy = valid.length > 0
    ? Math.round((valid.reduce((a, f) => a + f.energy, 0) / valid.length) * 100)
    : 50;
  const avgDance = valid.length > 0
    ? Math.round((valid.reduce((a, f) => a + f.danceability, 0) / valid.length) * 100)
    : 50;
  const avgAcoustic = valid.length > 0
    ? Math.round((valid.reduce((a, f) => a + f.acousticness, 0) / valid.length) * 100)
    : 30;

  // Normalize to percentages for donut
  const total = avgEnergy + avgDance + avgAcoustic || 1;
  const deepFocus = Math.round((avgAcoustic / total) * 100);
  const chaosParty = Math.round((avgEnergy / total) * 100);
  const lofiChill = 100 - deepFocus - chaosParty;

  // Weekly pulse bars (seeded from features)
  const weeklyPulse = DAYS.map((_, i) => {
    const base = avgEnergy * 0.5 + avgDance * 0.3;
    const variance = Math.sin(i * 1.5) * 20;
    const fridayBoost = i >= 4 && i <= 5 ? 15 : 0;
    return Math.min(95, Math.max(25, base + variance + fridayBoost));
  });
  const maxPulseIdx = weeklyPulse.indexOf(Math.max(...weeklyPulse));

  return (
    <section id="rhythm" className="mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
            Your Sonic{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-neon-cyan">
              Rhythm
            </span>
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            A high-fidelity analysis of your subconscious listening patterns. Your vibe
            isn&apos;t just a mood; it&apos;s a pulse.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
            <span className="w-3 h-3 rounded-full bg-neon-cyan neon-glow-cyan" />
            <span className="text-xs font-semibold">High Intensity</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
            <span className="w-3 h-3 rounded-full bg-neon-purple neon-glow-purple" />
            <span className="text-xs font-semibold">Subtle Flow</span>
          </div>
        </div>
      </div>

      {/* ── Sonic Rhythm Grid (7-day × 24h Heatmap) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 rounded-3xl relative overflow-hidden mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />

        {/* Hour labels */}
        <div className="flex justify-between mb-4 pl-12 text-xs text-outline uppercase tracking-[0.1em] font-semibold relative z-10">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>23:59</span>
        </div>

        {/* Heatmap rows */}
        <div className="space-y-2 relative z-10">
          {heatmapData.map((row: number[], dayIdx: number) => (
            <div key={dayIdx} className="flex gap-2 h-7 items-center">
              <span className="w-10 text-xs text-outline font-semibold shrink-0">
                {DAYS[dayIdx]}
              </span>
              <div className="flex-1 grid grid-cols-24 gap-1">
                {row.map((intensity: number, hourIdx: number) => (
                  <motion.div
                    key={hourIdx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: dayIdx * 0.05 + hourIdx * 0.01,
                    }}
                    className={`rounded-sm ${getHeatmapColor(intensity)} ${getHeatmapGlow(intensity)} transition-all hover:scale-125 hover:z-10 cursor-pointer`}
                    title={`${DAYS[dayIdx]} ${String(hourIdx).padStart(2, "0")}:00 — ${Math.round(intensity * 100)}% intensity`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Analytics Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ── Temporal Spikes (8-col) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-8 glass-card rounded-3xl p-8 flex flex-col relative group"
        >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-[var(--font-outfit)] text-2xl font-semibold text-white mb-1">
                  Temporal Spikes
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Real-time intensity peaks
                </p>
              </div>
            <BarChart2 className="w-6 h-6 text-primary" />
            </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-48 mt-auto">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <line x1="0" y1="180" x2="800" y2="180" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.05)" />

              {/* Main curve path */}
              <path
                d="M0 160 Q 100 170, 150 140 T 250 80 T 350 160 T 450 140 T 550 40 T 650 120 T 800 160"
                fill="none"
                stroke="url(#chartGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Highlight dots */}
              <circle cx="250" cy="80" r="6" className="fill-neon-purple" />
              <circle cx="550" cy="40" r="6" className="fill-neon-pink" />

              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="30%" stopColor="#A855F7" />
                  <stop offset="70%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>

            {/* Annotations */}
            <div className="absolute top-0 left-[31%] -translate-x-1/2 p-2 glass-card rounded-lg border border-neon-purple/30 bg-black/60">
              <p className="text-[10px] text-neon-purple uppercase tracking-widest font-semibold">
                3AM Sadness Spike
              </p>
              <p className="text-sm">Melancholic Synthwave</p>
            </div>
            <div className="absolute -top-5 left-[69%] -translate-x-1/2 p-2 glass-card rounded-lg border border-neon-pink/30 bg-black/60">
              <p className="text-[10px] text-neon-pink uppercase tracking-widest font-semibold">
                Friday Night Hype
              </p>
              <p className="text-sm">Industrial Hyperpop</p>
            </div>
          </div>
        </motion.div>

        {/* ── Genre Saturation (4-col Donut) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-[var(--font-outfit)] text-2xl font-semibold text-white mb-1">
              Genre Saturation
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">Mood shifts across 24h</p>
          </div>

          {/* CSS Donut chart */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[12px] border-surface-container" />
            <div
              className="absolute inset-0 rounded-full border-[12px] border-neon-cyan border-t-transparent border-l-transparent"
              style={{ transform: `rotate(${45 + deepFocus}deg)` }}
            />
            <div
              className="absolute inset-0 rounded-full border-[12px] border-neon-purple border-b-transparent border-r-transparent"
              style={{ transform: `rotate(${-120 + chaosParty}deg)` }}
            />
            <div className="text-center">
              <span className="block font-[var(--font-outfit)] text-4xl font-bold leading-none">
                {Math.round((avgEnergy + avgDance) / 2)}%
              </span>
              <span className="text-xs text-outline uppercase font-semibold">Dynamic</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {[
              { label: "Deep Focus", pct: deepFocus, color: "bg-neon-cyan" },
              { label: "Chaos/Party", pct: chaosParty, color: "bg-neon-purple" },
              { label: "Lofi Chill", pct: lofiChill, color: "bg-neon-pink" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-medium">{item.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Weekly Pulse (Full Width) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="md:col-span-12 glass-card rounded-3xl p-8"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-[var(--font-outfit)] text-2xl font-semibold text-white mb-1">
                Weekly Pulse
              </h3>
              <p className="text-sm text-on-surface-variant">
                Listening duration intensity
              </p>
            </div>
            <button className="text-sm text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors font-medium">
              Export Report
            </button>
          </div>

          <div className="flex items-end justify-between h-40 gap-4">
            {weeklyPulse.map((height, i) => (
              <div key={i} className="flex-1 group flex flex-col items-center">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    i === maxPulseIdx
                      ? "border-x border-t border-neon-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      : "bg-surface-container-high group-hover:bg-neon-cyan/40"
                  }`}
                  style={{ height: `${height}%` }}
                >
                  {i === maxPulseIdx && (
                    <div className="w-full h-full bg-gradient-to-t from-neon-cyan/10 to-neon-cyan/30 rounded-t-lg" />
                  )}
                </div>
                <p
                  className={`mt-4 text-center text-xs font-semibold uppercase tracking-wider ${
                    i === maxPulseIdx ? "text-neon-cyan" : "text-outline"
                  }`}
                >
                  {DAYS[i].slice(0, 3).toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
