"use client";

import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { useRef, useCallback, useState } from "react";
import type { Personality } from "@/types/next-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, Fingerprint } from "lucide-react";

const AURA_COLORS = [
  { name: "Purple", value: "#A855F7", class: "bg-neon-purple" },
  { name: "Cyan", value: "#22D3EE", class: "bg-neon-cyan" },
  { name: "Pink", value: "#F472B6", class: "bg-neon-pink" },
  { name: "Emerald", value: "#34D399", class: "bg-emerald-400" },
];

export default function PersonalityCard({ personality }: { personality: Personality }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState(personality.listeningAura);

  const downloadCard = useCallback(() => {
    if (cardRef.current === null) return;
    toPng(cardRef.current, {
      cacheBust: true,
      style: { background: "#050505" },
      pixelRatio: 2,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `vibedna-${personality.primaryArchetype.replace(/\s+/g, "-").toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Failed to download image", err);
      });
  }, [cardRef, personality]);

  return (
    <div className="flex flex-col h-full gap-4">
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
            {/* Badge */}
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
              className="inline-flex items-center gap-2 mb-6 w-fit px-3 py-1 rounded-full bg-white/5 border-white/10 text-sm"
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

            <p className="text-on-surface-variant leading-relaxed text-base mb-8 italic">
              &quot;{personality.summary}&quot;
            </p>

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
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <button
        onClick={downloadCard}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-[var(--font-outfit)] text-base font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_4px_20px_rgba(168,85,247,0.4)] cursor-pointer"
      >
        <DownloadIcon className="size-5" />
        Download Image
      </button>
    </div>
  );
}
