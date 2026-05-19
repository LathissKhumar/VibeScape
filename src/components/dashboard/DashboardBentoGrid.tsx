import React from "react";

interface DashboardBentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardBentoGrid({
  children,
  className = "",
}: DashboardBentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${className}`}>
      {children}
    </div>
  );
}
