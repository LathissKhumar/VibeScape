import { render, screen } from "@testing-library/react";
import DashboardBentoGrid from "../DashboardBentoGrid";

describe("DashboardBentoGrid", () => {
  test("renders children", () => {
    render(
      <DashboardBentoGrid>
        <div data-testid="child">Item 1</div>
        <div data-testid="child2">Item 2</div>
      </DashboardBentoGrid>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("child2")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const { container } = render(
      <DashboardBentoGrid className="custom-class">
        <div>Content</div>
      </DashboardBentoGrid>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("has correct default grid classes", () => {
    const { container } = render(
      <DashboardBentoGrid>
        <div>Content</div>
      </DashboardBentoGrid>
    );
    expect(container.firstChild).toHaveClass("grid");
    expect(container.firstChild).toHaveClass("grid-cols-1");
    expect(container.firstChild).toHaveClass("md:grid-cols-12");
    expect(container.firstChild).toHaveClass("gap-6");
  });
});
