"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PersonalityCard from "@/components/PersonalityCard";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardErrorBoundary from "@/components/dashboard/DashboardErrorBoundary";
import DashboardBentoGrid from "@/components/dashboard/DashboardBentoGrid";
import PersonalityHero from "@/components/dashboard/PersonalityHero";
import ListeningHeatmapSection from "@/components/dashboard/ListeningHeatmapSection";
import AudioRadarSection from "@/components/dashboard/AudioRadarSection";
import ArtistCardsSection from "@/components/dashboard/ArtistCardsSection";
import AIInsightsSheet from "@/components/dashboard/AIInsightsSheet";
import type { SpotifyArtist, SpotifyAudioFeatures } from "@/lib/spotify";
import type { Personality } from "@/types/next-auth";
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
  // Computed values for inline sections (Galaxy overlay, etc.)
  const validFeatures = audioFeatures.filter((f): f is SpotifyAudioFeatures => f !== null);
  const avgValence = validFeatures.length > 0
    ? Math.round((validFeatures.reduce((a, f) => a + (f.valence || 0), 0) / validFeatures.length) * 100)
    : 0;
  const topGenres = [...new Set(topArtists.flatMap((a) => a.genres))].slice(0, 3);
  return (
    <div className="min-h-screen bg-bg-deep text-on-surface">
      <DashboardNav />
      {/* Background Atmospheric Gradient */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/20 via-bg-deep/80 to-bg-deep" />
      </div>
      <main className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-16 pt-32 pb-20">
        {/* Personality Hero */}
        <DashboardErrorBoundary>
          <PersonalityHero personality={personality} />
        </DashboardErrorBoundary>
        {/* Bento Grid: Heatmap + Artist Cards */}
        <DashboardBentoGrid>
          <DashboardErrorBoundary>
            <ListeningHeatmapSection audioFeatures={audioFeatures} />
          </DashboardErrorBoundary>
          <DashboardErrorBoundary>
            <ArtistCardsSection
              topArtists={topArtists}
              listeningAura={personality.listeningAura}
            />
          </DashboardErrorBoundary>
        </DashboardBentoGrid>
        {/* Sonic DNA: Radar Chart + Personality Card */}
        <section id="science" className="mt-20">
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
            Sonic DNA
          </h2>
          <p className="text-lg text-on-surface-variant mb-12">
            A deeper look at the audio properties that define your identity.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardErrorBoundary>
              <AudioRadarSection
                audioFeatures={audioFeatures}
                auraColor={personality.listeningAura}
              />
            </DashboardErrorBoundary>
            <div className="h-[400px]">
              <DashboardErrorBoundary>
                <PersonalityCard personality={personality} />
              </DashboardErrorBoundary>
            </div>
          </div>
        </section>
        {/* Galaxy 3D Universe (stays inline — enhanced in Task 23) */}
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
      {/* AI Insights FAB + Sheet */}
      <DashboardErrorBoundary>
        <AIInsightsSheet
          personality={personality}
          topArtists={topArtists}
          audioFeatures={audioFeatures}
        />
      </DashboardErrorBoundary>
    </div>
  );
}
