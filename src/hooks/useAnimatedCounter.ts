import { useState, useEffect, useRef } from "react";

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useAnimatedCounter(target: number, duration: number = 1500, decimals: number = 0) {
  const [value, setValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- animation reset: setState here is required to restart animation when target/duration changes, no cascading renders
    setIsComplete(false);
    setValue(0);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = easedProgress * target;

      setValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
        setIsComplete(true);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, decimals]);

  return { value, isComplete };
}
