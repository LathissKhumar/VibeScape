import { describe, it, expect, vi, beforeEach } from "vitest";

// We'll mock redis and db modules to simulate hot/warm behavior
vi.mock("../redis", () => {
  return {
    cache: {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      exists: vi.fn(),
      keys: vi.fn(),
    },
    redisClient: null,
  } as any;
});

// Provide a mutable holder so tests can change the exported db at runtime via a getter
const mockDbHolder: { db: any } = { db: null };
vi.mock("../../db", () => ({
  get db() {
    return mockDbHolder.db;
  },
}));

import { cache as redisCache } from "../redis";
import coreCache from "../index";

describe("coreCache (hot/warm/cold)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns value from hot cache when present", async () => {
    (redisCache.get as any).mockResolvedValue({ foo: "bar" });
    const res = await coreCache.get("key1");
    expect(res).toEqual({ foo: "bar" });
    expect(redisCache.get).toHaveBeenCalledWith("key1");
  });

  it("falls back to warm when hot misses", async () => {
    (redisCache.get as any).mockResolvedValue(null);
    // Simulate db returning rows via the loose `db.execute` path by setting the mock holder
    mockDbHolder.db = { execute: vi.fn().mockResolvedValue({ rows: [{ data: { baz: "qux" } }] }) };

    const res = await coreCache.get("key-warm");
    expect(res).toEqual({ baz: "qux" });
  });

  it("del calls redis.del and deletes warm record", async () => {
    (redisCache.del as any).mockResolvedValue(true);
    mockDbHolder.db = { execute: vi.fn().mockResolvedValue({}) };
    const ok = await coreCache.del("key-to-del");
    expect(ok).toBe(true);
    expect(redisCache.del).toHaveBeenCalledWith("key-to-del");
  });
});
