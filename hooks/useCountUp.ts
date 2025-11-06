import { useState, useEffect, useRef } from 'react';

// Easing function for a more natural animation
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const useCountUp = (endValue: number, duration: number = 1500, startValue: number = 0) => {
  const [count, setCount] = useState(startValue);
  // FIX: Provide an initial value to useRef to fix "Expected 1 arguments, but got 0" error.
  const frameRef = useRef<number | undefined>(undefined);
  // FIX: Provide an initial value to useRef to fix "Expected 1 arguments, but got 0" error.
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    startTimeRef.current = undefined; // Reset start time on each new animation
    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const currentCount = startValue + (endValue - startValue) * easedProgress;
      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [endValue, startValue, duration]);

  return count;
};
