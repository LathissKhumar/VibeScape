import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DashboardNav from "../DashboardNav";

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

describe("DashboardNav", () => {
  test("renders VibeDNA branding", () => {
    render(<DashboardNav />);
    expect(screen.getByText("VibeDNA")).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    render(<DashboardNav />);
    expect(screen.getByText("Archetypes")).toBeInTheDocument();
    expect(screen.getByText("Galaxy")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();
  });

  test("renders Sign Out button", () => {
    render(<DashboardNav />);
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });
});
