import { POST } from "../vibe-compatibility/route";

vi.mock("../../../../lib/cache", () => ({
  default: { get: vi.fn().mockResolvedValue(null), set: vi.fn().mockResolvedValue(true) },
}));

vi.mock("../../../../lib/rateLimiter", () => ({
  default: vi.fn().mockResolvedValue({ allowed: true, remaining: 29, reset: Date.now() + 60 }),
}));

describe("POST /api/recommend/vibe-compatibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("valid profiles returns 200 with compatibility score", async () => {
    const req = new Request("http://localhost/api/recommend/vibe-compatibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileA: { genres: ["rock", "pop"], topArtists: ["A", "B"] },
        profileB: { genres: ["rock", "jazz"], topArtists: ["A", "C"] },
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.compatibility).toHaveProperty("score");
    expect(json.compatibility).toHaveProperty("label");
    expect(json.profiles).toEqual({
      a: { genreCount: 2, artistCount: 2 },
      b: { genreCount: 2, artistCount: 2 },
    });
  });

  test("missing profileA returns 400", async () => {
    const req = new Request("http://localhost/api/recommend/vibe-compatibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileB: { genres: ["rock"], topArtists: [] } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("missing profileA and/or profileB");
  });

  test("missing profileB returns 400", async () => {
    const req = new Request("http://localhost/api/recommend/vibe-compatibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileA: { genres: ["rock"], topArtists: [] } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("missing profileA and/or profileB");
  });

  test("invalid JSON returns 400", async () => {
    const req = new Request("http://localhost/api/recommend/vibe-compatibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("invalid_json");
  });
});
