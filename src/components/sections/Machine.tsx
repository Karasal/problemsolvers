"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToggleState } from "@/hooks/useToggleState";
import { PROCESS_STEPS } from "@/lib/constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section 3 — THE MACHINE (The Process)
 *
 * Three scroll-driven phases: Research → Simulate → Solve
 * Each phase has interactive moments and visual storytelling.
 */
export default function Machine() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!isAlive || !sectionRef.current) return;

      // Stagger each phase card entrance
      gsap.from("[data-phase]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        x: -60,
        duration: 0.8,
        stagger: 0.3,
        ease: "power3.out",
      });

      // Animate the connecting line
      gsap.fromTo(
        "[data-connector]",
        { scaleY: 0 },
        {
          scaleY: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 40%",
            end: "bottom 60%",
            scrub: 1,
          },
          ease: "none",
        }
      );
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  const phaseColors = ["neon-blue", "neon-pink", "neon-green"] as const;
  const phaseColorVars = [
    "var(--neon-blue)",
    "var(--neon-pink)",
    "var(--neon-green)",
  ];

  return (
    <section
      ref={sectionRef}
      id="machine"
      className="section relative overflow-hidden py-20"
    >
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-16 px-6">
        {/* Section header */}
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neon-amber">
            The Process
          </p>
          <h2 className="text-3xl font-bold text-text-primary sm:text-5xl">
            The Machine
          </h2>
        </div>

        {/* Process phases */}
        <div className="relative flex w-full flex-col gap-12">
          {/* Vertical connector line */}
          <div
            data-connector
            className="absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-[var(--neon-blue)] via-[var(--neon-pink)] to-[var(--neon-green)] sm:left-8"
          />

          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.id}
              data-phase={step.id}
              className="relative flex gap-6 pl-14 sm:pl-20"
            >
              {/* Phase dot */}
              <div
                className="absolute left-4 top-1 h-4 w-4 rounded-full sm:left-6"
                style={{
                  background: phaseColorVars[i],
                  boxShadow: `0 0 15px ${phaseColorVars[i]}`,
                }}
              />

              {/* Phase content */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: phaseColorVars[i] }}
                  >
                    Phase {i + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary sm:text-3xl">
                  {step.title}
                </h3>
                <p className="max-w-md text-text-dim">{step.description}</p>

                {/* Placeholder for interactive visualization */}
                <div
                  className="mt-4 h-32 rounded-lg border bg-surface sm:h-48"
                  style={{ borderColor: phaseColorVars[i] + "33" }}
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="text-xs uppercase tracking-widest text-text-dim">
                      {step.id} visualization
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
