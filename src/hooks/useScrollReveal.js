import { useEffect, useRef, useState } from "react";

export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? "0px 0px -60px 0px",
      }
    );

    observer.observe(element);

    // Safety fallback: content should never remain hidden.
    const fallback = window.setTimeout(() => {
      setIsVisible(true);
    }, options.fallbackDelay ?? 1800);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [options.threshold, options.rootMargin, options.fallbackDelay]);

  return { ref, isVisible };
}
