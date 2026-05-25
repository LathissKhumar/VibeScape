import { GoogleGenAI } from "@google/genai";
import type { SpotifyArtist, SpotifyTrack, SpotifyAudioFeatures } from "./spotify";
import type { Personality } from "@/types/next-auth";
import { Sentry } from "./sentry";
import { PersonalitySchema, SAFE_DEFAULTS, ARCHETYPES } from "./schemas/personality";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing env.GEMINI_API_KEY");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 3;
const SYSTEM_INSTRUCTION =
  "You are an expert music psychologist and behavioral analyst. "
  + "Analyze the user's listening data and assign exactly one of the provided archetypes. "
  + "Only use information present in the user's data — do not invent genres, artists, or traits. "
  + "The listeningAura must be a valid 6-digit hex color like #RRGGBB. "
  + "The chaosIndex must be a number 0-100 formatted as 'N%'. "
  + "Return ONLY the JSON object with no additional text, markdown, or code fences.";

function isTransientError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }

  if (error instanceof TypeError) {
    return true;
  }

  if (error && typeof error === "object") {
    const e = error as Record<string, unknown>;

    // @google/genai ApiError has numeric `status` (429, 503)
    if (typeof e.status === "number") {
      return e.status === 429 || e.status === 503;
    }

    // @google/genai ApiError may have string status like "RESOURCE_EXHAUSTED"
    if (typeof e.status === "string") {
      return e.status === "RESOURCE_EXHAUSTED" || e.status === "UNAVAILABLE";
    }

    // Fallback: check message JSON for code field
    if (typeof e.message === "string") {
      try {
        const parsed = JSON.parse(e.message);
        const code = parsed?.error?.code;
        return code === 429 || code === 503;
      } catch {
        // not JSON, ignore
      }
    }
  }

  return false;
}

function parsePersonality(raw: unknown): Personality {
  const result = PersonalitySchema.safeParse(raw);
  if (result.success) return result.data;
  console.warn("Personality validation failed:", result.error.issues);
  return SAFE_DEFAULTS;
}

export async function analyzePersonality(topArtists: SpotifyArtist[], topTracks: SpotifyTrack[], audioFeatures: (SpotifyAudioFeatures | null)[]) {
  const artistNames = topArtists.map((a) => a.name).join(", ");
  const genres = [...new Set(topArtists.flatMap((a) => a.genres))].slice(0, 15).join(", ");
  
  let avgEnergy = 0, avgValence = 0, avgDanceability = 0, avgAcousticness = 0;
  
  if (audioFeatures && audioFeatures.length > 0) {
    const validFeatures = audioFeatures.filter(f => f !== null);
    avgEnergy = validFeatures.reduce((acc, f) => acc + (f.energy || 0), 0) / validFeatures.length;
    avgValence = validFeatures.reduce((acc, f) => acc + (f.valence || 0), 0) / validFeatures.length;
    avgDanceability = validFeatures.reduce((acc, f) => acc + (f.danceability || 0), 0) / validFeatures.length;
    avgAcousticness = validFeatures.reduce((acc, f) => acc + (f.acousticness || 0), 0) / validFeatures.length;
  }

  const prompt = `
    Assign exactly ONE of the following 12 Personality Archetypes to this user:
    ${ARCHETYPES.join(", ")}
    
    User's Data:
    - Top Artists: ${artistNames}
    - Top Genres: ${genres}
    - Average Energy (0-1): ${avgEnergy.toFixed(2)}
    - Average Valence/Positivity (0-1): ${avgValence.toFixed(2)}
    - Average Danceability (0-1): ${avgDanceability.toFixed(2)}
    - Average Acousticness (0-1): ${avgAcousticness.toFixed(2)}
    
    Output JSON structure:
    {
      "primaryArchetype": "One of the 12 archetypes exactly as written above",
      "secondaryTrait": "A short 2-4 word description (e.g., 'High Rhythmic Energy')",
      "listeningAura": "A 6-digit hex color code (e.g., '#8A2BE2')",
      "summary": "A 2-sentence poetic but analytical summary of their music personality, based only on the data above.",
      "chaosIndex": "A percentage string (e.g., '78%') representing how chaotic/eclectic their taste is."
    }
  `;

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2,
            maxOutputTokens: 512,
            responseMimeType: "application/json",
            abortSignal: controller.signal,
          },
        });

        const text = response.text;
        if (!text) {
          throw new Error("No text returned from Gemini");
        }
        const parsed = JSON.parse(text);

        return parsePersonality(parsed);
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES && isTransientError(error)) {
        const delay = 500 * 2 ** (attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      break;
    }
  }

  if (Sentry?.captureException) {
    Sentry.captureException(lastError);
  }
  console.error("Gemini API Error:", lastError);

  return {
    primaryArchetype: "The Midnight Dreamer",
    secondaryTrait: "Late-night introspection",
    listeningAura: "#8A2BE2",
    summary: "Your music taste leans toward emotionally immersive late-night introspection. You find comfort in atmospheric beats.",
    chaosIndex: "42%"
  };
}
