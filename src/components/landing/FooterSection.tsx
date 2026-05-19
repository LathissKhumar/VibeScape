export default function FooterSection() {
  return (
    <footer className="relative z-10 bg-bg-deep border-t border-glass-border">
      <div className="flex flex-col md:flex-row justify-between items-center px-5 md:px-16 py-6 gap-4 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="font-[var(--font-outfit)] text-2xl font-bold text-on-surface">VibeDNA</div>
          <p className="font-[var(--font-inter)] text-sm text-on-surface-variant">
            &copy; 2024 VibeDNA. Decode your sonic soul.
          </p>
        </div>
        <div className="flex gap-8 text-sm">
          <a className="text-on-surface-variant hover:text-neon-cyan transition-colors" href="#">
            Privacy
          </a>
          <a className="text-on-surface-variant hover:text-neon-cyan transition-colors" href="#">
            Terms
          </a>
          <a className="text-on-surface-variant hover:text-neon-cyan transition-colors" href="#">
            API
          </a>
          <a className="text-on-surface-variant hover:text-neon-cyan transition-colors" href="#">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
