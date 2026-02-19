"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToggleState } from "@/hooks/useToggleState";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section 1 — THE WOW (First scroll after toggle)
 *
 * Pure visual energy. Minimal copy. The "oh shit" moment.
 * Neon palette goes full blast. Depends heavily on assets.
 *
 * PLACEHOLDER: Waiting for asset drop (3D, video, particles).
 */
export default function Wow() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isAlive || !contentRef.current) return;

      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  return (
    <section
      ref={sectionRef}
      id="wow"
      className="section relative overflow-hidden"
    >
      {/* Neon gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,240,255,0.06)_0%,_transparent_50%),_radial-gradient(ellipse_at_bottom_right,_rgba(255,45,123,0.06)_0%,_transparent_50%)]" />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
      >
        {/* Placeholder — will be replaced with full visual experience */}
        <div className="h-px w-24 bg-gradient-to-r from-neon-blue via-neon-pink to-neon-green" />

        <p className="text-lg uppercase tracking-[0.3em] text-text-dim">
          The Wow
        </p>

        <div className="flex gap-4">
          {["blue", "pink", "green", "amber", "purple"].map((color) => (
            <div
              key={color}
              className={`h-3 w-3 rounded-full bg-neon-${color}`}
              style={{
                background: `var(--neon-${color})`,
                boxShadow: `0 0 15px var(--neon-${color})`,
              }}
            />
          ))}
        </div>

        <p className="max-w-md text-sm text-text-dim">
          Asset drop incoming — 3D, video, particles, motion graphics
        </p>

        <div className="h-px w-24 bg-gradient-to-r from-neon-green via-neon-pink to-neon-blue" />
      </div>
    </section>
  );
}
