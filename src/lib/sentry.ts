// Minimal, build-safe Sentry initialization for Next.js
// This follows the repo convention: optional initialization when env var is present

type SentryClient = unknown | null;

export function initSentry(): SentryClient {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return null;

  // Dynamically require Sentry SDK at runtime to avoid build-time dependency issues
  let Sentry: any = null;
  try {
    // hide static require from bundlers by using eval
    // eslint-disable-next-line no-eval
    const req: any = eval("require");
    Sentry = req("@sentry/node");
  } catch (e) {
    return null;
  }
  Sentry.init({
    dsn,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.0),
  });
  return Sentry;
}

export const Sentry = initSentry();
