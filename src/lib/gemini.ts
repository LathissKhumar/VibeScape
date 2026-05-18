import { GoogleGenAI } from "@google/genai";
import type { SpotifyArtist, SpotifyTrack, SpotifyAudioFeatures } from "./spotify";
import type { Personality } from "@/types/next-auth";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing env.GEMINI_API_KEY");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Validate hex color format
function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color);
}

// Validate and sanitize AI output to prevent injection attacks
function validatePersonalityOutput(data: Record<string, unknown>): Personality {
  const safeDefaults = {
    primaryArchetype: "The Midnight Dreamer",
    secondaryTrait: "Introspective listening",
    listeningAura: "#8A2BE2",
    summary: "Your music taste reflects a unique personal journey.",
    chaosIndex: "50%"
  };

  if (typeof data !== "object" || data === null) {
    return safeDefaults;
  }

  const validated: Record<string, string> = {};

  // Validate primaryArchetype - must be in ARCHETYPES
  const archetype = data.primaryArchetype;
  if (typeof archetype === "string" && ARCHETYPES.includes(archetype)) {
    validated.primaryArchetype = archetype;
  } else {
    validated.primaryArchetype = safeDefaults.primaryArchetype;
  }

  // Validate secondaryTrait - must be short plaintext
  const trait = data.secondaryTrait;
  if (typeof trait === "string" && trait.length > 0 && trait.length <= 50) {
    validated.secondaryTrait = trait.replace(/[<>]/g, "");
  } else {
    validated.secondaryTrait = safeDefaults.secondaryTrait;
  }

  // Validate listeningAura - must be valid hex color
  const aura = data.listeningAura;
  if (typeof aura === "string" && isValidHexColor(aura)) {
    validated.listeningAura = aura;
  } else {
    validated.listeningAura = safeDefaults.listeningAura;
  }

  // Validate summary - must be plaintext, limited length
  const summary = data.summary;
  if (typeof summary === "string" && summary.length > 0 && summary.length <= 500) {
    validated.summary = summary.replace(/<[^>]*>/g, "").slice(0, 500);
  } else {
    validated.summary = safeDefaults.summary;
  }

  // Validate chaosIndex - must be percentage string 0-100%
  const chaos = data.chaosIndex;
  if (typeof chaos === "string") {
    const match = chaos.match(/^(\d{1,3})%?$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= 0 && num <= 100) {
        validated.chaosIndex = `${num}%`;
      } else {
        validated.chaosIndex = safeDefaults.chaosIndex;
      }
    } else {
      validated.chaosIndex = safeDefaults.chaosIndex;
    }
  } else {
    validated.chaosIndex = safeDefaults.chaosIndex;
  }

  return (validated as unknown) as Personality;
}

export const ARCHETYPES = [
  "The Midnight Dreamer",
  "The Sonic Explorer",
  "The Emotional Archivist",
  "The Chaos Listener",
  "The Retro Futurist",
  "The Dopamine Runner",
  "The Calm Philosopher",
  "The Neon Wanderer",
  "The Main Character",
  "The Underground King",
  "The Serotonin Chaser",
  "The Bassline Bruiser"
];

export async function analyzePersonality(topArtists: SpotifyArtist[], topTracks: SpotifyTrack[], audioFeatures: (SpotifyAudioFeatures | null)[]) {
  const artistNames = topArtists.map((a) => a.name).join(", ");
  const genres = [...new Set(topArtists.flatMap((a) => a.genres))].slice(0, 15).join(", ");
  
  // Calculate average audio features
  let avgEnergy = 0, avgValence = 0, avgDanceability = 0, avgAcousticness = 0;
  
  if (audioFeatures && audioFeatures.length > 0) {
    const validFeatures = audioFeatures.filter(f => f !== null);
    avgEnergy = validFeatures.reduce((acc, f) => acc + (f.energy || 0), 0) / validFeatures.length;
    avgValence = validFeatures.reduce((acc, f) => acc + (f.valence || 0), 0) / validFeatures.length;
    avgDanceability = validFeatures.reduce((acc, f) => acc + (f.danceability || 0), 0) / validFeatures.length;
    avgAcousticness = validFeatures.reduce((acc, f) => acc + (f.acousticness || 0), 0) / validFeatures.length;
  }

  const prompt = `
    You are an expert music psychologist and behavioral analyst. 
    Analyze the user's music taste based on their Spotify data and assign them exactly ONE of the following 12 Personality Archetypes:
    ${ARCHETYPES.join(", ")}
    
    User's Data:
    - Top Artists: ${artistNames}
    - Top Genres: ${genres}
    - Average Energy (0-1): ${avgEnergy.toFixed(2)}
    - Average Valence/Positivity (0-1): ${avgValence.toFixed(2)}
    - Average Danceability (0-1): ${avgDanceability.toFixed(2)}
    - Average Acousticness (0-1): ${avgAcousticness.toFixed(2)}
    
    Provide the output in strictly valid JSON format with the following structure:
    {
      "primaryArchetype": "One of the 12 archetypes",
      "secondaryTrait": "A short 2-4 word description (e.g., 'High Rhythmic Energy')",
      "listeningAura": "A color hex code representing their vibe (e.g., '#8A2BE2')",
      "summary": "A 2-sentence poetic but analytical summary of their music personality.",
      "chaosIndex": "A percentage string (e.g., '78%') representing how chaotic/eclectic their taste is."
    }
    
    DO NOT wrap the response in markdown blocks like \`\`\`json. Return ONLY the raw JSON string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No text returned from Gemini");
    }
    // Clean up potential markdown formatting from Gemini
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    
    // Validate and sanitize AI output to prevent injection attacks
    return validatePersonalityOutput(parsed);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data so the app doesn't break
    return {
      primaryArchetype: "The Midnight Dreamer",
      secondaryTrait: "Late-night introspection",
      listeningAura: "#8A2BE2",
      summary: "Your music taste leans toward emotionally immersive late-night introspection. You find comfort in atmospheric beats.",
      chaosIndex: "42%"
    };
  }
}
