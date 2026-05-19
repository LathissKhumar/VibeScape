import { getTopTracks, getTopArtists } from "../spotify";
import { emitEvent } from "../events";
import { db } from "../db";

// Minimal delta sync engine for Spotify data.
// - Optional: only runs when ENABLE_DELTA_SYNC=true
// - Uses raw SQL to read/write snapshots table; emits events for added/removed items

export async function deltaSyncForUser(userId: string, accessToken: string) {
  const enabled = process.env.ENABLE_DELTA_SYNC === "true";
  if (!enabled) return { ok: false, note: "delta sync disabled" };

  // Fetch current state from Spotify
  const [tracksRes, artistsRes] = await Promise.all([
    getTopTracks(accessToken, userId).catch((e) => {
      // eslint-disable-next-line no-console
      console.warn("getTopTracks error", e);
      return null as any;
    }),
    getTopArtists(accessToken, userId).catch((e) => {
      // eslint-disable-next-line no-console
      console.warn("getTopArtists error", e);
      return null as any;
    }),
  ]);

  const newSnapshot = {
    tracks: tracksRes || null,
    artists: artistsRes || null,
    synced_at: new Date().toISOString(),
  };

  // Load last snapshot from snapshots table (entity_type = 'user_spotify', entity_id = userId)
  if (!db) {
    // No DB available: emit a generic event and return
    await emitEvent("generic", { job: "delta_sync_no_db", userId, snapshot: newSnapshot });
    return { ok: true, note: "no db; emitted event" };
  }

  type RawDb = { execute?: (sql: string, params?: unknown[]) => Promise<any> };
  const rawDb = db as unknown as RawDb;

  try {
    const res = await rawDb.execute?.("SELECT data FROM snapshots WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC LIMIT 1", [
      "user_spotify",
      userId,
    ]);

    let prevData: any = null;
    if (res && res.rows && res.rows[0]) {
      try {
        prevData = res.rows[0].data;
      } catch (e) {
        prevData = null;
      }
    }

    // Compare track ids for changes (very minimal diff)
    const prevTrackIds = (prevData && prevData.tracks && prevData.tracks.items) ? (prevData.tracks.items.map((t: any) => t.id)) : [];
    const newTrackIds = (newSnapshot.tracks && newSnapshot.tracks.items) ? (newSnapshot.tracks.items.map((t: any) => t.id)) : [];

    const addedTracks = newTrackIds.filter((id: string) => !prevTrackIds.includes(id));
    const removedTracks = prevTrackIds.filter((id: string) => !newTrackIds.includes(id));

    // Emit events for added/removed tracks
    for (const t of addedTracks) {
      await emitEvent("track_added", { trackId: t, userId });
    }
    for (const t of removedTracks) {
      await emitEvent("generic", { job: "track_removed", trackId: t, userId });
    }

    // Persist new snapshot
    const payloadJson = JSON.stringify(newSnapshot);
    await rawDb.execute?.("INSERT INTO snapshots (entity_type, entity_id, data, created_at) VALUES ($1, $2, $3, now())", [
      "user_spotify",
      userId,
      payloadJson,
    ]);

    return { ok: true, added: addedTracks.length, removed: removedTracks.length };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("deltaSyncForUser error", err);
    return { ok: false, error: String(err) };
  }
}

export default deltaSyncForUser;
