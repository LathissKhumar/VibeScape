"use client";

import { signIn } from "next-auth/react";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import useMediaQuery from "@/hooks/useMediaQuery";

const NAV_LINKS = [
  { href: "#archetypes", label: "Archetypes", active: true },
  { href: "#galaxy", label: "Galaxy" },
  { href: "#science", label: "Science" },
];

export default function LandingNav() {
  const isDesktop = useMediaQuery("(min-width: 768px)", true);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-2xl border-b border-glass-border">
      <div className="flex justify-between items-center px-5 md:px-16 py-6 max-w-[1440px] mx-auto">
        <div className="font-[var(--font-outfit)] text-2xl font-bold text-on-surface tracking-tighter">
          VibeDNA
        </div>

        {isDesktop ? (
          <>
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

            <button
              onClick={() => signIn("spotify")}
              className="hidden md:inline-flex gradient-button px-6 py-2 rounded-full font-bold text-white active:scale-95 duration-200 cursor-pointer text-sm"
            >
              Connect with Spotify
            </button>
          </>
        ) : (
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
        )}
      </div>
    </nav>
  );
}
