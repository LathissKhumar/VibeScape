import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ArtistCardsSection from "../ArtistCardsSection";
import type { SpotifyArtist } from "@/lib/spotify";

vi.mock("@/hooks/useReducedMotion", () => ({
  default: () => false,
}));

const mockArtists: SpotifyArtist[] = [
  { id: "1", name: "Radiohead", genres: ["alternative", "rock"], popularity: 85 },
  { id: "2", name: "Bonobo", genres: ["electronic", "downtempo"], popularity: 72 },
  { id: "3", name: "Miles Davis", genres: ["jazz", "fusion"], popularity: 78 },
];

describe("ArtistCardsSection", () => {
  test("renders section heading", () => {
    render(
      <ArtistCardsSection topArtists={mockArtists} listeningAura="#A855F7" />
    );
    expect(screen.getByText("Sonic Influences")).toBeInTheDocument();
  });

  test("renders all three artist cards", () => {
    render(
      <ArtistCardsSection topArtists={mockArtists} listeningAura="#A855F7" />
    );
    expect(screen.getByText("Radiohead")).toBeInTheDocument();
    expect(screen.getByText("Bonobo")).toBeInTheDocument();
    expect(screen.getByText("Miles Davis")).toBeInTheDocument();
  });

  test("renders artist labels", () => {
    render(
      <ArtistCardsSection topArtists={mockArtists} listeningAura="#A855F7" />
    );
    expect(screen.getByText("Top Artist")).toBeInTheDocument();
    expect(screen.getByText("Rising Influence")).toBeInTheDocument();
    expect(screen.getByText("The Classic")).toBeInTheDocument();
  });

  test("renders genre badges", () => {
    render(
      <ArtistCardsSection topArtists={mockArtists} listeningAura="#A855F7" />
    );
    expect(screen.getByText("alternative")).toBeInTheDocument();
    expect(screen.getByText("jazz")).toBeInTheDocument();
  });

  test("renders empty state when no artists", () => {
    render(
      <ArtistCardsSection topArtists={[]} listeningAura="#A855F7" />
    );
    expect(screen.getByText("No artists found")).toBeInTheDocument();
  });

  test("renders loading skeleton when loading", () => {
    render(
      <ArtistCardsSection topArtists={[]} listeningAura="#A855F7" loading={true} />
    );
    expect(screen.queryByText("Sonic Influences")).not.toBeInTheDocument();
  });
});
