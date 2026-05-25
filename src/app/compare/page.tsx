import { Suspense } from "react";
import CompareContent from "./CompareContent";

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <p className="text-on-surface-variant">Loading comparison...</p>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
