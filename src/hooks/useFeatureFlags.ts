"use client";

import { useState, useEffect, useCallback } from "react";

interface UseFeatureFlagsReturn {
  flags: Record<string, boolean>;
  isLoading: boolean;
  error: Error | null;
  hasFlag: (key: string) => boolean;
  refresh: () => Promise<void>;
}

export function useFeatureFlags(): UseFeatureFlagsReturn {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlags = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/feature-flags");
      if (!res.ok) throw new Error(`Failed to fetch feature flags: ${res.status}`);
      const data = await res.json();
      setFlags(data.flags ?? {});
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setFlags({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const hasFlag = useCallback((key: string) => flags[key] ?? false, [flags]);

  return { flags, isLoading, error, hasFlag, refresh: fetchFlags };
}
