"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";

interface FeatureFlag {
  key: string;
  value: boolean;
}

export default function FeatureFlagsAdminPanel() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { trackFeatureToggle } = useAnalytics();

  useEffect(() => {
    fetchFlags();
  }, []);

  async function fetchFlags() {
    try {
      const res = await fetch("/api/feature-flags");
      if (!res.ok) throw new Error("Failed to fetch flags");
      const data = await res.json();
      const flagEntries = Object.entries(data.flags || {}).map(([key, value]) => ({
        key,
        value: value as boolean,
      }));
      setFlags(flagEntries);
    } catch {
      setFlags([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFlag(key: string, currentValue: boolean) {
    setSaving(key);
    try {
      const res = await fetch("/api/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: !currentValue }),
      });
      if (!res.ok) throw new Error("Failed to toggle flag");
      setFlags((prev) =>
        prev.map((f) => (f.key === key ? { ...f, value: !currentValue } : f))
      );
      trackFeatureToggle(key, !currentValue);
    } catch {
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="glass-enhanced rounded-2xl p-6 animate-pulse">
        <div className="h-6 w-48 bg-white/10 rounded mb-4" />
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full bg-white/5 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!flags.length) {
    return (
      <div className="glass-enhanced rounded-2xl p-6 text-center">
        <p className="text-on-surface-variant text-sm">No feature flags available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-enhanced rounded-2xl p-6 border border-white/5"
    >
      <h3 className="font-[var(--font-outfit)] text-xl font-semibold text-white mb-4">
        Feature Flags
      </h3>
      <div className="space-y-3">
        {flags.map((flag) => (
          <motion.div
            key={flag.key}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <span className="text-sm text-on-surface-variant font-mono">
              {flag.key}
            </span>
            <button
              onClick={() => toggleFlag(flag.key, flag.value)}
              disabled={saving === flag.key}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                flag.value
                  ? "bg-neon-purple"
                  : "bg-white/20"
              } ${saving === flag.key ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
            >
              <AnimatePresence>
                <motion.div
                  key={flag.value ? "on" : "off"}
                  initial={{ x: flag.value ? 2 : -2, opacity: 0 }}
                  animate={{ x: flag.value ? 20 : 2, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                />
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
