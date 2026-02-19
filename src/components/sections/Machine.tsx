"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToggleState } from "@/hooks/useToggleState";
import { PROCESS_STEPS } from "@/lib/constants";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Phase visual config
const PHASE_CONFIG = [
  {
    color: "var(--neon-blue)",
    colorHex: "#00f0ff",
    hudSrc: "/assets/machine/hud-frame-1.webp",
    decorSrc: "/assets/machine/hud-ui-1.webp",
    label: "RESEARCH",
  },
  {
    color: "var(--neon-pink)",
    colorHex: "#ff2d7b",
    hudSrc: "/assets/machine/hud-frame-5.webp",
    decorSrc: "/assets/machine/control-grid.webp",
    label: "SIMULATE",
  },
  {
    color: "var(--neon-green)",
    colorHex: "#39ff14",
    hudSrc: "/assets/machine/hud-frame-10.webp",
    decorSrc: "/assets/machine/control-icons.webp",
    label: "SOLVE",
  },
];

// Y2K SVGs as "data particles" flowing between phases
const DATA_PARTICLES = [
  "/assets/shared/y2k-04.svg",
  "/assets/shared/y2k-28.svg",
  "/assets/shared/y2k-37.svg",
  "/assets/shared/y2k-44.svg",
  "/assets/shared/y2k-53.svg",
  "/assets/shared/y2k-67.svg",
  "/assets/shared/y2k-82.svg",
  "/assets/shared/y2k-104.svg",
];

/**
 * Section 3 — THE MACHINE (The Process)
 *
 * Pinned scrub section. Three phases: Research → Simulate → Solve.
 * HUD frame overlays, data particle flow, convergence effect.
 */
export default function Machine() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isAlive || !sectionRef.current || !pinRef.current) return;

      const phaseRefs = [phase1Ref, phase2Ref, phase3Ref];

      // Main pinned timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Phase 1: Research — elements fly in from edges
      tl.fromTo(
        phase1Ref.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
        0
      );

      // Data particles scatter from center during research
      const particles = particlesRef.current?.children;
      if (particles) {
        tl.fromTo(
          particles,
          { opacity: 0, scale: 0, x: 0, y: 0 },
          {
            opacity: 0.6,
            scale: 1,
            x: () => gsap.utils.random(-200, 200),
            y: () => gsap.utils.random(-150, 150),
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.3
        );
      }

      // Transition: Phase 1 out, Phase 2 in
      tl.to(
        phase1Ref.current,
        { opacity: 0, x: -100, duration: 0.5, ease: "power2.in" },
        1
      );
      tl.fromTo(
        phase2Ref.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        1.2
      );

      // Phase 2: Simulate — rapid card spawning effect via scale pulses
      tl.to(
        phase2Ref.current?.querySelector("[data-sim-grid]") || {},
        {
          scale: 1.02,
          duration: 0.3,
          repeat: 3,
          yoyo: true,
          ease: "power1.inOut",
        },
        1.5
      );

      // Particles converge during simulate
      if (particles) {
        tl.to(
          particles,
          {
            x: () => gsap.utils.random(-50, 50),
            y: () => gsap.utils.random(-50, 50),
            duration: 1,
            stagger: 0.05,
            ease: "power2.inOut",
          },
          1.5
        );
      }

      // Transition: Phase 2 out, Phase 3 in
      tl.to(
        phase2Ref.current,
        { opacity: 0, scale: 0.9, duration: 0.5, ease: "power2.in" },
        2.2
      );
      tl.fromTo(
        phase3Ref.current,
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" },
        2.4
      );

      // Particles fully converge to center for solve
      if (particles) {
        tl.to(
          particles,
          {
            x: 0,
            y: 0,
            scale: 0.3,
            opacity: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: "power3.in",
          },
          2.4
        );
      }

      // Phase 3: Solve — neon green glow pulse
      tl.to(
        phase3Ref.current?.querySelector("[data-solve-glow]") || {},
        {
          boxShadow: "0 0 60px rgba(57,255,20,0.5), inset 0 0 30px rgba(57,255,20,0.1)",
          duration: 0.5,
          repeat: 1,
          yoyo: true,
        },
        2.8
      );

      // Progress bar
      tl.fromTo(
        "[data-progress]",
        { scaleX: 0 },
        { scaleX: 1, duration: 3, ease: "none" },
        0
      );
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  return (
    <section
      ref={sectionRef}
      id="machine"
      className="relative"
      style={{ minHeight: "400vh" }}
    >
      <div
        ref={pinRef}
        className="relative flex h-screen flex-col items-center justify-center overflow-hidden"
      >
        {/* Section header — always visible */}
        <div className="absolute top-8 left-0 right-0 z-20 text-center">
          <p className="mb-1 text-xs uppercase tracking-[0.3em] text-neon-amber">
            The Process
          </p>
          <h2 className="text-3xl font-bold text-text-primary sm:text-5xl">
            The Machine
          </h2>
        </div>

        {/* Progress bar */}
        <div className="absolute top-24 left-1/2 z-20 h-0.5 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-border-custom sm:w-64">
          <div
            data-progress
            className="h-full origin-left bg-gradient-to-r from-neon-blue via-neon-pink to-neon-green"
          />
        </div>

        {/* Data particles (absolute, float around) */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-10">
          {DATA_PARTICLES.map((src, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: 24, height: 24 }}
            >
              <Image
                src={src}
                alt=""
                width={24}
                height={24}
                className="object-contain invert opacity-50"
              />
            </div>
          ))}
        </div>

        {/* Phase 1: Research */}
        <div
          ref={phase1Ref}
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6">
            {/* HUD Frame overlay */}
            <div className="absolute -inset-8 pointer-events-none opacity-30">
              <Image
                src="/assets/machine/hud-frame-1.webp"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <span
              className="text-xs font-bold uppercase tracking-[0.4em]"
              style={{ color: PHASE_CONFIG[0].colorHex }}
            >
              Phase 1 &mdash; Research
            </span>
            <h3 className="text-2xl font-bold text-text-primary sm:text-4xl">
              {PROCESS_STEPS[0].title}
            </h3>
            <p className="max-w-md text-center text-text-dim">
              {PROCESS_STEPS[0].description}
            </p>
            <div className="relative mt-4 h-40 w-full max-w-md overflow-hidden rounded-lg border border-neon-blue/20 bg-surface/50">
              <Image
                src="/assets/machine/hud-ui-1.webp"
                alt=""
                fill
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 w-2 rounded-full bg-neon-blue/40"
                      style={{
                        animation: `dataBar 1.5s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2: Simulate */}
        <div
          ref={phase2Ref}
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6">
            <div className="absolute -inset-8 pointer-events-none opacity-30">
              <Image
                src="/assets/machine/hud-frame-5.webp"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <span
              className="text-xs font-bold uppercase tracking-[0.4em]"
              style={{ color: PHASE_CONFIG[1].colorHex }}
            >
              Phase 2 &mdash; Simulate
            </span>
            <h3 className="text-2xl font-bold text-text-primary sm:text-4xl">
              {PROCESS_STEPS[1].title}
            </h3>
            <p className="max-w-md text-center text-text-dim">
              {PROCESS_STEPS[1].description}
            </p>
            <div
              data-sim-grid
              className="mt-4 grid w-full max-w-md grid-cols-4 gap-2"
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-lg border bg-surface/50"
                  style={{
                    borderColor: i % 3 === 0 ? "#39ff1440" : i % 3 === 1 ? "#ff2d7b40" : "#1a1a2e",
                    animation: `simPulse 2s ease-in-out ${i * 0.25}s infinite`,
                  }}
                >
                  <Image
                    src="/assets/machine/control-grid.webp"
                    alt=""
                    width={80}
                    height={64}
                    className="h-full w-full rounded-lg object-cover opacity-20"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phase 3: Solve */}
        <div
          ref={phase3Ref}
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6">
            <div className="absolute -inset-8 pointer-events-none opacity-30">
              <Image
                src="/assets/machine/hud-frame-10.webp"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <span
              className="text-xs font-bold uppercase tracking-[0.4em]"
              style={{ color: PHASE_CONFIG[2].colorHex }}
            >
              Phase 3 &mdash; Solve
            </span>
            <h3 className="text-2xl font-bold text-text-primary sm:text-4xl">
              {PROCESS_STEPS[2].title}
            </h3>
            <p className="max-w-md text-center text-text-dim">
              {PROCESS_STEPS[2].description}
            </p>
            <div
              data-solve-glow
              className="mt-4 flex h-40 w-full max-w-md items-center justify-center rounded-lg border border-neon-green/30 bg-surface/50"
            >
              <div className="flex flex-col items-center gap-3">
                <Image
                  src="/assets/machine/control-icons.webp"
                  alt=""
                  width={120}
                  height={80}
                  className="object-contain opacity-50"
                />
                <span
                  className="text-lg font-bold uppercase tracking-widest"
                  style={{
                    color: "#39ff14",
                    textShadow: "0 0 20px rgba(57,255,20,0.5)",
                  }}
                >
                  SOLVED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations for phase visuals */}
      <style jsx>{`
        @keyframes dataBar {
          0%, 100% { transform: scaleY(0.3); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes simPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
}
