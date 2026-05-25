import { render, screen } from "@/test/test-utils";
import GalaxyPreviewSection from "../GalaxyPreviewSection";

describe("GalaxyPreviewSection", () => {
  test("renders section heading", () => {
    render(<GalaxyPreviewSection />);
    expect(screen.getByText("3D Music Galaxy")).toBeInTheDocument();
  });

  test("renders galaxy description", () => {
    render(<GalaxyPreviewSection />);
    expect(
      screen.getByText(/Step inside your own personal universe/i)
    ).toBeInTheDocument();
  });

  test("renders feature list items", () => {
    render(<GalaxyPreviewSection />);
    expect(screen.getByText("Spatial Exploration")).toBeInTheDocument();
    expect(screen.getByText("Genre Drift Analysis")).toBeInTheDocument();
  });

  test("renders Neural Mapping badge", () => {
    render(<GalaxyPreviewSection />);
    expect(screen.getByText("Neural Mapping")).toBeInTheDocument();
    expect(screen.getByText("1.2B Connections")).toBeInTheDocument();
  });

  test("renders Explore Your Universe link", () => {
    render(<GalaxyPreviewSection />);
    expect(screen.getByText("Explore Your Universe")).toBeInTheDocument();
  });

  test("renders Interactive 3D Galaxy placeholder", () => {
    render(<GalaxyPreviewSection />);
    expect(screen.getByText("Interactive 3D Galaxy")).toBeInTheDocument();
  });
});
