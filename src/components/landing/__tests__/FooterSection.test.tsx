import { render, screen } from "@testing-library/react";
import FooterSection from "../FooterSection";

describe("FooterSection", () => {
  test("renders VibeDNA branding", () => {
    render(<FooterSection />);
    expect(screen.getByText("VibeDNA")).toBeInTheDocument();
  });

  test("renders copyright text", () => {
    render(<FooterSection />);
    expect(
      screen.getByText(/2024 VibeDNA\. Decode your sonic soul/i)
    ).toBeInTheDocument();
  });

  test("renders all footer links", () => {
    render(<FooterSection />);
    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(screen.getByText("Terms")).toBeInTheDocument();
    expect(screen.getByText("API")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
  });
});
