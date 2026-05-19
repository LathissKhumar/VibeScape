import featureFlags from "./index";

describe("featureFlags", () => {
  test("default get returns default when not set", async () => {
    const v = await featureFlags.get("nonexistent", true);
    expect(v).toBe(true);
  });

  test("set then get returns stored value", async () => {
    await featureFlags.set("beta-test", true);
    const v = await featureFlags.get("beta-test", false);
    expect(v).toBe(true);
  });

  test("getAll includes set flags", async () => {
    await featureFlags.set("alpha", false);
    await featureFlags.set("gamma", true);
    const all = await featureFlags.getAll();
    expect(all.alpha).toBe(false);
    expect(all.gamma).toBe(true);
  });
});
