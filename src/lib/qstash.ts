// Minimal QStash helper scaffolding. Non-breaking: only activates when QSTASH_ENABLED=true

type QstashClient = unknown | null;

export function initQstash(): QstashClient {
  const enabled = process.env.QSTASH_ENABLED === "true";
  if (!enabled) return null;

  try {
    // eslint-disable-next-line no-eval
    const req: any = eval("require");
    const qstash = req("@upstash/qstash/nextjs");
    return qstash;
  } catch (e) {
    return null;
  }
}

export const Qstash = initQstash();
