import { POST } from "../personalized/route";

vi.mock("../../../../lib/cache", () => ({
  default: { get: vi.fn().mockResolvedValue(null), set: vi.fn().mockResolvedValue(true) },
}));

vi.mock("../../../../lib/rateLimiter", () => ({
  default: vi.fn().mockResolvedValue({ allowed: true, remaining: 29, reset: Date.now() + 60 }),
}));

describe("POST /api/recommend/personalized", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("valid profile returns 200 with recommendations", async () => {
    const req = new Request("http://localhost/api/recommend/personalized", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: { genres: ["rock", "pop", "jazz"], topArtists: ["A", "B"] },
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.recommendations).toBeDefined();
    expect(Array.isArray(json.recommendations)).toBe(true);
  });

  test("missing profile returns 400", async () => {
    const req = new Request("http://localhost/api/recommend/personalized", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidates: { genres: ["rock"] } }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("missing profile");
  });

  test("invalid JSON returns 400", async () => {
    const req = new Request("http://localhost/api/recommend/personalized", {
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
