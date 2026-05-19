import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AudioRadarSection from "../AudioRadarSection";
import type { SpotifyAudioFeatures } from "@/lib/spotify";

vi.mock("@/components/AudioFeaturesChart", () => ({
  default: ({ auraColor }: any) => (
    <div data-testid="audio-radar" data-aura={auraColor}>
      Audio Radar
    </div>
  ),
}));

const mockFeatures: SpotifyAudioFeatures[] = [
  { energy: 0.8, valence: 0.6, danceability: 0.7, acousticness: 0.2, instrumentalness: 0.1, speechiness: 0.05, tempo: 120 },
];

describe("AudioRadarSection", () => {
  test("renders radar chart with aura color", () => {
    render(
      <AudioRadarSection audioFeatures={mockFeatures} auraColor="#A855F7" />
    );
    const radar = screen.getByTestId("audio-radar");
    expect(radar).toBeInTheDocument();
    expect(radar).toHaveAttribute("data-aura", "#A855F7");
  });

  test("renders empty state when no valid features", () => {
    render(
      <AudioRadarSection audioFeatures={[null]} auraColor="#A855F7" />
    );
    expect(screen.getByText("No audio features yet")).toBeInTheDocument();
    expect(screen.queryByTestId("audio-radar")).not.toBeInTheDocument();
  });

  test("renders loading state", () => {
    render(
      <AudioRadarSection audioFeatures={[]} auraColor="#A855F7" loading={true} />
    );
    expect(screen.queryByTestId("audio-radar")).not.toBeInTheDocument();
  });
});
