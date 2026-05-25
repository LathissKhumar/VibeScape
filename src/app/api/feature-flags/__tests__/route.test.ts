import { GET, POST } from "../route";

vi.mock("@/lib/feature-flags", () => ({
  default: {
    getAll: vi.fn(),
    set: vi.fn(),
  },
}));

import featureFlags from "@/lib/feature-flags";

const mockFeatureFlags = featureFlags as {
  getAll: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
};

describe("GET /api/feature-flags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns 200 with all flags", async () => {
    mockFeatureFlags.getAll.mockResolvedValue({ darkMode: true, beta: false });
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ flags: { darkMode: true, beta: false } });
  });
});

describe("POST /api/feature-flags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("valid key/value returns 200 with ok: true", async () => {
    mockFeatureFlags.set.mockResolvedValue(true);
    const req = new Request("http://localhost/api/feature-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "darkMode", value: true }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(mockFeatureFlags.set).toHaveBeenCalledWith("darkMode", true);
  });

  test("invalid key returns 400", async () => {
    const req = new Request("http://localhost/api/feature-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: 123, value: true }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test("invalid JSON returns 400", async () => {
    const req = new Request("http://localhost/api/feature-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
