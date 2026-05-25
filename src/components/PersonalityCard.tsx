"use client";

import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { useRef, useCallback, useState, forwardRef } from "react";
import type { Personality } from "@/types/next-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, Fingerprint, CopyIcon, CheckIcon, Share2Icon } from "lucide-react";

const AURA_COLORS = [
  { name: "Purple", value: "#A855F7", class: "bg-neon-purple" },
  { name: "Cyan", value: "#22D3EE", class: "bg-neon-cyan" },
  { name: "Pink", value: "#F472B6", class: "bg-neon-pink" },
  { name: "Emerald", value: "#34D399", class: "bg-emerald-400" },
  { name: "Amber", value: "#FBBF24", class: "bg-amber-400" },
];

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

interface PersonalityCardProps {
  personality: Personality;
  genres?: string[];
}

export default function PersonalityCard({ personality, genres = [] }: PersonalityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const ogRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState(personality.listeningAura);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const downloadCard = useCallback(async (ogMode = false) => {
    const target = ogMode ? ogRef.current : cardRef.current;
    if (target === null) return;

    setDownloading(true);
    try {
      const dataUrl = await toPng(target, {
        cacheBust: true,
        style: { background: "#050505" },
        pixelRatio: ogMode ? 1 : 2,
        width: ogMode ? OG_WIDTH : undefined,
        height: ogMode ? OG_HEIGHT : undefined,
      });
      const link = document.createElement("a");
      const archetypeSlug = personality.primaryArchetype.replace(/\s+/g, "-").toLowerCase();
      link.download = ogMode
        ? `resona-${archetypeSlug}-og.png`
        : `resona-${archetypeSlug}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Silently fail — user can retry
    } finally {
      setDownloading(false);
    }
  }, [personality.primaryArchetype]);

  const copyShareText = useCallback(async () => {
    const text = `I'm the ${personality.primaryArchetype} archetype! Discover yours at Resona`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }, [personality.primaryArchetype]);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Hidden OG variant for capture */}
      <div className="sr-only" aria-hidden="true">
        <OgCard ref={ogRef} personality={personality} genres={genres} selectedColor={selectedColor} />
      </div>

      {/* Card Preview */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card className="glass-card border-0 h-full overflow-hidden relative">
          {/* Aura background glow */}
          <div
            className="absolute inset-0 opacity-20 blur-[60px] pointer-events-none"
            style={{
              background: `radial-gradient(circle at top right, ${selectedColor}, transparent 70%)`,
            }}
          />

          <CardContent className="relative z-10 flex flex-col h-full p-8">
            {/* Fingerprint icon */}
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 neon-glow-primary">
              <Fingerprint className="w-7 h-7" style={{ color: selectedColor }} />
            </div>

            <span className="text-xs uppercase tracking-[0.1em] text-outline mb-2 font-semibold">
              Your Music Archetype
            </span>
            <h2
              className="font-[var(--font-outfit)] text-3xl font-bold mb-2 tracking-tight leading-tight text-white"
              style={{ textShadow: `0 0 30px ${selectedColor}80` }}
            >
              {personality.primaryArchetype}
            </h2>

            <Badge
              variant="outline"
              className="inline-flex items-center gap-2 mb-4 w-fit px-3 py-1 rounded-full bg-white/5 border-white/10 text-sm"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: selectedColor,
                  boxShadow: `0 0 10px ${selectedColor}`,
                }}
              />
              <span className="text-on-surface-variant font-normal">{personality.secondaryTrait}</span>
            </Badge>

            <p className="text-on-surface-variant leading-relaxed text-base mb-4 italic">
              &quot;{personality.summary}&quot;
            </p>

            {/* Top Genres */}
            {genres.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-outline mb-2 uppercase tracking-[0.1em] font-semibold">Top Genres</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-on-surface-variant"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Chaos Index */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-outline font-medium">Chaos Index</span>
                <span className="font-bold text-sm text-on-surface">{personality.chaosIndex}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: personality.chaosIndex }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </div>

            {/* Resona Watermark */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/20 font-semibold">
                Resona
              </span>
              <span className="text-[10px] text-white/15">
                resona.app
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Aura Color Selector */}
      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <p className="text-xs text-outline mb-3 uppercase tracking-[0.1em] font-semibold">Aura Color</p>
          <div className="flex gap-3">
            {AURA_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.value
                    ? "border-primary scale-110 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                    : "border-transparent opacity-60 hover:opacity-100"
                } ${color.class}`}
                title={color.name}
                aria-label={`Select ${color.name} aura color`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => downloadCard(false)}
          disabled={downloading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-[var(--font-outfit)] text-base font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_4px_20px_rgba(168,85,247,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadIcon className="size-5" />
          {downloading ? "Generating..." : "Download Image"}
        </button>

        <button
          onClick={() => downloadCard(true)}
          disabled={downloading}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-on-surface-variant font-[var(--font-outfit)] text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2Icon className="size-4" />
          Share to Social (1200×630)
        </button>

        <button
          onClick={copyShareText}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-on-surface-variant font-[var(--font-outfit)] text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <CheckIcon className="size-4 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-4" />
              Copy Share Text
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const OgCard = forwardRef<HTMLDivElement, {
  personality: Personality;
  genres: string[];
  selectedColor: string;
}>(function OgCard({ personality, genres, selectedColor }, ref) {
  return (
    <div
      ref={ref}
      style={{
        width: OG_WIDTH,
        height: OG_HEIGHT,
        background: "#050505",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, sans-serif",
        color: "#fff",
        padding: "64px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Aura glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          filter: "blur(80px)",
          pointerEvents: "none",
          background: `radial-gradient(circle at top right, ${selectedColor}, transparent 70%)`,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 28 }}>🎵</span>
          </div>
          <span
            style={{
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 600,
            }}
          >
            Your Music Archetype
          </span>
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textShadow: `0 0 40px ${selectedColor}80`,
          }}
        >
          {personality.primaryArchetype}
        </h1>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: selectedColor,
              boxShadow: `0 0 10px ${selectedColor}`,
            }}
          />
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }}>
            {personality.secondaryTrait}
          </span>
        </div>

        <p
          style={{
            fontSize: 24,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.6)",
            fontStyle: "italic",
            margin: "0 0 32px",
            maxWidth: 700,
          }}
        >
          &quot;{personality.summary}&quot;
        </p>

        {genres.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Top Genres
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {genres.map((genre) => (
                <span
                  key={genre}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.05)",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Chaos Index */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              Chaos Index
            </span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{personality.chaosIndex}</span>
          </div>
          <div
            style={{
              width: "100%",
              height: 8,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: personality.chaosIndex,
                height: "100%",
                borderRadius: 999,
                backgroundColor: selectedColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: 16,
        }}
      >
        <span
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.2)",
            fontWeight: 700,
          }}
        >
          Resona
        </span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.15)" }}>resona.app</span>
      </div>
    </div>
  );
});
