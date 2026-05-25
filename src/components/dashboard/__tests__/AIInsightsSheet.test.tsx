import { render, screen } from "@/test/test-utils";
import AIInsightsSheet from "../AIInsightsSheet";
import type { Personality } from "@/types/next-auth";
import type { SpotifyArtist, SpotifyAudioFeatures } from "@/lib/spotify";

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet">{children}</div>,
  SheetTrigger: ({ render: renderProp }: { render?: React.ReactNode }) => (
    <div data-testid="sheet-trigger">{renderProp}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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
    expect(screen.getByText("Your AI Insights")).toBeInTheDocument();
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
    expect(screen.getAllByText("80%").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("70%").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("20%").length).toBeGreaterThanOrEqual(1);
  });

  test("renders quick stats", () => {
    render(
      <AIInsightsSheet
        personality={mockPersonality}
        topArtists={mockArtists}
        audioFeatures={mockFeatures}
      />
    );
    expect(screen.getByText("Artists")).toBeInTheDocument();
    expect(screen.getByText("Tracks")).toBeInTheDocument();
  });

  test("renders refresh analysis button", () => {
    render(
      <AIInsightsSheet
        personality={mockPersonality}
        topArtists={mockArtists}
        audioFeatures={mockFeatures}
      />
    );
    const refreshBtn = screen.getByText("Refresh Analysis");
    expect(refreshBtn).toBeInTheDocument();
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
    expect(screen.getByText("Your AI Insights")).toBeInTheDocument();
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
    expect(screen.getByText("Your AI Insights")).toBeInTheDocument();
    expect(
      screen.getByText(/No personality data yet/)
    ).toBeInTheDocument();
  });
});
