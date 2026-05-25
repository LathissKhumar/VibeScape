import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DashboardNav from "../DashboardNav";

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

describe("DashboardNav", () => {
  test("renders Resona branding", () => {
    render(<DashboardNav />);
    expect(screen.getByText("Resona")).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    render(<DashboardNav />);
    expect(screen.getByText("Archetypes")).toBeInTheDocument();
    expect(screen.getByText("Patterns")).toBeInTheDocument();
    expect(screen.getByText("Sonic DNA")).toBeInTheDocument();
    expect(screen.getByText("Universe")).toBeInTheDocument();
  });

  test("renders Sign Out button", () => {
    render(<DashboardNav />);
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });
});
