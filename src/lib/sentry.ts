// Minimal, build-safe Sentry wrapper for Next.js
// @sentry/nextjs handles initialization via instrumentation.ts (server) and
// sentry.client.config.ts (client). This module provides a typed export for
// consuming Sentry's API without redundant init.

import { dynamicRequire } from "./dynamicImport";

interface SentryModule {
  init: (opts: { dsn: string; tracesSampleRate: number }) => void;
}

type SentryClient = SentryModule | null;

/** Fallback init in case @sentry/nextjs is not configured. */
function initSentryFallback(): SentryClient {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return null;

  const Sentry = dynamicRequire<SentryModule>("@sentry/node");
  if (!Sentry) return null;
  Sentry.init({
    dsn,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.0),
  });
  return Sentry;
}

// Prefer the already-initialized @sentry/nextjs module (set up by
// instrumentation.ts / sentry.client.config.ts). Fall back to manual init via
// @sentry/node only if @sentry/nextjs is unavailable.
const sentryInstance =
  dynamicRequire<SentryModule>("@sentry/nextjs") || initSentryFallback();

export const Sentry = sentryInstance;
