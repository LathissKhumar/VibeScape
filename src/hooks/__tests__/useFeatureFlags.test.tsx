import { renderHook, waitFor } from "@testing-library/react";
import { useFeatureFlags } from "../useFeatureFlags";

describe("useFeatureFlags", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("loading state on mount", () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    const { result } = renderHook(() => useFeatureFlags());
    expect(result.current.isLoading).toBe(true);
  });

  test("successful fetch populates flags", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ flags: { darkMode: true, beta: false } }),
    });
    const { result } = renderHook(() => useFeatureFlags());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flags).toEqual({ darkMode: true, beta: false });
    expect(result.current.hasFlag("darkMode")).toBe(true);
    expect(result.current.hasFlag("beta")).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("error handling returns empty flags", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    const { result } = renderHook(() => useFeatureFlags());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flags).toEqual({});
    expect(result.current.hasFlag("anything")).toBe(false);
    expect(result.current.error).not.toBeNull();
  });

  test("refresh re-fetches flags", async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ flags: { v: callCount } }),
      });
    });
    const { result } = renderHook(() => useFeatureFlags());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.flags).toEqual({ v: 1 });
    await result.current.refresh();
    await waitFor(() => expect(result.current.flags).toEqual({ v: 2 }));
  });

  test("hasFlag returns false for unknown flags", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ flags: { known: true } }),
    });
    const { result } = renderHook(() => useFeatureFlags());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasFlag("unknown")).toBe(false);
    expect(result.current.hasFlag("")).toBe(false);
  });
});
