import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

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

export const metadata: Metadata = {
  title: "VibeDNA - Decode Your Sonic Soul",
  description:
    "Make people obsessed with discovering themselves through music. VibeDNA decodes your listening habits into a digital fingerprint.",
  keywords: ["music", "personality", "spotify", "analytics", "archetype", "vibedna"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased selection:bg-neon-purple selection:text-white`}
        style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
