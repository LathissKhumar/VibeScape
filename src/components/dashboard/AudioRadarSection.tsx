"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import type { SpotifyAudioFeatures } from "@/lib/spotify";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Zap, TrendingDown, Activity } from "lucide-react";

interface AudioRadarSectionProps {
  audioFeatures: (SpotifyAudioFeatures | null)[];
  auraColor: string;
  loading?: boolean;
}

const FEATURES = ["energy", "valence", "danceability", "acousticness", "instrumentalness"] as const;
const LEVELS = [0.2, 0.4, 0.6, 0.8, 1.0];
const CX = 150;
const CY = 150;
const RADIUS = 110;

function getPoint(angle: number, value: number) {
  const r = RADIUS * value;
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  };
}

function getPolygonPoints(values: number[]) {
  return values
    .map((v, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / values.length;
      const p = getPoint(angle, v);
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

function getGridPoints(level: number) {
  return LEVELS.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const p = getPoint(angle, level);
    return `${p.x},${p.y}`;
  }).join(" ");
}

function getAxisEndPoint() {
  return FEATURES.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return getPoint(angle, 1.0);
  });
}

function getLabelPosition() {
  return FEATURES.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return getPoint(angle, 1.18);
  });
}

function AnimatedNumber({ value, auraColor }: { value: number; auraColor: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", (latest) => setDisplay(latest as number));
    return unsub;
  }, [rounded]);

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return <span style={{ color: auraColor }}>{display}</span>;
}

export default function AudioRadarSection({
  audioFeatures,
  auraColor,
  loading = false,
}: AudioRadarSectionProps) {
  const reduced = useReducedMotion();
  const controls = useAnimation();
  const svgRef = useRef<SVGSVGElement>(null);
  const [perimeter, setPerimeter] = useState(0);

  const validFeatures = useMemo(
    () => audioFeatures.filter((f): f is SpotifyAudioFeatures => f !== null),
    [audioFeatures]
  );

  const featureValues = useMemo(() => {
    if (validFeatures.length === 0) return [];
    return FEATURES.map((key) => {
      const avg = validFeatures.reduce((sum, f) => sum + (f[key] || 0), 0) / validFeatures.length;
      return Math.round(avg * 100) / 100;
    });
  }, [validFeatures]);

  const stats = useMemo(() => {
    if (featureValues.length === 0) return null;
    const labeled = FEATURES.map((f, i) => ({ feature: f.charAt(0).toUpperCase() + f.slice(1), value: Math.round((featureValues[i] ?? 0) * 100) }));
    const sorted = [...labeled].sort((a, b) => b.value - a.value);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    if (!highest || !lowest) return null;
    return {
      highest,
      lowest,
      contrast: highest.value - lowest.value,
    };
  }, [featureValues]);

  const dataPolygonPoints = useMemo(() => getPolygonPoints(featureValues), [featureValues]);
  const axisEnds = useMemo(() => getAxisEndPoint(), []);
  const labelPositions = useMemo(() => getLabelPosition(), []);

  useEffect(() => {
    if (svgRef.current && dataPolygonPoints && !reduced) {
      const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("d", `M ${dataPolygonPoints.replace(/ /g, " L ")} Z`);
      const len = pathEl.getTotalLength();
      setPerimeter(len);
    }
  }, [dataPolygonPoints, reduced]);

  useEffect(() => {
    if (!reduced && perimeter > 0) {
      controls.start({ strokeDashoffset: 0 });
    }
  }, [perimeter, reduced, controls]);

  if (loading) {
    return (
      <div className="h-[400px] glass-card rounded-3xl p-6 flex flex-col">
        <LoadingSkeleton variant="text" className="w-40 h-8 rounded-xl mb-2" />
        <LoadingSkeleton variant="text" className="w-56 h-4 rounded-lg mb-6" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSkeleton variant="card" className="w-72 h-72 rounded-full" />
        </div>
      </div>
    );
  }

  if (validFeatures.length === 0) {
    return (
      <div className="h-[400px] glass-card rounded-3xl p-6 flex items-center justify-center">
        <EmptyState
          icon={Activity}
          title="No audio features yet"
          description="Sync more tracks to see your sonic profile radar."
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      animate={reduced ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-auto glass-enhanced rounded-3xl p-6 overflow-hidden"
    >
      <div className="ambient-light-purple -top-32 -left-32" />
      <div className="ambient-light-cyan -bottom-24 -right-24" />

      <div className="relative z-10">
        <h3 className="font-[var(--font-space-grotesk)] text-xl font-semibold gradient-text-animated text-on-surface mb-1">
          Your Sonic DNA
        </h3>
        <p className="text-sm text-on-surface-variant mb-6">
          Averaged audio features from your top tracks.
        </p>

        <div className="flex justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 300 300"
            className="w-full max-w-[300px] h-auto"
          >
            <defs>
              <filter id="neon-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {LEVELS.map((level) => (
              <polygon
                key={level}
                points={getGridPoints(level)}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            ))}

            {axisEnds.map((end, i) => (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}

            {labelPositions.map((pos, i) => (
              <text
                key={i}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#cfc2d6"
                fontSize="11"
                fontFamily="var(--font-sans)"
              >
                {FEATURES[i]!.charAt(0).toUpperCase() + FEATURES[i]!.slice(1)}
              </text>
            ))}

            {dataPolygonPoints && (
              <motion.polygon
                points={dataPolygonPoints}
                fill={auraColor}
                fillOpacity={0.15}
                stroke={auraColor}
                strokeWidth={2.5}
                filter="url(#neon-glow)"
                initial={reduced ? {} : { strokeDasharray: perimeter, strokeDashoffset: perimeter }}
                animate={reduced ? {} : controls}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            )}
          </svg>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="glass-card rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 mx-auto mb-2" style={{ color: auraColor }} />
              <p className="text-xs text-outline uppercase tracking-wider">Highest</p>
              <p className="font-[var(--font-space-grotesk)] text-lg font-bold text-on-surface">
                {stats.highest.feature}
              </p>
              <p className="text-sm font-[var(--font-space-grotesk)] font-semibold">
                <AnimatedNumber value={stats.highest.value} auraColor={auraColor} />%
              </p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <TrendingDown className="w-5 h-5 mx-auto mb-2 text-outline" />
              <p className="text-xs text-outline uppercase tracking-wider">Lowest</p>
              <p className="font-[var(--font-space-grotesk)] text-lg font-bold text-on-surface">
                {stats.lowest.feature}
              </p>
              <p className="text-sm font-[var(--font-space-grotesk)] font-semibold text-outline">
                <AnimatedNumber value={stats.lowest.value} auraColor={auraColor} />%
              </p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <Activity className="w-5 h-5 mx-auto mb-2 text-neon-pink" />
              <p className="text-xs text-outline uppercase tracking-wider">Contrast</p>
              <p className="font-[var(--font-space-grotesk)] text-lg font-bold text-on-surface">
                <AnimatedNumber value={stats.contrast} auraColor={auraColor} />pp
              </p>
              <p className="text-sm text-outline">Range spread</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
