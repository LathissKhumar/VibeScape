"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "#archetypes", label: "Archetypes", sectionId: "archetypes" },
  { href: "#patterns", label: "Patterns", sectionId: "patterns" },
  { href: "#stats", label: "Stats", sectionId: "stats" },
  { href: "#sonic-dna", label: "Sonic DNA", sectionId: "sonic-dna" },
  { href: "#universe", label: "Universe", sectionId: "universe" },
];

interface DashboardNavProps {
  activeSection?: string;
}

export default function DashboardNav({ activeSection: activeSectionProp }: DashboardNavProps) {
  const [activeSection, setActiveSection] = useState(activeSectionProp || "archetypes");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 glass-enhanced backdrop-blur-3xl rounded-none border-b border-glass-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1440px] mx-auto">
        <div className="font-[var(--font-outfit)] text-2xl font-bold tracking-tight gradient-text-animated">
          Resona
        </div>
        <div className="hidden md:flex gap-8 items-center" role="menubar">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              role="menuitem"
              aria-current={activeSection === link.sectionId ? "page" : undefined}
              className={`text-sm transition-all duration-300 pb-1 ${
                activeSection === link.sectionId
                  ? "text-neon-cyan font-bold border-b-2 border-neon-cyan hover:glow-purple"
                  : "text-on-surface-variant hover:text-on-surface hover:glow-purple"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="inline-flex items-center justify-center rounded-lg min-w-12 min-h-12 text-on-surface hover:bg-white/10" aria-label="Open navigation menu">
                <MenuIcon className="size-6" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-surface border-glass-border w-72">
                <div className="flex flex-col gap-6 mt-12">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={activeSection === link.sectionId ? "page" : undefined}
                      className={`text-lg transition-all duration-300 pb-1 ${
                        activeSection === link.sectionId
                          ? "text-neon-cyan font-bold border-b-2 border-neon-cyan w-fit"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                  <hr className="border-glass-border" />
                  <button
                    onClick={() => signOut()}
                    className="w-full bg-primary-container text-on-primary-container rounded-full py-3 min-h-11 flex items-center justify-center text-sm font-bold hover:brightness-110 transition-all neon-glow-purple cursor-pointer"
                    aria-label="Sign out of your account"
                  >
                    Sign Out
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <button
            onClick={() => signOut()}
            className="hidden md:inline-flex bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full text-sm font-bold hover:brightness-110 active:scale-95 transition-all neon-glow-purple cursor-pointer"
            aria-label="Sign out of your account"
          >
            Sign Out
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
