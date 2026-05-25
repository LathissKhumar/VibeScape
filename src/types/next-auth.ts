// Module augmentation for next-auth Session lives in types/next-auth.d.ts
// (root-level .d.ts file for proper TypeScript declaration merging)

export interface Personality {
  primaryArchetype: string;
  secondaryTrait: string;
  listeningAura: string;
  summary: string;
  chaosIndex: string;
}
