"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  target,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const { value } = useAnimatedCounter(inView ? target : 0, duration, decimals);

  return (
    <motion.span
      ref={ref}
      className="font-[var(--font-space-grotesk)]"
    >
      {prefix}{value.toFixed(decimals).toLocaleString()}{suffix}
    </motion.span>
  );
}
