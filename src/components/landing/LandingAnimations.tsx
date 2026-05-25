"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";

const sections = [
  { id: "hero", Component: () => import("@/components/landing/HeroSection").then(m => m.default) },
  { id: "archetypes", Component: () => import("@/components/landing/ArchetypePreviewSection").then(m => m.default) },
  { id: "galaxy", Component: () => import("@/components/landing/GalaxyPreviewSection").then(m => m.default) },
  { id: "footer", Component: () => import("@/components/landing/FooterSection").then(m => m.default) },
];

export default function LandingAnimations() {
  const reduced = useReducedMotion();

  return (
    <>
      {sections.map(({ id }, index) => (
        <motion.div
          key={id}
          id={id}
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        />
      ))}
    </>
  );
}
