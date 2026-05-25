"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface StoredEvent {
  type: string;
  section?: string;
  element?: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function typeToBadgeVariant(type: string): string {
  switch (type) {
    case "section_view":
      return "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30";
    case "card_click":
      return "bg-neon-purple/10 text-neon-purple border-neon-purple/30";
    case "share_click":
      return "bg-neon-pink/10 text-neon-pink border-neon-pink/30";
    case "export_click":
      return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
    case "feature_toggle":
      return "bg-amber-400/10 text-amber-400 border-amber-400/30";
    default:
      return "bg-white/10 text-white border-white/20";
  }
}

export default function ActivityFeed() {
  const [events, setEvents] = useState<StoredEvent[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("resona_events") || "[]");
      const reversed = [...stored].reverse().slice(0, 20);
      setEvents(reversed);
    } catch {
      setEvents([]);
    }
  }, []);

  if (!events.length) {
    return (
      <div className="glass-enhanced rounded-2xl p-6 text-center">
        <p className="text-on-surface-variant text-sm">No recent activity</p>
        <p className="text-outline text-xs mt-1">Interact with the dashboard to see your activity here.</p>
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
        Activity Feed
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5"
          >
            <Badge
              variant="outline"
              className={`text-xs ${typeToBadgeVariant(event.type)}`}
            >
              {event.type.replace(/_/g, " ")}
            </Badge>
            <span className="text-sm text-on-surface-variant flex-1 truncate">
              {event.section ? `Viewed: ${event.section}` : event.element ? `Clicked: ${event.element}` : "Action triggered"}
            </span>
            <span className="text-xs text-outline whitespace-nowrap">
              {timeAgo(event.timestamp)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
