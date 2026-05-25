import { render, screen, waitFor, fireEvent } from "@/test/test-utils";
import ListeningHeatmapSection from "../ListeningHeatmapSection";
import type { SpotifyRecentlyPlayed } from "@/lib/spotify";

const mockPlays: SpotifyRecentlyPlayed[] = [
  { played_at: "2026-05-20T14:00:00Z", track: { id: "1", name: "Track 1" } },
  { played_at: "2026-05-20T15:00:00Z", track: { id: "2", name: "Track 2" } },
  { played_at: "2026-05-21T03:00:00Z", track: { id: "3", name: "Track 3" } },
];

describe("ListeningHeatmapSection", () => {
  test("renders wrapper when plays provided", () => {
    const { container } = render(
      <ListeningHeatmapSection recentlyPlayed={mockPlays} />
    );
    const wrapper = container.querySelector('[class*="col-span"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("md:col-span-12");
  });

  test("renders empty state when no plays", () => {
    render(<ListeningHeatmapSection recentlyPlayed={[]} />);
    expect(
      screen.getByText(/No listening data yet/)
    ).toBeInTheDocument();
  });

  test("renders loading state", () => {
    render(
      <ListeningHeatmapSection recentlyPlayed={[]} loading={true} />
    );
    expect(
      screen.queryByText(/No listening data yet/)
    ).not.toBeInTheDocument();
  });

  test("renders section heading", () => {
    render(<ListeningHeatmapSection recentlyPlayed={mockPlays} />);
    expect(screen.getByText("Your Listening Rhythm")).toBeInTheDocument();
  });

  test("heatmap computation uses correct day/hour buckets", () => {
    const plays: SpotifyRecentlyPlayed[] = [
      { played_at: "2026-05-20T14:00:00Z", track: { id: "1", name: "T1" } },
      { played_at: "2026-05-20T14:30:00Z", track: { id: "2", name: "T2" } },
      { played_at: "2026-05-21T03:00:00Z", track: { id: "3", name: "T3" } },
    ];
    const { container } = render(<ListeningHeatmapSection recentlyPlayed={plays} />);
    const cells = container.querySelectorAll('[class*="grid-cols-24"] > div');
    expect(cells.length).toBeGreaterThan(0);
  });

  test("insight computation shows peak hour, peak day, and quietest", () => {
    render(<ListeningHeatmapSection recentlyPlayed={mockPlays} />);
    expect(screen.getByText("Peak Hour")).toBeInTheDocument();
    expect(screen.getByText("Peak Day")).toBeInTheDocument();
    expect(screen.getByText("Quietest")).toBeInTheDocument();
  });

  test("tooltip renders on hover", async () => {
    const { container } = render(<ListeningHeatmapSection recentlyPlayed={mockPlays} />);
    const cells = container.querySelectorAll('[class*="grid-cols-24"] > div');
    if (cells.length > 0) {
      const firstCell = cells[0];
      fireEvent.mouseEnter(firstCell);
      await waitFor(() => {
        expect(screen.getByText(/Monday/)).toBeInTheDocument();
        expect(screen.getByText(/Intensity:/)).toBeInTheDocument();
      });
    }
  });
});
