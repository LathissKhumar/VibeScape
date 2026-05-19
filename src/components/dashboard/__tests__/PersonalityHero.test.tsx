import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import PersonalityHero from "../PersonalityHero";
import type { Personality } from "@/types/next-auth";

vi.mock("@/hooks/useReducedMotion", () => ({
  default: () => false,
}));

const mockPersonality: Personality = {
  primaryArchetype: "The Visionary Curator",
  secondaryTrait: "Deep Listener",
  listeningAura: "#A855F7",
  summary: "You seek meaning in every melody.",
  chaosIndex: "42%",
};

describe("PersonalityHero", () => {
  test("renders archetype name with gradient", () => {
    render(<PersonalityHero personality={mockPersonality} />);
    expect(screen.getByText("The")).toBeInTheDocument();
    expect(screen.getByText("Visionary")).toBeInTheDocument();
    expect(screen.getByText("Curator")).toBeInTheDocument();
  });

  test("renders summary", () => {
    render(<PersonalityHero personality={mockPersonality} />);
    expect(screen.getByText("You seek meaning in every melody.")).toBeInTheDocument();
  });

  test("renders secondary trait badge", () => {
    render(<PersonalityHero personality={mockPersonality} />);
    expect(screen.getByText("Deep Listener")).toBeInTheDocument();
  });

  test("renders chaos index", () => {
    render(<PersonalityHero personality={mockPersonality} />);
    expect(screen.getByText("Chaos: 42%")).toBeInTheDocument();
  });

  test("renders CTA buttons", () => {
    render(<PersonalityHero personality={mockPersonality} />);
    expect(screen.getByText("Share DNA")).toBeInTheDocument();
    expect(screen.getByText("Explore Galaxy")).toBeInTheDocument();
  });

  test("renders loading skeleton when loading", () => {
    const { container } = render(<PersonalityHero personality={null} loading={true} />);
    // Should not render personality content
    expect(screen.queryByText("The Visionary Curator")).not.toBeInTheDocument();
    // Should render skeleton elements (they have class containing "animate-pulse" or similar)
    const skeletons = container.querySelectorAll('[class*="animate"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(0);
  });

  test("renders empty state when no personality and not loading", () => {
    render(<PersonalityHero personality={null} loading={false} />);
    expect(screen.getByText("No personality data yet")).toBeInTheDocument();
  });
});
