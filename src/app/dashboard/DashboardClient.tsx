"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import PersonalityCard from "@/components/PersonalityCard";
import AudioFeaturesChart from "@/components/AudioFeaturesChart";
import type { SpotifyArtist, SpotifyAudioFeatures } from "@/lib/spotify";
import type { Personality } from "@/types/next-auth";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { SparklesIcon } from "lucide-react";

const Galaxy = dynamic(() => import("@/components/Galaxy"), { ssr: false });

interface DashboardClientProps {
  personality: Personality;
  topArtists: SpotifyArtist[];
  audioFeatures: (SpotifyAudioFeatures | null)[];
}

export default function DashboardClient({
  personality,
  topArtists,
  audioFeatures,
}: DashboardClientProps) {
  const validFeatures = audioFeatures.filter((f): f is SpotifyAudioFeatures => f !== null);
  const avgEnergy = validFeatures.length > 0
    ? Math.round((validFeatures.reduce((a, f) => a + (f.energy || 0), 0) / validFeatures.length) * 100)
    : 0;
  const avgDanceability = validFeatures.length > 0
    ? Math.round((validFeatures.reduce((a, f) => a + (f.danceability || 0), 0) / validFeatures.length) * 100)
    : 0;
  const avgAcousticness = validFeatures.length > 0
    ? Math.round((validFeatures.reduce((a, f) => a + (f.acousticness || 0), 0) / validFeatures.length) * 100)
    : 0;
  const avgValence = validFeatures.length > 0
    ? Math.round((validFeatures.reduce((a, f) => a + (f.valence || 0), 0) / validFeatures.length) * 100)
    : 0;

  const topThreeArtists = topArtists.slice(0, 3);
  const artistLabels = ["Top Artist", "Rising Influence", "The Classic"];
  const artistIcons = ["stars", "trending_up", "history"];
  const artistColors = ["text-neon-purple", "text-neon-pink", "text-secondary"];
  const labelColors = ["text-neon-cyan", "text-neon-pink", "text-secondary"];

  const topGenres = [...new Set(topArtists.flatMap((a) => a.genres))].slice(0, 3);

  return (
    <div className="min-h-screen bg-bg-deep text-on-surface">
      {/* Top Navigation */}
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

      {/* Background Atmospheric Image */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/20 via-bg-deep/80 to-bg-deep" />
      </div>

      <main className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-16 pt-32 pb-20">
        {/* Hero Section: Archetype */}
        <motion.section
          id="archetype"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-20"
        >
          <div className="relative mb-8">
            <div className="archetype-aura absolute inset-0 blur-3xl scale-150 rounded-full animate-pulse" />
            <div className="relative z-10 p-1 rounded-full bg-gradient-to-tr from-neon-purple via-neon-cyan to-neon-pink">
              <div className="bg-bg-deep rounded-full p-6 overflow-hidden">
                <span
                  className="material-symbols-outlined text-8xl"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                    color: personality.listeningAura,
                    textShadow: `0 0 30px ${personality.listeningAura}80`,
                  }}
                >
                  fingerprint
                </span>
              </div>
            </div>
          </div>

          <h1 className="font-[var(--font-outfit)] text-[40px] md:text-[64px] leading-[1.1] tracking-tighter text-white mb-4 font-bold">
            {personality.primaryArchetype.split(" ").map((word: string, i: number) => {
              if (i === 0) return <span key={i}>{word} </span>;
              return (
                <span
                  key={i}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan"
                >
                  {word}{" "}
                </span>
              );
            })}
          </h1>

          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
            {personality.summary}
          </p>

          <div className="flex gap-4">
            <button className="glass-card px-8 py-4 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-all border-white/20 cursor-pointer">
              <span className="material-symbols-outlined">share</span> Share DNA
            </button>
            <a
              href="#galaxy"
              className="bg-secondary text-on-secondary px-8 py-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all neon-glow-cyan"
            >
              <span className="material-symbols-outlined">explore</span> Explore Galaxy
            </a>
          </div>
        </motion.section>

        {/* Bento Grid Insights */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Listening Aura: Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-8 glass-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative"
          >
            <div className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-tr from-neon-purple via-transparent to-neon-cyan pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-[var(--font-outfit)] text-[32px] leading-[1.3] font-semibold mb-2">
                Listening Aura
              </h2>
              <p className="text-base text-outline mb-8">Your emotional resonance through the day.</p>
            </div>
            <div className="h-64 w-full flex items-end gap-2 relative z-10">
              {[
                { h: "75%", color: "bg-neon-purple/20", border: "border-neon-purple/50" },
                { h: "50%", color: "bg-neon-purple/30", border: "border-neon-purple/60" },
                { h: "100%", color: "bg-neon-cyan/40", border: "border-neon-cyan/70" },
                { h: "66%", color: "bg-neon-cyan/30", border: "border-neon-cyan/60" },
                { h: "33%", color: "bg-neon-pink/20", border: "border-neon-pink/50" },
                { h: "75%", color: "bg-neon-purple/20", border: "border-neon-purple/50" },
                { h: "50%", color: "bg-secondary/20", border: "border-secondary/50" },
              ].map((bar, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: bar.h }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  className={`flex-1 ${bar.color} rounded-t-lg border-t ${bar.border}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-outline uppercase tracking-[0.1em] font-semibold relative z-10">
              <span>Morning: Chill</span>
              <span>Noon: Focused</span>
              <span>Evening: Energetic</span>
              <span>Night: Ethereal</span>
            </div>
          </motion.div>

          {/* Sonic Traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col items-center"
          >
            <h2 className="font-[var(--font-outfit)] text-2xl font-semibold mb-6 w-full text-left">
              Sonic Traits
            </h2>
            <div className="w-full space-y-6">
              {[
                { label: "Energy", value: avgEnergy, color: "from-neon-purple to-neon-cyan", accent: "text-neon-cyan" },
                { label: "Danceability", value: avgDanceability, color: "from-neon-pink to-neon-purple", accent: "text-neon-pink" },
                { label: "Acousticness", value: avgAcousticness, color: "from-secondary to-neon-cyan", accent: "text-secondary" },
              ].map((trait) => (
                <div key={trait.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{trait.label}</span>
                    <span className={`text-sm font-medium ${trait.accent}`}>{trait.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trait.value}%` }}
                      transition={{ duration: 1.2, delay: 0.6 }}
                      className={`h-full bg-gradient-to-r ${trait.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-outline mb-1 uppercase tracking-tighter font-semibold">Primary Mood</p>
              <p className="font-[var(--font-outfit)] text-2xl font-semibold text-white">
                {topGenres[0] ? topGenres[0].charAt(0).toUpperCase() + topGenres[0].slice(1) : "Lo-fi"}
              </p>
            </div>
          </motion.div>

          {/* Sonic Influences Heading */}
          <div className="md:col-span-12 mt-20">
            <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
              Sonic Influences
            </h2>
            <p className="text-lg text-on-surface-variant mb-12">
              The architects of your personal soundscape.
            </p>
          </div>

          {/* Artist Cards with shadcn Card */}
          {topThreeArtists.map((artist, idx) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + idx * 0.15 }}
              className="md:col-span-4"
            >
              <Card className="glass-card rounded-3xl overflow-hidden transition-transform duration-500 hover:-translate-y-2 border-0 h-full">
                {/* Artist visual — gradient header */}
                <div
                  className="w-full h-48 opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${personality.listeningAura}40 0%, rgba(22,17,27,0.8) 50%, ${["#22D3EE", "#F472B6", "#A855F7"][idx]}40 100%)`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className={`material-symbols-outlined text-6xl ${artistColors[idx]} opacity-60`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {artistIcons[idx]}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className={`text-xs ${labelColors[idx]} uppercase tracking-[0.1em] mb-1 font-semibold`}>
                        {artistLabels[idx]}
                      </p>
                      <h3 className="font-[var(--font-outfit)] text-2xl font-semibold text-on-surface">{artist.name}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center shrink-0">
                      <span
                        className={`material-symbols-outlined text-lg ${artistColors[idx]}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {artistIcons[idx]}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {artist.genres.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="outline" className="bg-white/5 border-white/10 text-on-surface-variant text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {artist.genres.length === 0 && (
                      <span className="text-base text-on-surface-variant">Genre-defying artist</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Audio Features Radar Chart */}
        <section id="science" className="mt-20">
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
            Sonic DNA
          </h2>
          <p className="text-lg text-on-surface-variant mb-12">
            A deeper look at the audio properties that define your identity.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[400px]">
              <AudioFeaturesChart audioFeatures={audioFeatures} auraColor={personality.listeningAura} />
            </div>
            <div className="h-[400px]">
              <PersonalityCard personality={personality} />
            </div>
          </div>
        </section>

        {/* Galaxy 3D Universe */}
        <section id="galaxy" className="mt-20">
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
            Your Music Universe
          </h2>
          <p className="text-lg text-on-surface-variant mb-8">
            Explore your top artists in an immersive 3D galaxy.
          </p>
          <div className="glass-card rounded-3xl border border-white/5 h-[700px] relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <Galaxy topArtists={topArtists} />
            </div>
            {/* Vibe Sector Overlay */}
            <div className="absolute bottom-6 right-6 w-80 flex flex-col space-y-4 z-20">
              <div className="glass-card rounded-xl p-6 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[var(--font-outfit)] text-2xl font-semibold text-white">
                    Vibe Sector
                  </h3>
                  <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/20 font-semibold">
                    High Density
                  </Badge>
                </div>
                <p className="text-on-surface-variant text-base mb-6 leading-relaxed">
                  You are currently traversing the {topGenres[0] || "Synth-Pop"} nebula. Artists in
                  this region share a {avgValence}% DNA match with your evening mood.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass-card rounded-xl border-0">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <span className="font-[var(--font-outfit)] text-2xl font-bold text-neon-cyan">
                      {topArtists.length}
                    </span>
                    <span className="text-xs text-outline uppercase tracking-wider font-semibold">Stars</span>
                  </CardContent>
                </Card>
                <Card className="glass-card rounded-xl border-0">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <span className="font-[var(--font-outfit)] text-2xl font-bold text-neon-pink">
                      {topGenres.length}
                    </span>
                    <span className="text-xs text-outline uppercase tracking-wider font-semibold">Nebulae</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 glass-card rounded-3xl p-12 text-center relative overflow-hidden border-neon-purple/30"
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-neon-purple blur-3xl opacity-20" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-neon-cyan blur-3xl opacity-20" />
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold mb-6">
            Orchestrate Your Sonic Identity
          </h2>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto mb-10">
            Dive deeper into your data and discover how your vibe evolves over time with VibeDNA Premium.
          </p>
          <button className="bg-gradient-to-r from-neon-purple to-neon-pink text-white px-10 py-5 rounded-full font-[var(--font-outfit)] text-2xl font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(244,114,182,0.4)] cursor-pointer">
            Upgrade to Premium
          </button>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-5 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-deep border-t border-glass-border relative z-20">
        <div className="flex flex-col items-center md:items-start">
          <div className="font-[var(--font-outfit)] text-2xl font-semibold text-on-surface mb-2">VibeDNA</div>
          <p className="text-xs text-outline">&copy; 2024 VibeDNA. Orchestrating your sonic identity.</p>
        </div>
        <div className="flex gap-8">
          <a className="text-xs text-outline hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="text-xs text-outline hover:text-primary transition-colors" href="#">Terms</a>
          <a className="text-xs text-outline hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </footer>

      {/* FAB - Floating Action Button with AI Insights Sheet */}
      <Sheet>
        <SheetTrigger
          render={
            <button className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <SparklesIcon className="size-6" />
            </button>
          }
        />
        <SheetContent side="right" className="w-full sm:max-w-md bg-surface border-glass-border overflow-y-auto">
          <SheetHeader className="border-b border-glass-border pb-4 mb-4">
            <SheetTitle className="font-[var(--font-outfit)] text-2xl text-white flex items-center gap-2">
              <SparklesIcon className="size-5 text-neon-cyan" />
              AI Insights
            </SheetTitle>
            <SheetDescription className="text-on-surface-variant">
              Your personalized listening intelligence
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-1">
            {/* Archetype Card */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">
                  {personality.primaryArchetype}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-on-surface-variant mb-3">{personality.summary}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                    {personality.secondaryTrait}
                  </Badge>
                  <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                    Chaos: {personality.chaosIndex}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Mood Overview */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">Mood Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Energy</span>
                    <span className="text-neon-cyan font-medium">{avgEnergy}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full" style={{ width: `${avgEnergy}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Danceability</span>
                    <span className="text-neon-pink font-medium">{avgDanceability}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-pink to-neon-purple rounded-full" style={{ width: `${avgDanceability}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Acousticness</span>
                    <span className="text-secondary font-medium">{avgAcousticness}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-neon-cyan rounded-full" style={{ width: `${avgAcousticness}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Genres */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">Top Genres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {topGenres.map((genre) => (
                    <Badge key={genre} className="bg-white/10 text-on-surface hover:bg-white/20 border-0 capitalize">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Listening Stats */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="font-[var(--font-outfit)] text-lg text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <p className="text-neon-cyan text-2xl font-bold font-[var(--font-outfit)]">{topArtists.length}</p>
                  <p className="text-xs text-outline">Artists Analyzed</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <p className="text-neon-pink text-2xl font-bold font-[var(--font-outfit)]">{validFeatures.length}</p>
                  <p className="text-xs text-outline">Tracks Analyzed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
