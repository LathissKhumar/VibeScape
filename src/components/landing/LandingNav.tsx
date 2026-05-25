"use client";

import { signIn } from "next-auth/react";
import { MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks";

const NAV_LINKS = [
  { href: "#archetypes", label: "Archetypes" },
  { href: "#galaxy", label: "Galaxy" },
  { href: "#science", label: "Science" },
];

export default function LandingNav() {
  const isDesktop = useMediaQuery("(min-width: 768px)", true);
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-enhanced border-b border-glass-border backdrop-blur-xl">
      <div className="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1440px] mx-auto">
        <a href="#" className="font-[var(--font-space-grotesk)] text-2xl font-bold gradient-text-animated tracking-tighter">
          Resona
        </a>

        {isDesktop ? (
          <>
            <div className="hidden md:flex gap-8 items-center">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-on-surface/70 hover:text-on-surface transition-colors text-sm font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <button
              onClick={() => signIn("credentials")}
              className="hidden md:inline-flex gradient-button px-6 py-2.5 rounded-full font-bold text-white active:scale-95 duration-200 cursor-pointer text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] glow-purple"
            >
              Connect with YouTube Music
            </button>
          </>
        ) : (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-lg min-w-12 min-h-12 text-on-surface hover:bg-white/10 transition-colors" aria-label="Open menu">
              <MenuIcon className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-bg-deep border-glass-border w-72">
              <div className="flex flex-col gap-6 mt-12">
                <div className="absolute top-4 right-4">
                  <SheetClose>
                    <button className="rounded-lg min-w-10 min-h-10 flex items-center justify-center text-on-surface hover:bg-white/10" aria-label="Close menu">
                      <X className="size-5" />
                    </button>
                  </SheetClose>
                </div>
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href}>
                    <a
                      href={link.href}
                      className="text-on-surface/70 hover:text-on-surface transition-colors text-lg font-medium py-2"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <hr className="border-glass-border" />
                <button
                  onClick={() => signIn("credentials")}
                  className="w-full gradient-button text-white font-bold rounded-full py-3 min-h-11 flex items-center justify-center cursor-pointer glow-purple"
                >
                  Connect with YouTube Music
                </button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
}
