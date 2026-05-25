import { render, screen } from "@/test/test-utils";
import LandingNav from "../LandingNav";

describe("LandingNav", () => {
  test("renders Resona logo", () => {
    render(<LandingNav />);
    expect(screen.getByText("Resona")).toBeInTheDocument();
  });

  test("renders all nav links", () => {
    render(<LandingNav />);
    expect(screen.getByText("Archetypes")).toBeInTheDocument();
    expect(screen.getByText("Galaxy")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();
  });

  test("renders Connect with YouTube Music button on desktop", () => {
    render(<LandingNav />);
    expect(screen.getByText("Connect with YouTube Music")).toBeInTheDocument();
  });
});
