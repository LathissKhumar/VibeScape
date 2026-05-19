import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ListeningHeatmapSection from "../ListeningHeatmapSection";
import type { SpotifyAudioFeatures } from "@/lib/spotify";

// Mock next/dynamic so dynamic imports resolve synchronously in tests
vi.mock("next/dynamic", () => ({
  default: () => {
    const DynamicMock = (props: any) => {
      if (props.children) return props.children;
      return null;
    };
    DynamicMock.displayName = "DynamicMock";
    return DynamicMock;
  },
}));

const mockFeatures: SpotifyAudioFeatures[] = [
  { energy: 0.8, valence: 0.6, danceability: 0.7, acousticness: 0.2, instrumentalness: 0.1, speechiness: 0.05, tempo: 120 },
  { energy: 0.5, valence: 0.4, danceability: 0.6, acousticness: 0.5, instrumentalness: 0.3, speechiness: 0.1, tempo: 100 },
];

describe("ListeningHeatmapSection", () => {
  test("renders wrapper when audio features provided", () => {
    const { container } = render(
      <ListeningHeatmapSection audioFeatures={mockFeatures} />
    );
    // The wrapper div with the grid column span class should be present
    const wrapper = container.querySelector('[class*="col-span"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("md:col-span-12");
  });

  test("renders empty state when no valid features", () => {
    render(<ListeningHeatmapSection audioFeatures={[null, null]} />);
    expect(
      screen.getByText(/No listening data available/)
    ).toBeInTheDocument();
  });

  test("renders loading state", () => {
    render(
      <ListeningHeatmapSection audioFeatures={[]} loading={true} />
    );
    expect(
      screen.queryByText(/No listening data available/)
    ).not.toBeInTheDocument();
  });
});
