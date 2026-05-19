import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import HeroSection from "../HeroSection";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("@/hooks/useReducedMotion", () => ({
  default: () => false,
}));

describe("HeroSection", () => {
  test("renders heading text", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/Make people obsessed with/i)
    ).toBeInTheDocument();
  });

  test("renders gradient text span", () => {
    render(<HeroSection />);
    expect(screen.getByText("discovering themselves")).toBeInTheDocument();
  });

  test("renders description paragraph", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/VibeDNA decodes your listening habits/i)
    ).toBeInTheDocument();
  });

  test("renders Connect with Spotify button", () => {
    render(<HeroSection />);
    expect(screen.getByText("Connect with Spotify")).toBeInTheDocument();
  });

  test("renders Explore Galaxy link", () => {
    render(<HeroSection />);
    expect(screen.getByText("Explore Galaxy")).toBeInTheDocument();
  });
});
