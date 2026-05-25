import { render, screen } from "@/test/test-utils";
import AudioRadarSection from "../AudioRadarSection";
import type { SpotifyAudioFeatures } from "@/lib/spotify";
import { vi } from "vitest";

beforeAll(() => {
  Element.prototype.getTotalLength = vi.fn(() => 500);
});

const mockFeatures: SpotifyAudioFeatures[] = [
  { energy: 0.8, valence: 0.6, danceability: 0.7, acousticness: 0.2, instrumentalness: 0.1, speechiness: 0.05, tempo: 120 },
];

describe("AudioRadarSection", () => {
  test("renders radar chart with aura color", () => {
    render(
      <AudioRadarSection audioFeatures={mockFeatures} auraColor="#A855F7" />
    );
    expect(screen.getByText("Your Sonic DNA")).toBeInTheDocument();
    expect(screen.getAllByText("Energy").length).toBeGreaterThanOrEqual(1);
  });

  test("renders empty state when no valid features", () => {
    render(
      <AudioRadarSection audioFeatures={[null]} auraColor="#A855F7" />
    );
    expect(screen.getByText("No audio features yet")).toBeInTheDocument();
  });

  test("renders loading state", () => {
    render(
      <AudioRadarSection audioFeatures={[]} auraColor="#A855F7" loading={true} />
    );
    expect(screen.queryByText("Your Sonic DNA")).not.toBeInTheDocument();
  });

  test("renders stat cards", () => {
    render(
      <AudioRadarSection audioFeatures={mockFeatures} auraColor="#A855F7" />
    );
    expect(screen.getByText("Highest")).toBeInTheDocument();
    expect(screen.getByText("Lowest")).toBeInTheDocument();
    expect(screen.getByText("Contrast")).toBeInTheDocument();
  });
});
