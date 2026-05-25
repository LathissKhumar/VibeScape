import { render, screen } from "@/test/test-utils";
import ArchetypePreviewSection from "../ArchetypePreviewSection";

describe("ArchetypePreviewSection", () => {
  test("renders section heading", () => {
    render(<ArchetypePreviewSection />);
    expect(
      screen.getByText("Discover Your Audio Archetype")
    ).toBeInTheDocument();
  });

  test("renders Personal Identity label", () => {
    render(<ArchetypePreviewSection />);
    expect(screen.getByText("Personal Identity")).toBeInTheDocument();
  });

  test("renders all three archetype cards", () => {
    render(<ArchetypePreviewSection />);
    expect(screen.getByText("The Sonic Architect")).toBeInTheDocument();
    expect(screen.getByText("The Midnight Dreamer")).toBeInTheDocument();
    expect(screen.getByText("The Rhythm Rebel")).toBeInTheDocument();
  });

  test("renders archetype descriptions", () => {
    render(<ArchetypePreviewSection />);
    expect(
      screen.getByText(/Precision, structure, and complex layers/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Atmospheric, ethereal, and emotive/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/High energy, disruptive, and pulse-driven/i)
    ).toBeInTheDocument();
  });

  test("renders genre badges", () => {
    render(<ArchetypePreviewSection />);
    expect(screen.getByText("Techno")).toBeInTheDocument();
    expect(screen.getByText("Jazz")).toBeInTheDocument();
    expect(screen.getByText("Ambient")).toBeInTheDocument();
    expect(screen.getByText("Indie")).toBeInTheDocument();
    expect(screen.getByText("Phonk")).toBeInTheDocument();
    expect(screen.getByText("Drill")).toBeInTheDocument();
  });
});
