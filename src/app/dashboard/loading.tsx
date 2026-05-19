import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-bg-deep text-on-surface">
      {/* Nav skeleton */}
      <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-3xl border-b border-glass-border">
        <div className="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1440px] mx-auto">
          <div className="font-[var(--font-outfit)] text-2xl font-bold text-on-surface tracking-tight opacity-50">
            VibeDNA
          </div>
          <Skeleton className="w-32 h-10 rounded-full" />
        </div>
      </nav>

      <main className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-16 pt-32 pb-20">
        {/* Hero skeleton */}
        <section className="flex flex-col items-center text-center mb-20">
          <div className="relative mb-8">
            <div className="archetype-aura absolute inset-0 blur-3xl scale-150 rounded-full opacity-30" />
            <div className="relative z-10 p-1 rounded-full bg-gradient-to-tr from-neon-purple/30 via-neon-cyan/30 to-neon-pink/30">
              <div className="bg-bg-deep rounded-full w-32 h-32 md:w-40 md:h-40" />
            </div>
          </div>
          <Skeleton className="w-96 h-16 rounded-2xl mb-4" />
          <Skeleton className="w-[600px] max-w-full h-6 rounded-xl mb-2" />
          <Skeleton className="w-80 h-6 rounded-xl mb-8" />
          <div className="flex gap-4">
            <Skeleton className="w-40 h-14 rounded-xl" />
            <Skeleton className="w-40 h-14 rounded-xl" />
          </div>
        </section>

        {/* Bento grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 glass-card rounded-3xl h-[350px] p-8">
            <Skeleton className="w-48 h-8 rounded-xl mb-2" />
            <Skeleton className="w-64 h-4 rounded-lg" />
          </div>
          <div className="md:col-span-4 glass-card rounded-3xl h-[350px] p-8">
            <Skeleton className="w-32 h-8 rounded-xl mb-6" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-2 rounded-full" />
              ))}
            </div>
          </div>

          {/* Artist cards skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="md:col-span-4 glass-card rounded-3xl h-[280px] overflow-hidden">
              <Skeleton className="w-full h-48 rounded-none bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10" />
              <div className="p-6">
                <Skeleton className="w-24 h-3 rounded mb-2" />
                <Skeleton className="w-40 h-6 rounded" />
              </div>
            </div>
          ))}

          {/* Galaxy skeleton */}
          <div className="md:col-span-12 mt-20 glass-card rounded-3xl border border-white/5 h-[700px] relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 blur-[100px] bg-gradient-to-tr from-neon-cyan to-neon-purple" />
              <div className="text-center">
                <svg className="w-16 h-16 text-neon-purple/40 block mb-4 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2v20" />
                </svg>
                <Skeleton className="w-64 h-6 rounded-xl mx-auto" />
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
