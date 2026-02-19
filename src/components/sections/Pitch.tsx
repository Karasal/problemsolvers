"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToggleState } from "@/hooks/useToggleState";
import { COPY } from "@/lib/constants";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Bot army grid — mix of Y2K cyberpunk PNGs and SVGs
const BOT_ARMY = [
  { src: "/assets/pitch/cyberpunk-01.webp", type: "webp" as const },
  { src: "/assets/shared/y2k-05.svg", type: "svg" as const },
  { src: "/assets/pitch/y2k-01.webp", type: "webp" as const },
  { src: "/assets/shared/y2k-19.svg", type: "svg" as const },
  { src: "/assets/pitch/cyberpunk-03.webp", type: "webp" as const },
  { src: "/assets/shared/y2k-33.svg", type: "svg" as const },
  { src: "/assets/pitch/y2k-05.webp", type: "webp" as const },
  { src: "/assets/pitch/cyberpunk-05.webp", type: "webp" as const },
  { src: "/assets/shared/y2k-45.svg", type: "svg" as const },
  { src: "/assets/pitch/y2k-10.webp", type: "webp" as const },
  { src: "/assets/pitch/cyberpunk-07.webp", type: "webp" as const },
  { src: "/assets/shared/y2k-51.svg", type: "svg" as const },
  { src: "/assets/pitch/cyberpunk-10.webp", type: "webp" as const },
  { src: "/assets/shared/y2k-72.svg", type: "svg" as const },
  { src: "/assets/pitch/y2k-15.webp", type: "webp" as const },
  { src: "/assets/pitch/cyberpunk-12.webp", type: "webp" as const },
  { src: "/assets/shared/y2k-85.svg", type: "svg" as const },
  { src: "/assets/pitch/y2k-20.webp", type: "webp" as const },
  { src: "/assets/pitch/cyberpunk-15.webp", type: "webp" as const },
  { src: "/assets/shared/y2k-97.svg", type: "svg" as const },
  { src: "/assets/pitch/y2k-25.webp", type: "webp" as const },
  { src: "/assets/pitch/cyberpunk-22.webp", type: "webp" as const },
  { src: "/assets/shared/y2k-110.svg", type: "svg" as const },
  { src: "/assets/pitch/y2k-30.webp", type: "webp" as const },
];

// Problem marquee items
const PROBLEMS = [
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
  "social media management",
  "inventory tracking",
  "customer support bots",
  "appointment scheduling",
];

/**
 * Section 2 — THE PITCH (Meet Sal)
 *
 * Big greeting, word-by-word tagline reveal, bot army grid, marquee ticker.
 */
export default function Pitch() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const armyRef = useRef<HTMLDivElement>(null);

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

      // Greeting entrance
      tl.from("[data-animate='greeting']", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      });

      // Tagline word-by-word reveal
      if (taglineRef.current) {
        const words = taglineRef.current.querySelectorAll("[data-word]");
        tl.from(
          words,
          {
            opacity: 0,
            y: 20,
            filter: "blur(4px)",
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }

      // AI chip featured entrance
      tl.from(
        "[data-animate='ai-chip']",
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );

      // Bot army grid stagger
      if (armyRef.current) {
        const bots = armyRef.current.querySelectorAll("[data-bot]");
        tl.from(
          bots,
          {
            opacity: 0,
            scale: 0.5,
            rotation: () => gsap.utils.random(-20, 20),
            duration: 0.4,
            stagger: {
              each: 0.04,
              from: "random",
            },
            ease: "back.out(1.4)",
          },
          "-=0.3"
        );
      }

      // Marquee entrance
      tl.from(
        "[data-animate='ticker']",
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Bot army micro-animations (continuous, after entrance)
      if (armyRef.current) {
        const bots = armyRef.current.querySelectorAll("[data-bot]");
        bots.forEach((bot, i) => {
          gsap.to(bot, {
            rotation: gsap.utils.random(-5, 5),
            scale: gsap.utils.random(0.95, 1.05),
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.1,
          });
        });
      }
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  // Split tagline into word spans
  const taglineWords = COPY.tagline.split(" ");

  return (
    <section
      ref={sectionRef}
      id="pitch"
      className="section relative overflow-hidden py-20"
    >
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 text-center sm:gap-16">
        {/* Greeting */}
        <h2
          data-animate="greeting"
          className="text-3xl font-semibold leading-tight text-text-primary sm:text-5xl lg:text-6xl"
        >
          {COPY.meetSal}
        </h2>

        {/* Tagline — word by word */}
        <p
          ref={taglineRef}
          className="max-w-3xl text-lg leading-relaxed text-text-dim sm:text-xl lg:text-2xl"
        >
          {taglineWords.map((word, i) => (
            <span key={i} data-word className="inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </p>

        {/* AI Chip featured */}
        <div data-animate="ai-chip" className="relative">
          <div className="relative h-32 w-32 sm:h-40 sm:w-40">
            <Image
              src="/assets/pitch/ai-chip.webp"
              alt="AI Chip"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            />
          </div>
        </div>

        {/* Bot Army Grid */}
        <div
          ref={armyRef}
          className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-12"
        >
          {BOT_ARMY.map((bot, i) => (
            <div
              key={i}
              data-bot
              className="relative flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12"
            >
              <Image
                src={bot.src}
                alt=""
                width={40}
                height={40}
                className={`object-contain ${
                  bot.type === "svg" ? "invert opacity-50" : "opacity-70"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Problem Marquee Ticker */}
        <div
          data-animate="ticker"
          className="w-full overflow-hidden rounded-lg border border-border-custom bg-surface/50 backdrop-blur-sm"
        >
          <p className="py-2 text-center text-xs uppercase tracking-widest text-neon-blue">
            Currently solving
          </p>
          <div className="relative overflow-hidden py-3">
            <div className="animate-marquee flex whitespace-nowrap">
              {/* Double the items for seamless loop */}
              {[...PROBLEMS, ...PROBLEMS].map((problem, i) => (
                <span
                  key={i}
                  className="mx-2 inline-block rounded-full border border-neon-blue/20 bg-[#07070d] px-4 py-1.5 text-sm text-neon-blue"
                >
                  {problem}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
