"use client";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardErrorBoundary from "@/components/dashboard/DashboardErrorBoundary";
import DashboardBentoGrid from "@/components/dashboard/DashboardBentoGrid";
import PersonalityHero from "@/components/dashboard/PersonalityHero";
import ListeningHeatmapSection from "@/components/dashboard/ListeningHeatmapSection";
import AudioRadarSection from "@/components/dashboard/AudioRadarSection";
import ArtistCardsSection from "@/components/dashboard/ArtistCardsSection";
import AIInsightsSheet from "@/components/dashboard/AIInsightsSheet";
import MusicTwinFinder from "@/components/dashboard/MusicTwinFinder";
import RecommendationsSection from "@/components/dashboard/RecommendationsSection";
import ListeningTimeline from "@/components/dashboard/ListeningTimeline";
import FeatureFlagsAdminPanel from "@/components/dashboard/FeatureFlagsAdminPanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ListeningStatsSection from "@/components/dashboard/ListeningStatsSection";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { SpotifyArtist, SpotifyAudioFeatures, SpotifyRecentlyPlayed } from "@/lib/spotify";
import type { Personality } from "@/types/next-auth";
const Galaxy = dynamic(() => import("@/components/Galaxy"), { ssr: false });
const PersonalityCard = dynamic(() => import("@/components/PersonalityCard"), { ssr: false });

interface DashboardClientProps {
  personality: Personality;
  topArtists: SpotifyArtist[];
  audioFeatures: (SpotifyAudioFeatures | null)[];
  avgAudioFeatures?: SpotifyAudioFeatures;
  recentlyPlayed: SpotifyRecentlyPlayed[];
  totalListeningMinutes: number;
  topGenres: string[];
}

export default function DashboardClient({
  personality,
  topArtists,
  audioFeatures,
  avgAudioFeatures,
  recentlyPlayed,
  totalListeningMinutes,
  topGenres,
}: DashboardClientProps) {
  const [activeSection, setActiveSection] = useState("archetypes");
  const { hasFlag, isLoading } = useFeatureFlags();
  const { trackSectionView } = useAnalytics();
  const validFeatures = audioFeatures.filter((f): f is SpotifyAudioFeatures => f !== null);
  const avgValence = avgAudioFeatures
    ? Math.round(avgAudioFeatures.valence * 100)
    : validFeatures.length > 0
      ? Math.round((validFeatures.reduce((a, f) => a + (f.valence || 0), 0) / validFeatures.length) * 100)
      : 0;
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setActiveSection(sectionId);
            trackSectionView(sectionId);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [trackSectionView]);
  return (
    <div className="min-h-screen bg-bg-deep text-on-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-neon-purple focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>
      <DashboardNav activeSection={activeSection} />
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/20 via-bg-deep/80 to-bg-deep" />
      </div>
      <main id="main-content" className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-16 pt-32 pb-20" role="main" aria-label="Dashboard content">
        <DashboardErrorBoundary>
          <PersonalityHero personality={personality} />
        </DashboardErrorBoundary>
        <section id="patterns" className="mt-20" aria-label="Listening patterns">
          <DashboardBentoGrid>
            <DashboardErrorBoundary>
              <ListeningHeatmapSection recentlyPlayed={recentlyPlayed} />
            </DashboardErrorBoundary>
            <DashboardErrorBoundary>
              <ArtistCardsSection
                topArtists={topArtists}
                listeningAura={personality.listeningAura}
              />
            </DashboardErrorBoundary>
          </DashboardBentoGrid>
        </section>
        <section id="stats" className="mt-20" aria-label="Listening statistics">
          <DashboardBentoGrid>
            <DashboardErrorBoundary>
              <ListeningStatsSection
                recentlyPlayed={recentlyPlayed}
                audioFeatures={audioFeatures}
                totalListeningMinutes={totalListeningMinutes}
              />
            </DashboardErrorBoundary>
          </DashboardBentoGrid>
        </section>
        <section id="sonic-dna" className="mt-20 glass-enhanced rounded-3xl p-8 md:p-12" aria-label="Sonic DNA analysis">
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
            Sonic DNA
          </h2>
          <p className="text-lg text-on-surface-variant mb-8">
            A deeper look at the audio properties that define your identity.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardErrorBoundary>
              <AudioRadarSection
                audioFeatures={audioFeatures}
                auraColor={personality.listeningAura}
              />
            </DashboardErrorBoundary>
            <DashboardErrorBoundary>
              <Suspense fallback={<div className="glass-enhanced rounded-3xl p-12 animate-pulse" />}>
                <PersonalityCard personality={personality} />
              </Suspense>
            </DashboardErrorBoundary>
          </div>
        </section>
        <section id="universe" className="mt-20" aria-label="Music universe visualization">
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
            Your Music Universe
          </h2>
          <p className="text-lg text-on-surface-variant mb-8">
            Explore your top artists in an immersive 3D galaxy.
          </p>
          <div className="glass-enhanced rounded-3xl border border-white/5 h-[500px] md:h-[700px] relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <Suspense fallback={<div className="glass-enhanced rounded-3xl p-12 animate-pulse" />}>
                <Galaxy topArtists={topArtists} />
              </Suspense>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-start">
                <div className="glass-enhanced rounded-xl p-6 shadow-2xl shadow-black/40 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[var(--font-outfit)] text-2xl font-semibold text-white">
                      Vibe Sector
                    </h3>
                    <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/20 font-semibold">
                      High Density
                    </Badge>
                  </div>
                  <p className="text-on-surface-variant text-base leading-relaxed">
                    You are currently traversing the {topGenres[0] || "Synth-Pop"} nebula. Artists in
                    this region share a {avgValence}% DNA match with your evening mood.
                  </p>
                </div>
                <div className="flex gap-4 shrink-0">
                  <Card className="glass-enhanced rounded-xl border-0">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <span className="font-[var(--font-outfit)] text-2xl font-bold text-neon-cyan">
                        {topArtists.length}
                      </span>
                      <span className="text-xs text-outline uppercase tracking-wider font-semibold">Stars</span>
                    </CardContent>
                  </Card>
                  <Card className="glass-enhanced rounded-xl border-0">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <span className="font-[var(--font-outfit)] text-2xl font-bold text-neon-pink">
                        {topGenres.length}
                      </span>
                      <span className="text-xs text-outline uppercase tracking-wider font-semibold">Nebulae</span>
                    </CardContent>
                  </Card>
                  <Card className="glass-enhanced rounded-xl border-0">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <span className="font-[var(--font-outfit)] text-2xl font-bold text-neon-purple">
                        {Math.round(totalListeningMinutes / 60)}h
                      </span>
                      <span className="text-xs text-outline uppercase tracking-wider font-semibold">Listened</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="music-twin" className="mt-20" aria-label="Music twin finder">
          <DashboardErrorBoundary>
            <MusicTwinFinder
              userProfile={{
                genres: [...new Set(topArtists.flatMap((a) => a.genres))],
                topArtists: topArtists.map((a) => a.name),
              }}
            />
          </DashboardErrorBoundary>
        </section>
        <section id="recommendations" className="mt-20" aria-label="Music recommendations">
          <DashboardErrorBoundary>
            <RecommendationsSection
              userProfile={{
                genres: [...new Set(topArtists.flatMap((a) => a.genres))],
                topArtists: topArtists.map((a) => a.name),
              }}
            />
          </DashboardErrorBoundary>
        </section>
        <section id="timeline" className="mt-20" aria-label="Listening timeline">
          <DashboardErrorBoundary>
            <ListeningTimeline recentlyPlayed={recentlyPlayed} />
          </DashboardErrorBoundary>
        </section>
        <section id="settings" className="mt-20 glass-enhanced rounded-3xl p-8 md:p-12" aria-label="Settings and activity">
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold text-white mb-4">
            Settings & Activity
          </h2>
          <p className="text-lg text-on-surface-variant mb-8">
            Manage feature flags and view your activity log.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardErrorBoundary>
              <FeatureFlagsAdminPanel />
            </DashboardErrorBoundary>
            <DashboardErrorBoundary>
              <ActivityFeed />
            </DashboardErrorBoundary>
          </div>
        </section>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 glass-enhanced rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border-neon-purple/30"
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-neon-purple blur-3xl opacity-20" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-neon-cyan blur-3xl opacity-20" />
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold mb-6">
            Orchestrate Your Sonic Identity
          </h2>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto mb-10">
            Dive deeper into your data and discover how your vibe evolves over time with Resona Premium.
          </p>
          <button className="bg-gradient-to-r from-neon-purple to-neon-pink text-white px-10 py-5 rounded-full font-[var(--font-outfit)] text-2xl font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(244,114,182,0.4)] cursor-pointer">
            Upgrade to Premium
          </button>
        </motion.section>
      </main>
      <footer className="w-full py-12 px-5 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-deep border-t border-glass-border relative z-20">
        <div className="flex flex-col items-center md:items-start">
          <div className="font-[var(--font-outfit)] text-2xl font-semibold text-on-surface mb-2">Resona</div>
          <p className="text-xs text-outline">&copy; 2026 Resona. Orchestrating your sonic identity.</p>
        </div>
        <div className="flex gap-2 md:gap-8">
          <a className="text-xs text-outline hover:text-primary transition-colors px-3 py-2 md:px-0 md:py-0" href="#">Privacy</a>
          <a className="text-xs text-outline hover:text-primary transition-colors px-3 py-2 md:px-0 md:py-0" href="#">Terms</a>
          <a className="text-xs text-outline hover:text-primary transition-colors px-3 py-2 md:px-0 md:py-0" href="#">Support</a>
        </div>
      </footer>
      {(isLoading || hasFlag("ai_insights")) && (
      <DashboardErrorBoundary>
        <AIInsightsSheet
          personality={personality}
          topArtists={topArtists}
          audioFeatures={audioFeatures}
        />
      </DashboardErrorBoundary>
      )}
    </div>
  );
}
