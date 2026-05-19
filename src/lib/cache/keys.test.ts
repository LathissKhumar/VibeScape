import { userTopArtistsKey, userPersonalityKey, artistMetadataKey, trackFeaturesKey, rateLimitKey, namespacedKey } from './keys';

describe('cache key helpers', () => {
  it('formats user top artists key', () => {
    expect(userTopArtistsKey('u1')).toBe('user:u1:top-artists');
  });

  it('formats user personality key', () => {
    expect(userPersonalityKey('user-123')).toBe('user:user-123:personality');
  });

  it('formats artist metadata key', () => {
    expect(artistMetadataKey('artist-9')).toBe('artist:artist-9:metadata');
  });

  it('formats track features key', () => {
    expect(trackFeaturesKey('t1')).toBe('track:t1:features');
  });

  it('formats rate limit key', () => {
    expect(rateLimitKey('api', '1.2.3.4')).toBe('rate-limit:api:1.2.3.4');
  });

  it('namespacedKey joins parts with colon', () => {
    expect(namespacedKey('ns', 'a', 'b', 3)).toBe('ns:a:b:3');
  });
});
