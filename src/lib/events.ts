import { db } from "./db";

// Minimal typed event system — definition and emitter helper

export type EventMap = {
  user_created: { userId: string; email?: string };
  track_added: { trackId: string; userId?: string; source?: string };
  snapshot_created: { snapshotId: string; entityType: string; entityId: string };
  generic: { [key: string]: any };
};

export type EventName = keyof EventMap;
export type EventPayload<E extends EventName> = EventMap[E];

// Simple in-process subscribers map. Keep minimal — used for dev/testing.
// Handlers are stored as wrappers that accept unknown and forward to the typed handler.
const subscribers: Record<string, Array<(payload: unknown) => void>> = {};

export function subscribe<E extends EventName>(event: E, handler: (payload: EventPayload<E>) => void) {
  const key = String(event);
  const wrapper = (payload: unknown) => handler(payload as EventPayload<E>);
  subscribers[key] = subscribers[key] || [];
  subscribers[key].push(wrapper);
  return () => {
    subscribers[key] = (subscribers[key] || []).filter((h) => h !== wrapper);
  };
}

export async function emitEvent<E extends EventName>(event: E, payload: EventPayload<E>) {
  // Notify local subscribers synchronously (fire-and-forget)
  try {
    (subscribers[String(event)] || []).forEach((h) => {
      try {
        h(payload);
      } catch (err) {
        // swallow subscriber errors
        // eslint-disable-next-line no-console
        console.warn("event subscriber error", err);
      }
    });
  } catch (err) {
    // ignore
  }

  // Persist event to events table when DB is available. Use rawDb to avoid tight Drizzle coupling.
  try {
    if (!db) return;
    type RawDb = { execute?: (sql: string, params?: unknown[]) => Promise<any> };
    const rawDb = db as unknown as RawDb;
    const now = new Date().toISOString();
    const payloadJson = JSON.stringify(payload || {});
    // try to extract userId if present in a typed-safe way
    let possibleUserId: string | null = null;
    if (payload && typeof payload === "object") {
      const p = payload as Record<string, unknown>;
      const u = p["userId"];
      if (typeof u === "string") possibleUserId = u;
    }
    await rawDb.execute?.("INSERT INTO events (user_id, type, payload, created_at) VALUES ($1, $2, $3, $4)", [
      possibleUserId,
      String(event),
      payloadJson,
      now,
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("emitEvent persist error", err);
  }
}

export default { subscribe, emitEvent };
