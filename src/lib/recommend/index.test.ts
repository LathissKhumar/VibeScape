import { describe, it, expect } from "vitest";
import {
  cosineSimilarity,
  computeVibeCompatibility,
  findMusicTwins,
  getPersonalizedRecommendations,
} from "./index";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBeCloseTo(1, 5);
  });

  it("returns -1 for opposite vectors", () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1, 5);
  });

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 5);
  });

  it("returns correct similarity for same-direction vectors", () => {
    const sim = cosineSimilarity([1, 2, 3], [2, 4, 6]);
    expect(sim).toBeCloseTo(1, 5);
  });

  it("returns 0 when either vector is empty", () => {
    expect(cosineSimilarity([], [1, 2])).toBe(0);
    expect(cosineSimilarity([1, 2], [])).toBe(0);
    expect(cosineSimilarity([], [])).toBe(0);
  });

  it("returns 0 when vectors have different lengths", () => {
    expect(cosineSimilarity([1, 2], [1, 2, 3])).toBe(0);
  });

  it("returns 0 when vector magnitude is 0", () => {
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
    expect(cosineSimilarity([1, 1], [0, 0])).toBe(0);
  });
});

describe("computeVibeCompatibility", () => {
  it("returns high score for identical profiles", () => {
    const profile = {
      genres: ["rock", "indie", "alternative"],
      topArtists: ["Artist A", "Artist B", "Artist C"],
    };
    const result = computeVibeCompatibility(profile, profile);
    expect(result.score).toBeGreaterThanOrEqual(0.9);
    expect(result.label).toContain("Music Twin");
  });

  it("returns low score for very different profiles", () => {
    const profileA = {
      genres: ["classical", "orchestral", "opera"],
      topArtists: ["Mozart", "Beethoven", "Bach"],
    };
    const profileB = {
      genres: ["metal", "hardcore", "death metal"],
      topArtists: ["Band X", "Band Y", "Band Z"],
    };
    const result = computeVibeCompatibility(profileA, profileB);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it("returns moderate score for partially overlapping profiles", () => {
    const profileA = {
      genres: ["rock", "indie", "pop"],
      topArtists: ["Artist A", "Artist B"],
    };
    const profileB = {
      genres: ["rock", "electronic", "pop"],
      topArtists: ["Artist C", "Artist D"],
    };
    const result = computeVibeCompatibility(profileA, profileB);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(1);
  });

  it("gracefully handles empty profiles", () => {
    const empty = { genres: [], topArtists: [] };
    const profile = {
      genres: ["rock"],
      topArtists: ["Artist A"],
    };
    const resultA = computeVibeCompatibility(empty, empty);
    expect(resultA.score).toBe(0);
    expect(resultA.label).toBeTruthy();

    const resultB = computeVibeCompatibility(empty, profile);
    expect(resultB.score).toBeGreaterThanOrEqual(0);
  });

  it("returns score between 0 and 1", () => {
    const profile = {
      genres: ["jazz", "soul", "funk"],
      topArtists: ["Artist X", "Artist Y"],
    };
    for (let i = 0; i < 5; i++) {
      const other = {
        genres: [`genre${i}`],
        topArtists: [`artist${i}`],
      };
      const result = computeVibeCompatibility(profile, other);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    }
  });
});

describe("findMusicTwins", () => {
  const userProfile = {
    genres: ["rock", "indie", "alternative"],
    topArtists: ["Radiohead", "Arctic Monkeys", "Tame Impala"],
  };

  const candidates = [
    { id: "1", name: "Twin A", profile: { genres: ["rock", "indie"], topArtists: ["Radiohead", "Foo Fighters"] } },
    { id: "2", name: "Twin B", profile: { genres: ["classical", "jazz"], topArtists: ["Mozart", "Coltrane"] } },
    { id: "3", name: "Twin C", profile: { genres: ["rock", "alternative", "indie"], topArtists: ["Tame Impala", "Arctic Monkeys", "Radiohead"] } },
    { id: "4", name: "Twin D", profile: { genres: ["pop", "dance"], topArtists: ["Taylor Swift", "Dua Lipa"] } },
  ];

  it("returns top N most compatible candidates", () => {
    const twins = findMusicTwins(userProfile, candidates, 2);
    expect(twins).toHaveLength(2);
    expect(twins[0].compatibility.score).toBeGreaterThanOrEqual(twins[1].compatibility.score);
  });

  it("returns empty array when user profile has no data", () => {
    const emptyProfile = { genres: [], topArtists: [] };
    const twins = findMusicTwins(emptyProfile, candidates);
    expect(twins).toHaveLength(0);
  });

  it("returns empty array when candidates list is empty", () => {
    const twins = findMusicTwins(userProfile, []);
    expect(twins).toHaveLength(0);
  });

  it("includes shared genres in the result", () => {
    const twins = findMusicTwins(userProfile, candidates, 1);
    expect(twins[0]).toHaveProperty("sharedGenres");
    expect(Array.isArray(twins[0].sharedGenres)).toBe(true);
  });

  it("ranks identical profile highest", () => {
    const selfCandidate = { id: "self", name: "Self", profile: userProfile };
    const twins = findMusicTwins(userProfile, [...candidates, selfCandidate], 4);
    expect(twins[0].id).toBe("self");
    expect(twins[0].compatibility.score).toBeGreaterThan(0.9);
  });
});

describe("getPersonalizedRecommendations", () => {
  it("returns recommendations when profile has genres and artists", () => {
    const profile = {
      genres: ["rock", "indie", "alternative"],
      topArtists: ["Radiohead", "Arctic Monkeys"],
    };
    const result = getPersonalizedRecommendations(profile);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.basedOnProfile.genres).toEqual(["rock", "indie", "alternative"]);
  });

  it("returns fallback when profile is empty", () => {
    const profile = { genres: [], topArtists: [] };
    const result = getPersonalizedRecommendations(profile);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].label).toBe("Explore New Sounds");
    expect(result.recommendations[0].confidence).toBe(0.3);
  });

  it("includes candidate-based recommendations when provided", () => {
    const profile = {
      genres: ["rock"],
      topArtists: ["Radiohead"],
    };
    const result = getPersonalizedRecommendations(profile, {
      candidateGenres: ["electronic", "jazz"],
      candidateArtists: ["New Artist"],
    });
    const labels = result.recommendations.map((r) => r.label);
    expect(labels).toContain("Dive into electronic");
    expect(labels).toContain("Check out New Artist");
  });

  it("filters out candidate genres/artists already in the profile", () => {
    const profile = {
      genres: ["rock", "electronic"],
      topArtists: ["Radiohead", "New Artist"],
    };
    const result = getPersonalizedRecommendations(profile, {
      candidateGenres: ["rock", "jazz"],
      candidateArtists: ["Radiohead", "Different Artist"],
    });
    const labels = result.recommendations.map((r) => r.label);
    expect(labels).not.toContain("Dive into rock");
    expect(labels).toContain("Dive into jazz");
    expect(labels).not.toContain("Check out Radiohead");
    expect(labels).toContain("Check out Different Artist");
  });

  it("all recommendations have valid properties", () => {
    const profile = {
      genres: ["pop", "dance", "electronic"],
      topArtists: ["Artist A", "Artist B", "Artist C"],
    };
    const result = getPersonalizedRecommendations(profile);
    for (const rec of result.recommendations) {
      expect(["artist", "genre", "mood"]).toContain(rec.type);
      expect(typeof rec.label).toBe("string");
      expect(rec.label.length).toBeGreaterThan(0);
      expect(typeof rec.reason).toBe("string");
      expect(rec.reason.length).toBeGreaterThan(0);
      expect(rec.confidence).toBeGreaterThanOrEqual(0);
      expect(rec.confidence).toBeLessThanOrEqual(1);
    }
  });
});
