import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import LandingNav from "../LandingNav";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

describe("LandingNav", () => {
  test("renders VibeDNA logo", () => {
    render(<LandingNav />);
    expect(screen.getByText("VibeDNA")).toBeInTheDocument();
  });

  test("renders all nav links", () => {
    render(<LandingNav />);
    expect(screen.getByText("Archetypes")).toBeInTheDocument();
    expect(screen.getByText("Galaxy")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();
  });

  test("active link has neon-cyan styling", () => {
    render(<LandingNav />);
    const activeLink = screen.getByText("Archetypes");
    expect(activeLink.className).toContain("text-neon-cyan");
  });

  test("renders Connect with Spotify button on desktop", () => {
    render(<LandingNav />);
    expect(screen.getByText("Connect with Spotify")).toBeInTheDocument();
  });
});
