import { cache } from './redis';

describe('redis cache (graceful behavior)', () => {
  it('returns null for get when client not configured', async () => {
    // Without env vars set, cache should gracefully return null
    const v = await cache.get('nonexistent:key');
    expect(v).toBeNull();
  });

  it('returns false for set when client not configured', async () => {
    const ok = await cache.set('k', 'v');
    expect(ok).toBe(false);
  });

  it('returns false for del when client not configured', async () => {
    const ok = await cache.del('k');
    expect(ok).toBe(false);
  });

  it('returns false for exists when client not configured', async () => {
    const ok = await cache.exists('k');
    expect(ok).toBe(false);
  });

  it('returns empty array for keys when client not configured', async () => {
    const ks = await cache.keys('user:*');
    expect(Array.isArray(ks)).toBe(true);
    expect(ks.length).toBe(0);
  });
});
