"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useToggleState } from "@/hooks/useToggleState";
import { COPY } from "@/lib/constants";
import HeroToggle from "@/components/HeroToggle";
import Image from "next/image";

/**
 * Section 0 — THE GATE (Hero, above fold)
 *
 * Dormant state: Dark & moody. "GOT A PROBLEM?" visible + toggle.
 * After toggle: Character-staggered text reveal, neon energy floods in.
 * Scroll is locked until toggle is activated.
 */
export default function Gate() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);
  const dormantCharsRef = useRef<HTMLSpanElement[]>([]);
  const aliveCharsRef = useRef<HTMLSpanElement[]>([]);
  const [showNoise, setShowNoise] = useState(false);

  // Show noise texture after activation
  useEffect(() => {
    if (isAlive) {
      const timer = setTimeout(() => setShowNoise(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isAlive]);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (isAlive) {
        // Stagger dormant chars out
        gsap.to(dormantCharsRef.current, {
          opacity: 0,
          y: -30,
          rotateX: 90,
          scale: 0.8,
          duration: 0.4,
          stagger: 0.02,
          ease: "power3.in",
        });

        // Stagger alive chars in — slam from below with neon glow
        gsap.fromTo(
          aliveCharsRef.current,
          {
            opacity: 0,
            y: 80,
            rotateX: -90,
            scale: 1.3,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.03,
            delay: 0.5,
            ease: "back.out(1.4)",
          }
        );

        // Scroll hint fade in
        gsap.fromTo(
          "[data-scroll-hint]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: "power2.out" }
        );
      }
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  // Split text into individual char spans
  const renderChars = (
    text: string,
    refsArray: React.MutableRefObject<HTMLSpanElement[]>,
    className: string
  ) => {
    refsArray.current = [];
    return text.split("").map((char, i) => (
      <span
        key={i}
        ref={(el) => {
          if (el) refsArray.current[i] = el;
        }}
        className={`inline-block ${char === " " ? "w-[0.3em]" : ""} ${className}`}
        style={{ perspective: "600px" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      id="gate"
      className="section relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background layer 1: Base dark */}
      <div className="absolute inset-0 bg-[#07070d]" />

      {/* Background layer 2: Dormant subtle radial gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(30,30,53,0.3) 0%, transparent 70%)",
          opacity: isAlive ? 0 : 1,
        }}
      />

      {/* Background layer 3: Alive neon gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms]"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(0,240,255,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(255,45,123,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(57,255,20,0.05) 0%, transparent 60%)
          `,
          opacity: isAlive ? 1 : 0,
        }}
      />

      {/* Background layer 4: Holographic noise overlay */}
      {showNoise && (
        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen">
          <Image
            src="/assets/gate/holographic-bg.webp"
            alt=""
            fill
            className="object-cover"
            priority={false}
          />
        </div>
      )}

      {/* Floating neon shapes (background decoration, alive only) */}
      {isAlive && (
        <>
          <div
            className="absolute -top-20 -left-20 h-64 w-64 opacity-20 blur-sm transition-opacity duration-[3000ms]"
            style={{
              backgroundImage: "url(/assets/gate/neon-shape-1.webp)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              animation: "float1 8s ease-in-out infinite",
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 h-72 w-72 opacity-15 blur-sm transition-opacity duration-[3000ms]"
            style={{
              backgroundImage: "url(/assets/gate/neon-shape-2.webp)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              animation: "float2 10s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center sm:gap-12">
        {/* Dormant headline — char by char */}
        <h1
          className={`text-4xl font-bold uppercase tracking-wider sm:text-6xl lg:text-8xl ${
            isAlive ? "pointer-events-none" : ""
          }`}
          style={{ perspective: "800px" }}
        >
          {renderChars(COPY.heroDormant, dormantCharsRef, "text-text-primary")}
        </h1>

        {/* Toggle */}
        <HeroToggle />

        {/* Alive headline — char by char with neon glow */}
        <h1
          className="pointer-events-none text-4xl font-bold uppercase tracking-wider text-neon-blue sm:text-6xl lg:text-8xl"
          style={{ perspective: "800px" }}
        >
          {renderChars(COPY.heroAlive, aliveCharsRef, "opacity-0")}
        </h1>

        {/* Scroll hint — only after alive */}
        {isAlive && (
          <div
            data-scroll-hint
            className="absolute bottom-8 flex flex-col items-center gap-2 opacity-0"
          >
            <span className="text-xs uppercase tracking-widest text-text-dim">
              Scroll
            </span>
            <div className="h-8 w-px animate-pulse bg-neon-blue opacity-50" />
          </div>
        )}
      </div>

      {/* CSS keyframes for floating shapes */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-3deg); }
        }
      `}</style>
    </section>
  );
}
