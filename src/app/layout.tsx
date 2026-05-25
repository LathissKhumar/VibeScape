import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import MagneticCursor from "@/components/ui/MagneticCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resona — Decode Your Sonic Soul",
  description: "Your music personality, decoded. AI-powered Spotify listening intelligence that transforms your listening habits into personality insights, emotional patterns, and shareable identity cards.",
  keywords: ["music", "personality", "spotify", "analytics", "archetype", "resona", "listening intelligence"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased selection:bg-neon-purple selection:text-white`}
        style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <MagneticCursor />
      </body>
    </html>
  );
}
