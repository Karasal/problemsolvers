"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useToggleState } from "@/hooks/useToggleState";
import { COPY } from "@/lib/constants";
import SplineToggle from "@/components/SplineToggle";

/**
 * Section 0 — THE GATE (Hero, above fold)
 *
 * Dormant state: Dark & moody. "GOT A PROBLEM?" visible + toggle.
 * After toggle: Text reveals "WE CAN SOLVE 'EM!" + site comes alive.
 * Scroll is locked until toggle is activated.
 */
export default function Gate() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);
  const dormantTextRef = useRef<HTMLHeadingElement>(null);
  const aliveTextRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (isAlive) {
        // Animate dormant text out
        gsap.to(dormantTextRef.current, {
          opacity: 0,
          y: -40,
          scale: 0.9,
          duration: 0.6,
          ease: "power3.in",
        });

        // Animate alive text in
        gsap.fromTo(
          aliveTextRef.current,
          { opacity: 0, y: 40, scale: 1.1 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: 0.4,
            ease: "power3.out",
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  return (
    <section
      ref={sectionRef}
      id="gate"
      className="section relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient — dormant → alive transition */}
      <div
        className={`absolute inset-0 transition-all duration-[2000ms] ${
          isAlive
            ? "bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.08)_0%,_transparent_70%)]"
            : "bg-transparent"
        }`}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center sm:gap-12">
        {/* Dormant headline */}
        <h1
          ref={dormantTextRef}
          className={`text-4xl font-bold uppercase tracking-wider transition-colors duration-700 sm:text-6xl lg:text-8xl ${
            isAlive ? "pointer-events-none" : "text-text-primary"
          }`}
        >
          {COPY.heroDormant}
        </h1>

        {/* Toggle */}
        <SplineToggle />

        {/* Alive headline */}
        <h1
          ref={aliveTextRef}
          className="pointer-events-none text-4xl font-bold uppercase tracking-wider text-neon-blue opacity-0 sm:text-6xl lg:text-8xl"
          style={{
            textShadow: isAlive
              ? "0 0 30px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.3)"
              : "none",
          }}
        >
          {COPY.heroAlive}
        </h1>

        {/* Scroll hint — only after alive */}
        {isAlive && (
          <div className="absolute bottom-8 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs uppercase tracking-widest text-text-dim">
              Scroll
            </span>
            <div className="h-6 w-px bg-neon-blue opacity-50" />
          </div>
        )}
      </div>
    </section>
  );
}
