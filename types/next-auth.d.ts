import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken: string;
    error?: string;
  }
}

export interface Personality {
  primaryArchetype: string;
  secondaryTrait: string;
  listeningAura: string;
  summary: string;
  chaosIndex: string;
}
