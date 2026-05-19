"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import HeroSection from "@/components/landing/HeroSection";
import ArchetypePreviewSection from "@/components/landing/ArchetypePreviewSection";
import GalaxyPreviewSection from "@/components/landing/GalaxyPreviewSection";
import LandingNav from "@/components/landing/LandingNav";
import FooterSection from "@/components/landing/FooterSection";

const Starfield = dynamic(() => import("@/components/Starfield"), { ssr: false });

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
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>
      <div className="fixed inset-0 z-0 hero-gradient-overlay pointer-events-none" />

      <LandingNav />
      <HeroSection />
      <ArchetypePreviewSection />
      <GalaxyPreviewSection />
      <FooterSection />
    </div>
  );
}
