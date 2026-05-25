"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fingerprint, ArrowLeft, Share2Icon, CheckIcon, Music2 } from "lucide-react";
import Link from "next/link";

interface EncodedPersonality {
  archetype: string;
  secondaryTrait: string;
  aura: string;
  summary: string;
  chaosIndex: string;
  genres?: string[];
  topArtists?: string[];
}

interface CompatibilityResponse {
  ok: boolean;
  compatibility: {
    score: number;
    label: string;
  };
  profiles: {
    a: { genreCount: number; artistCount: number };
    b: { genreCount: number; artistCount: number };
  };
}

const AURA_COLORS: Record<string, string> = {
  Purple: "#A855F7",
  Cyan: "#22D3EE",
  Pink: "#F472B6",
  Emerald: "#34D399",
  Amber: "#FBBF24",
};

function decodePersonality(param: string | null): EncodedPersonality | null {
  if (!param) return null;
  try {
    const decoded = decodeURIComponent(atob(param));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getSharedGenres(a: string[], b: string[]): string[] {
  return a.filter((g) => b.includes(g));
}

function getContrastingTraits(a: EncodedPersonality, b: EncodedPersonality): string[] {
  const traits: string[] = [];
  if (a.archetype !== b.archetype) {
    traits.push(`Different archetypes: ${a.archetype} vs ${b.archetype}`);
  }
  if (a.aura !== b.aura) {
    traits.push(`Different auras: ${a.aura} vs ${b.aura}`);
  }
  const chaosA = parseInt(a.chaosIndex) || 0;
  const chaosB = parseInt(b.chaosIndex) || 0;
  if (Math.abs(chaosA - chaosB) > 30) {
    traits.push(`Chaos gap: ${a.chaosIndex} vs ${b.chaosIndex}`);
  }
  return traits;
}

function CompatibilityMeter({ score }: { score: number }) {
  const percentage = Math.round(score * 100);
  const color = percentage >= 70 ? "#A855F7" : percentage >= 40 ? "#FBBF24" : "#F472B6";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-outline font-medium">Vibe Compatibility</span>
        <span className="font-bold text-lg" style={{ color }}>{percentage}%</span>
      </div>
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ArchetypeMiniCard({ data, label }: { data: EncodedPersonality; label: string }) {
  const color = AURA_COLORS[data.aura] || "#A855F7";

  return (
    <Card className="glass-card border-0 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-15 blur-[50px] pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${color}, transparent 70%)` }}
      />
      <CardContent className="relative z-10 p-6">
        <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-semibold">
          {label}
        </span>
        <div className="flex items-center gap-3 mt-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Fingerprint className="w-5 h-5" style={{ color }} />
          </div>
          <h3
            className="font-[var(--font-outfit)] text-xl font-bold text-white"
            style={{ textShadow: `0 0 20px ${color}60` }}
          >
            {data.archetype}
          </h3>
        </div>

        <Badge
          variant="outline"
          className="inline-flex items-center gap-2 mb-3 px-2 py-0.5 rounded-full bg-white/5 border-white/10 text-xs"
        >
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-on-surface-variant">{data.secondaryTrait}</span>
        </Badge>

        <p className="text-on-surface-variant text-sm leading-relaxed italic mb-4">
          &quot;{data.summary}&quot;
        </p>

        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-outline">Chaos Index</span>
          <span className="text-xs font-bold text-on-surface">{data.chaosIndex}</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: data.chaosIndex, backgroundColor: color }} />
        </div>

        {data.genres && data.genres.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] text-outline mb-1.5 uppercase tracking-[0.1em]">Top Genres</p>
            <div className="flex flex-wrap gap-1.5">
              {data.genres.map((g) => (
                <Badge key={g} variant="secondary" className="px-1.5 py-0 text-[10px] rounded-full bg-white/5 text-on-surface-variant">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CompareContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [compatibility, setCompatibility] = useState<CompatibilityResponse["compatibility"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const friendData = useMemo(() => decodePersonality(searchParams.get("data")), [searchParams]);

  const mockYou: EncodedPersonality = {
    archetype: "The Midnight Architect",
    secondaryTrait: "Analytical Dreamer",
    aura: "Purple",
    summary: "You build worlds in the quiet hours — structured chaos with a poetic core.",
    chaosIndex: "73%",
    genres: ["indie rock", "electronic", "ambient", "post-rock"],
    topArtists: ["Radiohead", "Bon Iver", "Tycho"],
  };

  const you = mockYou;
  const friend = friendData || {
    archetype: "The Neon Alchemist",
    secondaryTrait: "Chaotic Harmonist",
    aura: "Cyan",
    summary: "You transmute raw energy into golden moments — unpredictable but always in tune.",
    chaosIndex: "85%",
    genres: ["hip hop", "electronic", "r&b", "trap"],
    topArtists: ["Kendrick Lamar", "Frank Ocean", "Kaytranada"],
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchCompatibility() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/recommend/vibe-compatibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileA: { genres: you.genres || [], topArtists: you.topArtists || [] },
            profileB: { genres: (friend as EncodedPersonality).genres || [], topArtists: (friend as EncodedPersonality).topArtists || [] },
          }),
        });
        if (!res.ok) throw new Error("Failed to fetch compatibility");
        const data: CompatibilityResponse = await res.json();
        if (!cancelled) {
          setCompatibility(data.compatibility);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCompatibility();
    return () => { cancelled = true; };
  }, [you, friend]);

  const shared = getSharedGenres(you.genres || [], (friend as EncodedPersonality).genres || []);
  const contrasting = getContrastingTraits(you, friend as EncodedPersonality);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">Back to Resona</span>
          </Link>
          <span className="text-sm font-[var(--font-outfit)] font-bold text-white/40">Resona</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <Music2 className="size-4 text-neon-purple" />
              <span className="text-sm text-on-surface-variant">Vibe Comparison</span>
            </div>
            <h1 className="font-[var(--font-outfit)] text-4xl md:text-5xl font-bold mb-3">
              <span className="text-white">Your Vibe</span>
              <span className="text-white/30 mx-3">vs</span>
              <span className="text-neon-cyan">Their Vibe</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
              See how your musical DNA stacks up
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass-card border-0">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <p className="text-sm text-outline mb-1">Compatibility Score</p>
                {loading ? (
                  <p className="font-[var(--font-outfit)] text-2xl font-bold text-white/40 animate-pulse">
                    Calculating...
                  </p>
                ) : error ? (
                  <p className="font-[var(--font-outfit)] text-2xl font-bold text-red-400">
                    {error}
                  </p>
                ) : compatibility ? (
                  <p className="font-[var(--font-outfit)] text-2xl font-bold text-white">
                    {compatibility.label}
                  </p>
                ) : null}
              </div>
              {compatibility && !loading && !error && (
                <CompatibilityMeter score={compatibility.score} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ArchetypeMiniCard data={you} label="You" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ArchetypeMiniCard data={friend as EncodedPersonality} label="Friend" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <p className="text-xs text-outline mb-3 uppercase tracking-[0.1em] font-semibold">
                  Shared Genres ({shared.length})
                </p>
                {shared.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {shared.map((g) => (
                      <Badge key={g} className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                        {g}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant text-sm italic">No overlapping genres — totally different vibes!</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <p className="text-xs text-outline mb-3 uppercase tracking-[0.1em] font-semibold">
                  Contrasting Traits
                </p>
                {contrasting.length > 0 ? (
                  <ul className="space-y-2">
                    {contrasting.map((t, i) => (
                      <li key={i} className="text-on-surface-variant text-sm flex items-start gap-2">
                        <span className="text-neon-pink mt-1">✦</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-on-surface-variant text-sm italic">You&apos;re remarkably similar!</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="gap-2 px-6 py-3 rounded-xl bg-white/5 border-white/10 text-on-surface-variant hover:bg-white/10"
          >
            {copied ? (
              <>
                <CheckIcon className="size-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2Icon className="size-4" />
                Copy Comparison Link
              </>
            )}
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
