"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToggleState } from "@/hooks/useToggleState";
import { COPY } from "@/lib/constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section 2 — THE PITCH (Meet Sal)
 *
 * Warm, personal, confident. The human face of the operation.
 * Delivers the value prop + "army of 100 bots" tagline.
 */
export default function Pitch() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!isAlive || !sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from("[data-animate='greeting']", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          "[data-animate='tagline']",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          "[data-animate='ticker']",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        );
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  return (
    <section
      ref={sectionRef}
      id="pitch"
      className="section relative overflow-hidden"
    >
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 text-center sm:gap-14">
        {/* Greeting */}
        <h2
          data-animate="greeting"
          className="text-3xl font-semibold leading-tight text-text-primary sm:text-5xl"
        >
          {COPY.meetSal}
        </h2>

        {/* Tagline */}
        <p
          data-animate="tagline"
          className="max-w-2xl text-lg leading-relaxed text-text-dim sm:text-xl"
        >
          {COPY.tagline}
        </p>

        {/* Problem ticker placeholder — will be an animated scrolling list */}
        <div
          data-animate="ticker"
          className="w-full overflow-hidden rounded-lg border border-border-custom bg-surface p-6"
        >
          <p className="mb-3 text-xs uppercase tracking-widest text-neon-blue">
            Currently solving
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "lead generation",
              "workflow automation",
              "website builds",
              "AI integration",
              "data pipelines",
              "CRM setup",
              "ad optimization",
              "email campaigns",
              "chatbot deployment",
              "analytics dashboards",
            ].map((problem) => (
              <span
                key={problem}
                className="rounded-full border border-border-custom bg-bg px-3 py-1 text-sm text-text-dim"
              >
                {problem}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
