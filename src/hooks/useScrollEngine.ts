"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Only register in browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollEngine(enabled: boolean) {
  const lenisRef = useRef<InstanceType<typeof import("lenis").default> | null>(
    null
  );

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let lenis: InstanceType<typeof import("lenis").default>;

    async function init() {
      const Lenis = (await import("lenis")).default;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      lenisRef.current = lenis;

      // Sync Lenis scroll position with GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Drive Lenis from GSAP ticker for frame-perfect sync
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }

    init();

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      gsap.ticker.remove((time) => {
        lenis?.raf(time * 1000);
      });
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef;
}
