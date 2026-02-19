"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToggleState } from "@/hooks/useToggleState";
import { CAPABILITIES } from "@/lib/constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section 4 — THE PROOF (Capabilities)
 *
 * What we actually do: automation, lead gen, web dev, AI integration.
 * Interactive demos, before/after visuals, capability showcases.
 */
export default function Proof() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!isAlive || !sectionRef.current) return;

      gsap.from("[data-capability]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  const capabilityDetails: Record<
    string,
    { icon: string; color: string; desc: string }
  > = {
    "Business Automation": {
      icon: "//",
      color: "var(--neon-blue)",
      desc: "Streamline operations with intelligent automation that works 24/7.",
    },
    "Lead Generation": {
      icon: ">>",
      color: "var(--neon-green)",
      desc: "Fill your pipeline with qualified leads using data-driven strategies.",
    },
    "Web Development": {
      icon: "</>",
      color: "var(--neon-pink)",
      desc: "Beautiful, fast, conversion-optimized websites that work as hard as you do.",
    },
    "AI Integration": {
      icon: "{}",
      color: "var(--neon-purple)",
      desc: "Harness artificial intelligence to give your business an unfair advantage.",
    },
  };

  return (
    <section
      ref={sectionRef}
      id="proof"
      className="section relative overflow-hidden py-20"
    >
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-16 px-6">
        {/* Section header */}
        <div className="text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neon-pink">
            What We Do
          </p>
          <h2 className="text-3xl font-bold text-text-primary sm:text-5xl">
            The Proof
          </h2>
        </div>

        {/* Capability cards */}
        <div className="grid w-full gap-6 sm:grid-cols-2">
          {CAPABILITIES.map((cap) => {
            const detail = capabilityDetails[cap];
            return (
              <div
                key={cap}
                data-capability
                className="group relative overflow-hidden rounded-xl border border-border-custom bg-surface p-8 transition-all duration-500 hover:border-opacity-60"
                style={
                  {
                    "--cap-color": detail.color,
                  } as React.CSSProperties
                }
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at center, ${detail.color}08 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Icon */}
                  <span
                    className="font-mono text-2xl font-bold"
                    style={{ color: detail.color }}
                  >
                    {detail.icon}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-text-primary">
                    {cap}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-text-dim">
                    {detail.desc}
                  </p>

                  {/* Placeholder for demo/showcase */}
                  <div
                    className="mt-4 h-24 rounded-lg border bg-bg"
                    style={{ borderColor: detail.color + "22" }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xs uppercase tracking-widest text-text-dim">
                        demo / showcase
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
