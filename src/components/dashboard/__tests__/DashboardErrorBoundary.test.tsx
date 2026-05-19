import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DashboardErrorBoundary from "../DashboardErrorBoundary";

vi.mock("@/components/ui/ErrorState", () => ({
  default: ({ title, message, onRetry }: any) => (
    <div data-testid="error-state">
      <div data-testid="error-title">{title}</div>
      <div data-testid="error-message">{message}</div>
      {onRetry && <button data-testid="retry-btn" onClick={onRetry}>Retry</button>}
    </div>
  ),
}));

const ExplodingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div data-testid="child">Rendered successfully</div>;
};

describe("DashboardErrorBoundary", () => {
  test("renders children when no error", () => {
    render(
      <DashboardErrorBoundary>
        <div data-testid="child">Hello</div>
      </DashboardErrorBoundary>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByTestId("error-state")).not.toBeInTheDocument();
  });

  test("renders error state when child throws", () => {
    // Suppress console.error for the expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <DashboardErrorBoundary>
        <ExplodingComponent shouldThrow={true} />
      </DashboardErrorBoundary>
    );

    expect(screen.getByTestId("error-state")).toBeInTheDocument();
    expect(screen.getByTestId("error-title")).toHaveTextContent("Section Error");
    expect(screen.getByTestId("error-message")).toHaveTextContent("Test error");

    spy.mockRestore();
  });

  test("renders custom fallback instead of ErrorState", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <DashboardErrorBoundary fallback={<div data-testid="custom-fallback">Custom Error</div>}>
        <ExplodingComponent shouldThrow={true} />
      </DashboardErrorBoundary>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("error-state")).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
