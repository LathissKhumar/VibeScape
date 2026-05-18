import { AuthOptions, DefaultSession } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const requiredEnvVars = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

interface SpotifyToken {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  user?: DefaultSession["user"];
  error?: string;
}

const scopes = [
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
].join(",");

const params = new URLSearchParams({ scope: scopes });
const LOGIN_URL = `https://accounts.spotify.com/authorize?${params.toString()}`;

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: SpotifyToken) {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const basicAuth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      method: "POST",
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken || "",
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch {
    console.error("Error refreshing access token: Token refresh failed");

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-nextauth.session-token" : "nextauth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
          refreshToken: account.refresh_token,
          user: {
            ...user,
            id: user.id,
          },
        };
      }

      // Return previous token if the access token has not expired yet
      const tokenWithExpiry = token as SpotifyToken;
      if (tokenWithExpiry.accessTokenExpires && Date.now() < tokenWithExpiry.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(tokenWithExpiry);
    },
    async session({ session, token }) {
      const spotifyToken = token as SpotifyToken;
      session.user = {
        ...session.user,
        ...spotifyToken.user,
        id: (spotifyToken.user as DefaultSession["user"] & { id?: string })?.id || session.user.id || "",
      };
      session.accessToken = spotifyToken.accessToken ?? "";
      session.error = spotifyToken.error;
      return session;
    },
  },
};
