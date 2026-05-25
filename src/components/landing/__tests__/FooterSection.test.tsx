import { render, screen } from "@/test/test-utils";
import FooterSection from "../FooterSection";

describe("FooterSection", () => {
  test("renders Resona branding", () => {
    render(<FooterSection />);
    expect(screen.getByText("Resona")).toBeInTheDocument();
  });

  test("renders copyright text", () => {
    render(<FooterSection />);
    expect(
      screen.getByText(/2026 Resona\. Decode your sonic soul/i)
    ).toBeInTheDocument();
  });

  test("renders all footer links", () => {
    render(<FooterSection />);
    expect(screen.getAllByText("Privacy").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Terms").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Support")).toBeInTheDocument();
  });
});
