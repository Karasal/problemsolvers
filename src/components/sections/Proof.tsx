"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToggleState } from "@/hooks/useToggleState";
import { CAPABILITIES } from "@/lib/constants";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CapabilityDetail {
  icon: string;
  color: string;
  colorHex: string;
  desc: string;
  imageSrc: string;
}

const capabilityDetails: Record<string, CapabilityDetail> = {
  "Business Automation": {
    icon: "//",
    color: "var(--neon-blue)",
    colorHex: "#00f0ff",
    desc: "Streamline operations with intelligent automation that works 24/7.",
    imageSrc: "/assets/proof/holo-shape-2.webp",
  },
  "Lead Generation": {
    icon: ">>",
    color: "var(--neon-green)",
    colorHex: "#39ff14",
    desc: "Fill your pipeline with qualified leads using data-driven strategies.",
    imageSrc: "/assets/proof/holo-shape-8.webp",
  },
  "Web Development": {
    icon: "</>",
    color: "var(--neon-pink)",
    colorHex: "#ff2d7b",
    desc: "Beautiful, fast, conversion-optimized websites that work as hard as you do.",
    imageSrc: "/assets/proof/holo-shape-15.webp",
  },
  "AI Integration": {
    icon: "{}",
    color: "var(--neon-purple)",
    colorHex: "#bf5af2",
    desc: "Harness artificial intelligence to give your business an unfair advantage.",
    imageSrc: "/assets/proof/ai-toolkit.webp",
  },
};

// Counter stats
const STATS = [
  { label: "Processes Automated", target: 127, suffix: "+" },
  { label: "Leads Generated", target: 3400, suffix: "+" },
  { label: "Hours Saved Monthly", target: 850, suffix: "" },
  { label: "Happy Clients", target: 42, suffix: "+" },
];

function AnimatedCounter({ target, suffix, triggered }: { target: number; suffix: string; triggered: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;

    let frame: number;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [triggered, target]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/**
 * Section 4 — THE PROOF (Capabilities)
 *
 * 2x2 capability cards with real holographic imagery.
 * Animated results counter below.
 */
export default function Proof() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [counterTriggered, setCounterTriggered] = useState(false);

  useGSAP(
    () => {
      if (!isAlive || !sectionRef.current) return;

      // Card entrance stagger
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

      // Counter trigger
      if (counterRef.current) {
        ScrollTrigger.create({
          trigger: counterRef.current,
          start: "top 80%",
          onEnter: () => setCounterTriggered(true),
        });
      }

      // Counter items entrance
      gsap.from("[data-stat]", {
        scrollTrigger: {
          trigger: counterRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

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
                className="group relative overflow-hidden rounded-xl border border-border-custom bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-opacity-60 sm:p-8"
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
                    background: `radial-gradient(circle at center, ${detail.colorHex}10 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Holographic hero image */}
                  <div className="relative mx-auto h-28 w-28 transition-transform duration-500 group-hover:scale-110 sm:h-32 sm:w-32">
                    <Image
                      src={detail.imageSrc}
                      alt={cap}
                      fill
                      className="object-contain drop-shadow-lg transition-transform duration-700 group-hover:rotate-6"
                      style={{
                        filter: `drop-shadow(0 0 15px ${detail.colorHex}40)`,
                      }}
                    />
                  </div>

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
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: detail.color }}
                />
              </div>
            );
          })}
        </div>

        {/* Results counter */}
        <div
          ref={counterRef}
          className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              data-stat
              className="flex flex-col items-center gap-2 rounded-lg border border-border-custom bg-surface/50 p-4 text-center sm:p-6"
            >
              <span className="text-2xl font-bold text-neon-blue sm:text-3xl">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  triggered={counterTriggered}
                />
              </span>
              <span className="text-xs uppercase tracking-wider text-text-dim">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
