import { render, screen } from "@/test/test-utils";
import HeroSection from "../HeroSection";

describe("HeroSection", () => {
  test("renders heading text", () => {
    const { container } = render(<HeroSection />);
    expect(container.textContent).toContain("DecodeYourSonicSoul");
  });

  test("renders badge text", () => {
    render(<HeroSection />);
    expect(screen.getByText("AI-Powered Listening Intelligence")).toBeInTheDocument();
  });

  test("renders description paragraph", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/AI-powered YouTube Music listening intelligence/i)
    ).toBeInTheDocument();
  });

  test("renders Connect with YouTube Music button", () => {
    render(<HeroSection />);
    expect(screen.getByText("Connect with YouTube Music")).toBeInTheDocument();
  });
});
