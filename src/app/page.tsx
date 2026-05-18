"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const Starfield = dynamic(() => import("@/components/Starfield"), { ssr: false });

const NAV_LINKS = [
  { href: "#archetypes", label: "Archetypes", active: true },
  { href: "#galaxy", label: "Galaxy" },
  { href: "#science", label: "Science" },
];

const ARCHETYPES = [
  {
    title: "The Sonic Architect",
    description:
      "Precision, structure, and complex layers. You appreciate the mathematical beauty of high-production soundscapes.",
    icon: "architecture",
    color: "neon-purple",
    badges: ["Techno", "Jazz"],
  },
  {
    title: "The Midnight Dreamer",
    description:
      "Atmospheric, ethereal, and emotive. Your soul resonates with the quiet intensity of lo-fi and cinematic scores.",
    icon: "nights_stay",
    color: "neon-cyan",
    badges: ["Ambient", "Indie"],
  },
  {
    title: "The Rhythm Rebel",
    description:
      "High energy, disruptive, and pulse-driven. You lead the charge with heavy bass and unapologetic tempo.",
    icon: "bolt",
    color: "neon-pink",
    badges: ["Phonk", "Drill"],
  },
];

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-bg-deep text-on-surface overflow-x-hidden">
      {/* Background: 3D Starfield */}
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>
      <div className="fixed inset-0 z-0 hero-gradient-overlay pointer-events-none" />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-2xl border-b border-glass-border">
        <div className="flex justify-between items-center px-5 md:px-16 py-6 max-w-[1440px] mx-auto">
          <div className="font-[var(--font-outfit)] text-2xl font-bold text-on-surface tracking-tighter">
            VibeDNA
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-4 items-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={
                  link.active
                    ? "text-neon-cyan font-bold border-b-2 border-neon-cyan pb-1 text-sm"
                    : "text-on-surface/70 hover:text-on-surface transition-colors text-sm"
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <button
            onClick={() => signIn("spotify")}
            className="hidden md:inline-flex gradient-button px-6 py-2 rounded-full font-bold text-white active:scale-95 duration-200 cursor-pointer text-sm"
          >
            Connect with Spotify
          </button>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center rounded-lg size-8 text-on-surface hover:bg-white/10">
                <MenuIcon className="size-6" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-surface border-glass-border w-72">
                <div className="flex flex-col gap-6 mt-12">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={
                        link.active
                          ? "text-neon-cyan font-bold text-lg border-b-2 border-neon-cyan pb-1 w-fit"
                          : "text-on-surface/70 hover:text-on-surface transition-colors text-lg"
                      }
                    >
                      {link.label}
                    </a>
                  ))}
                  <hr className="border-glass-border" />
                  <button
                    onClick={() => signIn("spotify")}
                    className="w-full gradient-button text-white font-bold rounded-full py-3 cursor-pointer"
                  >
                    Connect with Spotify
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center pt-24 overflow-hidden z-10">
        <div className="relative z-10 px-5 md:px-16 max-w-[1440px] mx-auto w-full">
          <div className="max-w-4xl">
            <h1 className="font-[var(--font-outfit)] text-[40px] md:text-[64px] leading-[1.1] font-bold mb-8 tracking-tighter">
              Make people obsessed with{" "}
              <span className="text-gradient-cyan">discovering themselves</span>{" "}
              through music.
            </h1>
            <p className="font-[var(--font-inter)] text-lg text-on-surface-variant mb-12 max-w-2xl leading-relaxed">
              VibeDNA decodes your listening habits into a digital fingerprint. Explore your
              sonic galaxy and find the archetypes that define your soul.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => signIn("spotify")}
                className="gradient-button px-8 py-4 rounded-xl font-[var(--font-outfit)] text-2xl text-white flex items-center gap-2 font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  graphic_eq
                </span>
                Connect with Spotify
              </button>
              <a
                href="#galaxy"
                className="glass-card px-8 py-4 rounded-xl font-[var(--font-outfit)] text-2xl text-on-surface flex items-center gap-2 hover:bg-white/5 transition-all font-semibold border border-glass-border h-auto inline-flex items-center justify-center"
              >
                Explore Galaxy
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Archetypes Preview Section */}
      <section id="archetypes" className="relative z-10 py-20 px-5 md:px-16 max-w-[1440px] mx-auto">
        <div className="mb-16 text-center">
          <span className="text-neon-pink font-[var(--font-inter)] text-sm tracking-[0.1em] uppercase mb-4 block font-semibold">
            Personal Identity
          </span>
          <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold mb-4">
            Music Personality Archetypes
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Our algorithms analyze over 50 sonic vectors to place you within one of our
            high-fidelity archetypes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARCHETYPES.map((archetype) => (
            <Card
              key={archetype.title}
              className={`glass-card rounded-2xl flex flex-col items-center text-center group hover:neon-glow-${archetype.color} transition-all duration-500 border-0`}
            >
              <CardHeader className="items-center pb-0 pt-10">
                <div
                  className={`w-16 h-16 rounded-full bg-${archetype.color}/10 flex items-center justify-center mb-6 border border-${archetype.color}/30 group-hover:bg-${archetype.color}/20 transition-colors`}
                >
                  <span className={`material-symbols-outlined text-${archetype.color} text-4xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {archetype.icon}
                  </span>
                </div>
                <CardTitle className="font-[var(--font-outfit)] text-[32px] leading-[1.3] font-semibold text-on-surface">
                  {archetype.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                  {archetype.description}
                </p>
                <div className="flex gap-2 justify-center">
                  {archetype.badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="outline"
                      className={`bg-${archetype.color}/10 border-${archetype.color}/20 text-${archetype.color}`}
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3D Galaxy Preview Section */}
      <section id="galaxy" className="relative z-10 py-20 bg-surface-container-lowest">
        <div className="px-5 md:px-16 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Galaxy visual */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-neon-purple/20 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="glass-card rounded-3xl overflow-hidden p-2">
              <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-neon-purple/20 via-surface-container to-neon-cyan/20 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-neon-cyan text-6xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                    public
                  </span>
                  <p className="text-on-surface-variant text-sm uppercase tracking-widest">
                    Interactive 3D Galaxy
                  </p>
                  <p className="text-on-surface-variant text-xs mt-2">
                    Connect with Spotify to explore
                  </p>
                </div>
              </div>
            </div>
            {/* Neural Mapping Badge */}
            <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl neon-glow-cyan">
              <div className="flex items-center gap-4">
                <div className="text-neon-cyan">
                  <span className="material-symbols-outlined text-4xl">hub</span>
                </div>
                <div>
                  <p className="font-[var(--font-inter)] text-sm text-on-surface-variant uppercase tracking-wide font-medium">
                    Neural Mapping
                  </p>
                  <p className="font-[var(--font-outfit)] text-2xl font-semibold">1.2B Connections</p>
                </div>
              </div>
            </div>
          </div>

          {/* Galaxy description */}
          <div className="lg:pl-12">
            <h2 className="font-[var(--font-outfit)] text-[40px] leading-[1.2] tracking-tight font-semibold mb-6">
              3D Music Galaxy
            </h2>
            <p className="font-[var(--font-inter)] text-lg text-on-surface-variant mb-8 leading-relaxed">
              Step inside your own personal universe. VibeDNA doesn&apos;t just list your songs; it
              visualizes the celestial geometry of your taste. Every artist is a star, every genre
              a nebula, forming a unique map of your identity that evolves as you listen.
            </p>
            <ul className="space-y-6 mb-10">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-neon-cyan mt-1">auto_awesome</span>
                <div>
                  <h4 className="font-bold text-on-surface">Spatial Exploration</h4>
                  <p className="text-on-surface-variant">
                    Navigate your library in a fully immersive 3D space designed for discovery.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-neon-purple mt-1">insights</span>
                <div>
                  <h4 className="font-bold text-on-surface">Genre Drift Analysis</h4>
                  <p className="text-on-surface-variant">
                    Visualize how your musical orbit has shifted over months or years.
                  </p>
                </div>
              </li>
            </ul>
              <a
                href="#galaxy"
                className="glass-card px-8 py-4 rounded-xl font-[var(--font-outfit)] text-2xl text-on-surface inline-flex items-center gap-2 hover:bg-white/5 transition-all font-semibold border border-glass-border h-auto"
              >
                Explore Galaxy
              </a>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}
