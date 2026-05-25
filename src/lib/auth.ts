import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const requiredEnvVars = ["NEXTAUTH_SECRET", "NEXTAUTH_URL"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

interface YouTubeToken {
  accessToken?: string;
  user?: DefaultSession["user"];
  error?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "YouTube Music",
      credentials: {},
      async authorize() {
        return {
          id: "ytmusic-user",
          name: "YouTube Music User",
          email: "user@ytmusic.com",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: "anonymous",
          user: {
            ...(token.user as Record<string, unknown>),
            ...user,
          },
        };
      }
      return token;
    },
    async session({ session, token }) {
      const ytToken = token as YouTubeToken;
      session.user = {
        ...session.user,
        ...ytToken.user,
        id: (ytToken.user as DefaultSession["user"] & { id?: string })?.id || session.user.id || "",
      };
      session.accessToken = ytToken.accessToken ?? "";
      session.error = ytToken.error;
      return session;
    },
  },
};
