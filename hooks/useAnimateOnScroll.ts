import { useState, useEffect, useRef, RefObject } from 'react';

interface AnimateOnScrollOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export const useAnimateOnScroll = <T extends HTMLElement>(
  options?: AnimateOnScrollOptions
): [RefObject<T>, boolean] => {
  const containerRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { triggerOnce, threshold, root, rootMargin } = options || {};

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            // Disconnect observer after it becomes visible to prevent re-triggering
            observer.disconnect();
          }
        } else {
            if (!triggerOnce) {
                setIsVisible(false);
            }
        }
      },
      {
        root: root || null, // viewport
        rootMargin: rootMargin || '0px',
        threshold: threshold || 0.1, // trigger when 10% of the element is visible
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [containerRef, triggerOnce, threshold, root, rootMargin]);

  return [containerRef, isVisible];
};
