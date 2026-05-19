"use client";

import React from "react";
import ErrorState from "@/components/ui/ErrorState";

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRetry?: () => void;
}

interface DashboardErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class DashboardErrorBoundary extends React.Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorState
          title="Section Error"
          message={this.state.error?.message ?? "An unexpected error occurred in this dashboard section."}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
