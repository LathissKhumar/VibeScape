import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from "vitest";

beforeAll(() => {
  process.env.UPSTASH_REDIS_REST_URL = "http://localhost:6379";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
});

afterAll(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

const mockFromHolder: { fn: ReturnType<typeof vi.fn> } = { fn: vi.fn() };

vi.mock("@/lib/supabase", () => ({
  supabase: {
    get from() {
      return mockFromHolder.fn;
    },
  },
}));

vi.mock("../redis", () => ({
  cache: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    exists: vi.fn(),
    keys: vi.fn(),
  },
  redisClient: null,
}));

import { cache as redisCache } from "../redis";
import coreCache from "../index";

function setupSupabaseMocks() {
  const mockSingle = vi.fn();
  const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
  const mockUpsert = vi.fn();
  const mockDelEq = vi.fn();
  const mockDelete = vi.fn().mockReturnValue({ eq: mockDelEq });

  mockFromHolder.fn.mockReturnValue({
    select: mockSelect,
    upsert: mockUpsert,
    delete: mockDelete,
  });

  return { mockSingle, mockUpsert, mockDelEq };
}

describe("coreCache (Supabase Postgres primary)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns value from Supabase when present and not expired", async () => {
    const { mockSingle } = setupSupabaseMocks();
    mockSingle.mockResolvedValue({
      data: { data: { genre: "jazz" }, expires_at: null },
      error: null,
    });

    const res = await coreCache.get("artist:abc:metadata");
    expect(res).toEqual({ genre: "jazz" });
    expect(mockFromHolder.fn).toHaveBeenCalledWith("spotify_cache");
  });

  it("returns value when expires_at is in the future", async () => {
    const { mockSingle } = setupSupabaseMocks();
    const future = new Date(Date.now() + 86_400_000).toISOString();
    mockSingle.mockResolvedValue({
      data: { data: { popularity: 85 }, expires_at: future },
      error: null,
    });

    const res = await coreCache.get("artist:xyz:metadata");
    expect(res).toEqual({ popularity: 85 });
  });

  it("treats expired cache as a miss and falls through to Redis", async () => {
    const { mockSingle } = setupSupabaseMocks();
    const past = new Date(Date.now() - 86_400_000).toISOString();
    mockSingle.mockResolvedValue({
      data: { data: { stale: true }, expires_at: past },
      error: null,
    });
    vi.mocked(redisCache.get).mockResolvedValue({ fresh: true });

    const res = await coreCache.get("expired-key");
    expect(res).toEqual({ fresh: true });
  });

  it("falls back to Redis when Supabase returns an error", async () => {
    const { mockSingle } = setupSupabaseMocks();
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "connection timeout" },
    });
    vi.mocked(redisCache.get).mockResolvedValue({ cached: "redis-val" });

    const res = await coreCache.get("err-key");
    expect(res).toEqual({ cached: "redis-val" });
  });

  it("falls back to Redis when Supabase throws", async () => {
    mockFromHolder.fn.mockReturnValue({
      select: () => {
        throw new Error("network error");
      },
    });
    vi.mocked(redisCache.get).mockResolvedValue({ from: "redis" });

    const res = await coreCache.get("throws-key");
    expect(res).toEqual({ from: "redis" });
  });

  it("returns null when both tiers miss", async () => {
    const { mockSingle } = setupSupabaseMocks();
    mockSingle.mockResolvedValue({ data: null, error: { message: "not found" } });
    vi.mocked(redisCache.get).mockResolvedValue(null);

    const res = await coreCache.get("unknown-key");
    expect(res).toBeNull();
  });

  it("returns null when neither Supabase nor Redis is configured", async () => {
    const origUrl = process.env.UPSTASH_REDIS_REST_URL;
    const origToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const res = await coreCache.get("any-key");
    expect(res).toBeNull();

    process.env.UPSTASH_REDIS_REST_URL = origUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = origToken;
  });

  it("set upserts into Supabase and writes to Redis", async () => {
    const { mockUpsert } = setupSupabaseMocks();
    mockUpsert.mockResolvedValue({ error: null });
    vi.mocked(redisCache.set).mockResolvedValue(true);

    const ok = await coreCache.set("track:t1:features", { danceability: 0.8 }, { ex: 300 });
    expect(ok).toBe(true);
    expect(mockUpsert).toHaveBeenCalledTimes(1);

    const payload = mockUpsert.mock.calls[0][0];
    expect(payload.id).toBe("track:t1:features");
    expect(payload.data).toEqual({ danceability: 0.8 });
    expect(payload.expires_at).toBeTruthy();
    expect(payload.user_id).toBeNull();
    expect(payload.updated_at).toBeTruthy();

    expect(redisCache.set).toHaveBeenCalledWith("track:t1:features", { danceability: 0.8 }, { ex: 300 });
  });

  it("set works without expiration", async () => {
    const { mockUpsert } = setupSupabaseMocks();
    mockUpsert.mockResolvedValue({ error: null });
    vi.mocked(redisCache.set).mockResolvedValue(true);

    const ok = await coreCache.set("k", "v");
    expect(ok).toBe(true);

    const payload = mockUpsert.mock.calls[0][0];
    expect(payload.expires_at).toBeNull();
  });

  it("del deletes from Supabase and Redis", async () => {
    const { mockDelEq } = setupSupabaseMocks();
    mockDelEq.mockResolvedValue({ error: null });
    vi.mocked(redisCache.del).mockResolvedValue(true);

    const ok = await coreCache.del("track:t1:features");
    expect(ok).toBe(true);
    expect(mockFromHolder.fn).toHaveBeenCalledWith("spotify_cache");
  });

  it("set returns false when both tiers fail", async () => {
    const { mockUpsert } = setupSupabaseMocks();
    mockUpsert.mockRejectedValue(new Error("network error"));
    vi.mocked(redisCache.set).mockResolvedValue(false);
    const origUrl = process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;

    const ok = await coreCache.set("k", "v");
    expect(ok).toBe(false);

    if (origUrl) process.env.UPSTASH_REDIS_REST_URL = origUrl;
  });
});
