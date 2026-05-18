export const userTopArtistsKey = (userId: string) => `user:${userId}:top-artists`;
export const userPersonalityKey = (userId: string) => `user:${userId}:personality`;
export const artistMetadataKey = (artistId: string) => `artist:${artistId}:metadata`;
export const trackFeaturesKey = (trackId: string) => `track:${trackId}:features`;
export const rateLimitKey = (route: string, ip: string) => `rate-limit:${route}:${ip}`;

// Generic helper for namespaced keys
export const namespacedKey = (namespace: string, ...parts: Array<string | number>) => `${namespace}:${parts.join(":")}`;
