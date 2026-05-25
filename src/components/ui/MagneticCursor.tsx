"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

export default function MagneticCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.5 });
  const dotX = useSpring(mouseX, { stiffness: 500, damping: 28, mass: 0.2 });
  const dotY = useSpring(mouseY, { stiffness: 500, damping: 28, mass: 0.2 });
  const ringRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (!isVisible) setIsVisible(true);
  }, [mouseX, mouseY, isVisible]);

  useEffect(() => {
    const touch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    window.addEventListener("mousemove", handleMouseMove);

    const interactiveElements = document.querySelectorAll("button, a, [role=button], .magnetic");

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [handleMouseMove, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <motion.div
        className="magnetic-cursor-dot"
        style={{ x: dotX, y: dotY, opacity: isVisible ? 1 : 0 }}
      />
      <motion.div
        ref={ringRef}
        className={`magnetic-cursor-ring ${isHovering ? "hovering" : ""}`}
        style={{ x: ringX, y: ringY, opacity: isVisible ? 1 : 0 }}
      />
    </>
  );
}
