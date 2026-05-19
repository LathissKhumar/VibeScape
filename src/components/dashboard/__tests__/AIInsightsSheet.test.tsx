import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AIInsightsSheet from "../AIInsightsSheet";
import type { Personality } from "@/types/next-auth";
import type { SpotifyArtist, SpotifyAudioFeatures } from "@/lib/spotify";

// Sheet uses @base-ui/react/dialog — mock the whole Sheet
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: any) => <div data-testid="sheet">{children}</div>,
  SheetTrigger: ({ render }: any) => (
    <div data-testid="sheet-trigger">{render}</div>
  ),
  SheetContent: ({ children }: any) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <div>{children}</div>,
  SheetDescription: ({ children }: any) => <div>{children}</div>,
}));

const mockPersonality: Personality = {
  primaryArchetype: "The Visionary Curator",
  secondaryTrait: "Deep Listener",
  listeningAura: "#A855F7",
  summary: "You seek meaning in every melody.",
  chaosIndex: "42%",
};

const mockArtists: SpotifyArtist[] = [
  { id: "1", name: "Radiohead", genres: ["alternative", "rock"], popularity: 85 },
  { id: "2", name: "Bonobo", genres: ["electronic"], popularity: 72 },
];

const mockFeatures: SpotifyAudioFeatures[] = [
  { energy: 0.8, valence: 0.6, danceability: 0.7, acousticness: 0.2, instrumentalness: 0.1, speechiness: 0.05, tempo: 120 },
];

describe("AIInsightsSheet", () => {
  test("renders FAB trigger button", () => {
    render(
      <AIInsightsSheet
        personality={mockPersonality}
        topArtists={mockArtists}
        audioFeatures={mockFeatures}
      />
    );
    expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
  });

  test("renders sheet with personality data", () => {
    render(
      <AIInsightsSheet
        personality={mockPersonality}
        topArtists={mockArtists}
        audioFeatures={mockFeatures}
      />
    );
    expect(screen.getByText("AI Insights")).toBeInTheDocument();
    expect(screen.getByText("The Visionary Curator")).toBeInTheDocument();
    expect(screen.getByText("You seek meaning in every melody.")).toBeInTheDocument();
    expect(screen.getByText("Deep Listener")).toBeInTheDocument();
    expect(screen.getByText("Chaos: 42%")).toBeInTheDocument();
  });

  test("renders mood overview with computed percentages", () => {
    render(
      <AIInsightsSheet
        personality={mockPersonality}
        topArtists={mockArtists}
        audioFeatures={mockFeatures}
      />
    );
    expect(screen.getByText("Mood Overview")).toBeInTheDocument();
    // Energy should be 80% (0.8 * 100)
    expect(screen.getByText("80%")).toBeInTheDocument();
    // Danceability should be 70%
    expect(screen.getByText("70%")).toBeInTheDocument();
    // Acousticness should be 20%
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  test("renders top genres", () => {
    render(
      <AIInsightsSheet
        personality={mockPersonality}
        topArtists={mockArtists}
        audioFeatures={mockFeatures}
      />
    );
    expect(screen.getByText("alternative")).toBeInTheDocument();
    expect(screen.getByText("electronic")).toBeInTheDocument();
  });

  test("renders quick stats", () => {
    render(
      <AIInsightsSheet
        personality={mockPersonality}
        topArtists={mockArtists}
        audioFeatures={mockFeatures}
      />
    );
    expect(screen.getByText("Artists Analyzed")).toBeInTheDocument();
    expect(screen.getByText("Tracks Analyzed")).toBeInTheDocument();
  });

  test("renders refresh analysis button (disabled)", () => {
    render(
      <AIInsightsSheet
        personality={mockPersonality}
        topArtists={mockArtists}
        audioFeatures={mockFeatures}
      />
    );
    const refreshBtn = screen.getByText("Refresh Analysis");
    expect(refreshBtn).toBeInTheDocument();
    expect(refreshBtn.closest("button")).toBeDisabled();
  });

  test("renders loading state", () => {
    render(
      <AIInsightsSheet
        personality={null}
        topArtists={[]}
        audioFeatures={[]}
        loading={true}
      />
    );
    expect(screen.getByText("AI Insights")).toBeInTheDocument();
    // Should not show personality content
    expect(screen.queryByText("The Visionary Curator")).not.toBeInTheDocument();
  });

  test("renders empty state when no personality", () => {
    render(
      <AIInsightsSheet
        personality={null}
        topArtists={[]}
        audioFeatures={[]}
        loading={false}
      />
    );
    expect(screen.getByText("AI Insights")).toBeInTheDocument();
    expect(
      screen.getByText(/No personality data yet/)
    ).toBeInTheDocument();
  });
});
