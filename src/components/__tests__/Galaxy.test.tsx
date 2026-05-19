import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import type { SpotifyArtist } from "@/lib/spotify";
import Galaxy from "../Galaxy";

vi.mock("@/hooks/useWebGL", () => ({
  default: () => false,
}));

vi.mock("@react-three/fiber", async () => {
  const actual = await vi.importActual("@react-three/fiber");
  return {
    ...actual,
    Canvas: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="canvas-container">{children}</div>
    ),
  };
});

const mockArtists: SpotifyArtist[] = [
  { id: "1", name: "Radiohead", genres: ["alternative", "rock"], popularity: 85 },
  { id: "2", name: "Bonobo", genres: ["electronic", "downtempo"], popularity: 72 },
  { id: "3", name: "Miles Davis", genres: ["jazz", "fusion"], popularity: 78 },
];

describe("Galaxy", () => {
  test("renders WebGL fallback canvas when WebGL is not supported", () => {
    const { container } = render(<Galaxy topArtists={mockArtists} />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  test("renders fallback with empty artists array", () => {
    const { container } = render(<Galaxy topArtists={[]} />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  test("does not render galaxy controls when WebGL is not supported", () => {
    const { container } = render(<Galaxy topArtists={mockArtists} />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
    expect(container.querySelector('[aria-label*="auto-rotate"]')).not.toBeInTheDocument();
  });
});
