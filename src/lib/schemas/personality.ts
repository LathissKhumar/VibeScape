import { z } from "zod";

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
  "The Bassline Bruiser",
] as const;

const hexColor = z
  .string()
  .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Must be a valid hex color");

const noHtml = (s: string) =>
  s.replace(/[<>]/g, "").replace(/<[^>]*>/g, "");

export const PersonalitySchema = z.object({
  primaryArchetype: z.enum(ARCHETYPES),
  secondaryTrait: z
    .string()
    .min(1)
    .max(50)
    .transform(noHtml),
  listeningAura: hexColor,
  summary: z
    .string()
    .min(1)
    .max(500)
    .transform((s) => noHtml(s).slice(0, 500)),
  chaosIndex: z
    .string()
    .regex(/^(\d{1,3})%?$/, "Must be a percentage like '78%'")
    .transform((s) => {
      const num = parseInt(s.replace("%", ""), 10);
      if (num < 0 || num > 100) return "50%";
      return `${num}%`;
    }),
});

export type Personality = z.infer<typeof PersonalitySchema>;

export const SAFE_DEFAULTS: Personality = {
  primaryArchetype: "The Midnight Dreamer",
  secondaryTrait: "Introspective listening",
  listeningAura: "#8A2BE2",
  summary: "Your music taste reflects a unique personal journey.",
  chaosIndex: "50%",
};
