"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Moon, Zap } from "lucide-react";
import useReducedMotion from "@/hooks/useReducedMotion";

const ARCHETYPES = [
  {
    title: "The Sonic Architect",
    description:
      "Precision, structure, and complex layers. You appreciate the mathematical beauty of high-production soundscapes.",
    icon: "architecture",
    color: "neon-purple",
    badges: ["Techno", "Jazz"],
  },
  {
    title: "The Midnight Dreamer",
    description:
      "Atmospheric, ethereal, and emotive. Your soul resonates with the quiet intensity of lo-fi and cinematic scores.",
    icon: "nights_stay",
    color: "neon-cyan",
    badges: ["Ambient", "Indie"],
  },
  {
    title: "The Rhythm Rebel",
    description:
      "High energy, disruptive, and pulse-driven. You lead the charge with heavy bass and unapologetic tempo.",
    icon: "bolt",
    color: "neon-pink",
    badges: ["Phonk", "Drill"],
  },
];

const iconMap: Record<string, React.ElementType> = {
  architecture: Layers,
  nights_stay: Moon,
  bolt: Zap,
} as const;

function ArchetypeIcon({ name, color }: { name: string; color: string }) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  const IconComponent = Icon as React.ComponentType<{ className: string }>;
  return <IconComponent className={`text-${color} w-10 h-10`} />;
}

export default function ArchetypePreviewSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="archetypes" className="relative z-10 py-20 px-5 md:px-16 max-w-[1440px] mx-auto">
      <div className="mb-16 text-center">
        <span className="text-neon-pink font-[var(--font-inter)] text-sm tracking-[0.1em] uppercase mb-4 block font-semibold">
          Personal Identity
        </span>
        <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold mb-4">
          Music Personality Archetypes
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto">
          Our algorithms analyze over 50 sonic vectors to place you within one of our
          high-fidelity archetypes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARCHETYPES.map((archetype, index) => {
          const Icon = iconMap[archetype.icon];
          return (
            <Card
              key={archetype.title}
              className={`glass-card rounded-2xl flex flex-col items-center text-center group hover:neon-glow-${archetype.color} transition-all duration-500 border-0`}
              style={
                reducedMotion
                  ? undefined
                  : { animationDelay: `${index * 150}ms` }
              }
            >
              <CardHeader className="items-center pb-0 pt-10">
                <div
                  className={`w-16 h-16 rounded-full bg-${archetype.color}/10 flex items-center justify-center mb-6 border border-${archetype.color}/30 group-hover:bg-${archetype.color}/20 transition-colors`}
                >
                  <ArchetypeIcon name={archetype.icon} color={archetype.color} />
                </div>
                <CardTitle className="font-[var(--font-outfit)] text-[32px] leading-[1.3] font-semibold text-on-surface">
                  {archetype.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                  {archetype.description}
                </p>
                <div className="flex gap-2 justify-center">
                  {archetype.badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="outline"
                      className={`bg-${archetype.color}/10 border-${archetype.color}/20 text-${archetype.color}`}
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
