"use client";

import { useCallback, useRef } from "react";

type EventType = "page_view" | "section_view" | "card_click" | "share_click" | "export_click" | "feature_toggle";

interface EventPayload {
  section?: string;
  element?: string;
  metadata?: Record<string, unknown>;
}

export function useAnalytics() {
  const queueRef = useRef<EventPayload[]>([]);

  const emit = useCallback((eventType: EventType, payload: EventPayload = {}) => {
    const event = {
      type: eventType,
      ...payload,
      timestamp: Date.now(),
    };

    queueRef.current.push(event);

    try {
      const stored = JSON.parse(localStorage.getItem("resona_events") || "[]");
      stored.push(event);
      const trimmed = stored.slice(-100);
      localStorage.setItem("resona_events", JSON.stringify(trimmed));
    } catch {
    }

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics",
        JSON.stringify(event)
      );
    }
  }, []);

  const trackSectionView = useCallback((section: string) => {
    emit("section_view", { section });
  }, [emit]);

  const trackCardClick = useCallback((element: string, metadata?: Record<string, unknown>) => {
    emit("card_click", { element, metadata });
  }, [emit]);

  const trackShareClick = useCallback((section: string) => {
    emit("share_click", { section });
  }, [emit]);

  const trackExportClick = useCallback((format: string) => {
    emit("export_click", { metadata: { format } });
  }, [emit]);

  const trackFeatureToggle = useCallback((flagKey: string, value: boolean) => {
    emit("feature_toggle", { element: flagKey, metadata: { value } });
  }, [emit]);

  return {
    emit,
    trackSectionView,
    trackCardClick,
    trackShareClick,
    trackExportClick,
    trackFeatureToggle,
  };
}
