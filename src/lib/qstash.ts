// Supabase worker helper with optional QStash fallback.
// Provides triggerWorker() to dispatch async jobs to the internal /api/workers endpoint
// or via QStash when configured. Gracefully degrades when neither is available.

export type JobType = "personality" | "analytics" | "embeddings";

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return process.env.NEXTAUTH_URL || "http://127.0.0.1:3000";
}

async function triggerViaQStash(
  jobType: JobType,
  payload?: Record<string, unknown>
): Promise<{ ok: boolean; reason?: string }> {
  try {
    // eslint-disable-next-line no-eval
    const req: (id: string) => unknown = eval("require");
    const { client } = req("@upstash/qstash/nextjs") as { client: { publish: (...args: unknown[]) => Promise<unknown> } };
    await client.publish(JSON.stringify({ type: jobType, payload }));
    return { ok: true };
  } catch (err) {
    console.warn("triggerViaQStash error", err);
    return { ok: false, reason: String(err) };
  }
}

/**
 * Dispatch an async worker job.
 *
 * Priority:
 * 1. QStash (if QSTASH_ENABLED=true and QSTASH_URL is set)
 * 2. Internal /api/workers HTTP call (uses SUPABASE_WORKER_SECRET)
 * 3. No-op if neither is configured (graceful degradation)
 */
export async function triggerWorker(
  jobType: JobType,
  payload?: Record<string, unknown>
): Promise<{ ok: boolean; reason?: string }> {
  // Option 1: QStash fallback (legacy environments)
  if (process.env.QSTASH_ENABLED === "true" && process.env.QSTASH_URL) {
    return triggerViaQStash(jobType, payload);
  }

  // Option 2: Internal API route call (Supabase/Vercel-based)
  const workerSecret = process.env.SUPABASE_WORKER_SECRET;
  if (!workerSecret) {
    console.warn(
      "triggerWorker: neither QStash nor SUPABASE_WORKER_SECRET configured; skipping",
      jobType
    );
    return { ok: false, reason: "no-worker-configured" };
  }

  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/workers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-worker-secret": workerSecret,
      },
      body: JSON.stringify({ type: jobType, payload }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "unknown");
      return { ok: false, reason: `worker-http-${res.status}: ${text}` };
    }
    return res.json() as Promise<{ ok: boolean; reason?: string }>;
  } catch (err) {
    console.warn("triggerWorker error", err);
    return { ok: false, reason: String(err) };
  }
}

// --- Backward-compat QStash exports (preserved for existing consumers) ---

type QstashClient = unknown | null;

export function initQstash(): QstashClient {
  const enabled = process.env.QSTASH_ENABLED === "true";
  if (!enabled) return null;

  try {
    // eslint-disable-next-line no-eval
    const req: (id: string) => unknown = eval("require");
    const qstash = req("@upstash/qstash/nextjs");
    return qstash;
  } catch (e) {
    return null;
  }
}

export const Qstash = initQstash();
