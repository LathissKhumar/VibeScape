"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ArchetypePreviewSection from "@/components/landing/ArchetypePreviewSection";
import GalaxyPreviewSection from "@/components/landing/GalaxyPreviewSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
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
    <div className="min-h-screen bg-bg-deep text-on-surface overflow-x-hidden mesh-gradient">
      <div className="noise-overlay" />
      <div className="fixed inset-0 z-0">
        <Starfield />
      </div>
      <div className="fixed inset-0 z-0 hero-gradient-overlay pointer-events-none" />

      <LandingNav />
      <HeroSection />
      <div className="mb-24" />
      <HowItWorksSection />
      <div className="mb-32" />
      <FeaturesSection />
      <div className="mb-32" />
      <ArchetypePreviewSection />
      <div className="mb-32" />
      <GalaxyPreviewSection />
      <div className="mb-32" />
      <SocialProofSection />
      <div className="mb-32" />
      <FinalCTASection />
      <FooterSection />
    </div>
  );
}
