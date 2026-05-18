import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getTopArtists,
  getTopTracks,
  getAudioFeatures,
  type SpotifyTrack,
  type SpotifyAudioFeatures,
} from "@/lib/spotify";
import { analyzePersonality } from "@/lib/gemini";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Data Pipeline: Spotify -> Cache -> AI
  const topArtists = await getTopArtists(session.accessToken, session.user.id);
  const topTracks = await getTopTracks(session.accessToken, session.user.id);

  const trackIds = topTracks.items.map((t: SpotifyTrack) => t.id);

  let audioFeatures = { audio_features: [] as (SpotifyAudioFeatures | null)[] };
  if (trackIds.length > 0) {
    audioFeatures = await getAudioFeatures(
      session.accessToken,
      session.user.id,
      trackIds
    );
  }

  const personality = await analyzePersonality(
    topArtists.items,
    topTracks.items,
    audioFeatures.audio_features
  );

  return (
    <DashboardClient
      personality={personality}
      topArtists={topArtists.items}
      audioFeatures={audioFeatures.audio_features}
    />
  );
}
