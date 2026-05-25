import { computeProfileEmbedding } from "../embeddings-core";

export interface VibeProfile {
  genres: string[];
  topArtists: string[];
}

export interface VibeCompatibilityResult {
  score: number;
  label: string;
}

export interface MusicTwinCandidate {
  id: string;
  name: string;
  compatibility: VibeCompatibilityResult;
  sharedGenres: string[];
}

export interface Recommendation {
  type: "artist" | "genre" | "mood";
  label: string;
  reason: string;
  confidence: number;
}

export interface PersonalizedRecommendations {
  recommendations: Recommendation[];
  basedOnProfile: { genres: string[]; topArtists: string[] };
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    magA += a[i]! * a[i]!;
    magB += b[i]! * b[i]!;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (denom === 0) return 0;
  return Math.max(-1, Math.min(1, dot / denom));
}

function scoreToLabel(score: number): string {
  if (score >= 0.9) return "Music Twin — almost identical vibe";
  if (score >= 0.7) return "Soulmate — extremely compatible";
  if (score >= 0.5) return "Harmonic — strong resonance";
  if (score >= 0.3) return "Familiar — shares some frequency";
  if (score >= 0.1) return "Distant — barely overlapping";
  return "Alien — completely different wavelength";
}

export function computeVibeCompatibility(
  profileA: VibeProfile,
  profileB: VibeProfile,
): VibeCompatibilityResult {
  const dim = 64;
  const vecA = computeProfileEmbedding(profileA.genres, profileA.topArtists, dim);
  const vecB = computeProfileEmbedding(profileB.genres, profileB.topArtists, dim);

  const score = cosineSimilarity(vecA, vecB);
  const vibeScore = Math.max(0, score);

  return {
    score: Math.round(vibeScore * 1000) / 1000,
    label: scoreToLabel(vibeScore),
  };
}

export function findMusicTwins(
  userProfile: VibeProfile,
  candidates: { id: string; name: string; profile: VibeProfile }[],
  topN = 3,
): MusicTwinCandidate[] {
  if (!userProfile.genres.length && !userProfile.topArtists.length) return [];
  if (!candidates.length) return [];

  const scored = candidates
    .map((c) => {
      const compatibility = computeVibeCompatibility(userProfile, c.profile);
      const sharedGenres = userProfile.genres.filter((g) =>
        c.profile.genres.includes(g),
      );
      return { id: c.id, name: c.name, compatibility, sharedGenres };
    })
    .sort((a, b) => b.compatibility.score - a.compatibility.score)
    .slice(0, topN);

  return scored;
}

export function getPersonalizedRecommendations(
  profile: VibeProfile,
  options?: {
    candidateGenres?: string[];
    candidateArtists?: string[];
  },
): PersonalizedRecommendations {
  const recommendations: Recommendation[] = [];

  const allGenres = [...new Set(profile.genres)];
  const allArtists = [...new Set(profile.topArtists)];

  if (allGenres.length >= 2) {
    const genrePairs = generateGenrePairs(allGenres);
    for (const [parent, adjacent] of genrePairs.slice(0, 2)) {
      recommendations.push({
        type: "genre",
        label: `Explore ${adjacent}`,
        reason: `Fans of ${parent} often enjoy ${adjacent}`,
        confidence: 0.6,
      });
    }
  }

  if (allArtists.length > 0) {
    recommendations.push({
      type: "mood",
      label: "Deep Listening Session",
      reason: `Based on your taste in ${allArtists.slice(0, 2).join(" & ")}, try a late-night deep listening session`,
      confidence: 0.5,
    });
  }

  if (options?.candidateGenres?.length) {
    const freshGenres = options.candidateGenres.filter(
      (g) => !allGenres.includes(g),
    );
    for (const genre of freshGenres.slice(0, 2)) {
      recommendations.push({
        type: "genre",
        label: `Dive into ${genre}`,
        reason: `Your vibe matches people who listen to ${genre}`,
        confidence: 0.7,
      });
    }
  }

  if (options?.candidateArtists?.length) {
    const freshArtists = options.candidateArtists.filter(
      (a) => !allArtists.includes(a),
    );
    for (const artist of freshArtists.slice(0, 2)) {
      recommendations.push({
        type: "artist",
        label: `Check out ${artist}`,
        reason: `Vibe-compatible listeners also enjoy ${artist}`,
        confidence: 0.75,
      });
    }
  }

  if (!recommendations.length) {
    recommendations.push({
      type: "mood",
      label: "Explore New Sounds",
      reason: "Connect your music account to unlock personalized recommendations",
      confidence: 0.3,
    });
  }

  return {
    recommendations,
    basedOnProfile: { genres: allGenres, topArtists: allArtists },
  };
}

function generateGenrePairs(genres: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < genres.length - 1; i++) {
    for (let j = i + 1; j < genres.length; j++) {
      pairs.push([genres[i]!, genres[j]!]);
    }
  }
  if (pairs.length === 0 && genres.length === 1) {
    const genre = genres[0]!;
    const adjacent = genreAdjacency[genre.toLowerCase()];
    if (adjacent) pairs.push([genre, adjacent]);
  }
  return pairs;
}

const genreAdjacency: Record<string, string> = {
  pop: "dance pop",
  rock: "indie rock",
  "indie rock": "alternative rock",
  "hip hop": "trap",
  "dance pop": "electropop",
  electronic: "house",
  house: "deep house",
  techno: "minimal techno",
  jazz: "soul",
  classical: "orchestral",
  "r&b": "neo soul",
  metal: "hard rock",
  folk: "singer-songwriter",
  country: "americana",
  reggae: "dancehall",
  latin: "reggaeton",
  "k-pop": "j-pop",
};

export default {
  cosineSimilarity,
  computeVibeCompatibility,
  findMusicTwins,
  getPersonalizedRecommendations,
};
