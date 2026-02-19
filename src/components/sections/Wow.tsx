"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useToggleState } from "@/hooks/useToggleState";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Y2K SVGs for foreground drift
const FOREGROUND_SVGS = [
  { src: "/assets/shared/y2k-15.svg", x: "10%", y: "20%", size: 60, speed: 0.8 },
  { src: "/assets/shared/y2k-33.svg", x: "80%", y: "15%", size: 50, speed: 1.2 },
  { src: "/assets/shared/y2k-51.svg", x: "20%", y: "70%", size: 70, speed: 0.6 },
  { src: "/assets/shared/y2k-72.svg", x: "75%", y: "65%", size: 55, speed: 1.0 },
  { src: "/assets/shared/y2k-97.svg", x: "50%", y: "85%", size: 45, speed: 0.9 },
  { src: "/assets/shared/y2k-110.svg", x: "90%", y: "45%", size: 40, speed: 1.3 },
];

// Neon 3D shapes for midground
const MIDGROUND_SHAPES = [
  { src: "/assets/wow/neon-shape-1.webp", x: "15%", y: "30%", size: 280, rotation: 15 },
  { src: "/assets/wow/neon-shape-2.webp", x: "70%", y: "20%", size: 240, rotation: -10 },
  { src: "/assets/wow/holo-shape-1.webp", x: "40%", y: "60%", size: 200, rotation: 8 },
  { src: "/assets/wow/holo-shape-5.webp", x: "85%", y: "70%", size: 220, rotation: -20 },
];

/**
 * Section 1 — THE WOW
 *
 * Full-viewport visual assault. Scroll-driven parallax layers.
 * Background (rorschach) + Midground (neon shapes) + Foreground (Y2K SVGs)
 */
export default function Wow() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const midgroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isAlive || !sectionRef.current) return;

      // Midground parallax — shapes scale up + rotate on scroll
      const midShapes = midgroundRef.current?.children;
      if (midShapes) {
        Array.from(midShapes).forEach((shape, i) => {
          gsap.fromTo(
            shape,
            {
              scale: 0.6,
              rotation: MIDGROUND_SHAPES[i]?.rotation || 0,
              opacity: 0,
            },
            {
              scale: 1,
              rotation: (MIDGROUND_SHAPES[i]?.rotation || 0) + 15,
              opacity: 0.7,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
              ease: "none",
            }
          );
        });
      }

      // Foreground SVGs — faster parallax drift
      const fgElements = foregroundRef.current?.children;
      if (fgElements) {
        Array.from(fgElements).forEach((el, i) => {
          const speed = FOREGROUND_SVGS[i]?.speed || 1;
          gsap.fromTo(
            el,
            { y: 100 * speed, opacity: 0, rotation: -10 },
            {
              y: -100 * speed,
              opacity: 0.5,
              rotation: 10,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
              ease: "none",
            }
          );
        });
      }

      // Text stagger reveal
      if (textRef.current) {
        const chars = textRef.current.querySelectorAll("[data-char]");
        gsap.fromTo(
          chars,
          { opacity: 0, y: 40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.04,
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
            ease: "back.out(1.7)",
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  const titleText = "PROBLEM SOLVERS";

  return (
    <section
      ref={sectionRef}
      id="wow"
      className="section relative overflow-hidden"
      style={{ minHeight: "120vh" }}
    >
      {/* Background layer: Rorschach glitch texture */}
      <div className="absolute inset-0">
        <Image
          src="/assets/wow/rorschach-bg-2.webp"
          alt=""
          fill
          className="object-cover opacity-30 mix-blend-screen"
          priority={false}
        />
      </div>

      {/* Neon pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay">
        <Image
          src="/assets/wow/neon-pattern.webp"
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Midground: Floating neon 3D shapes */}
      <div ref={midgroundRef} className="absolute inset-0 pointer-events-none">
        {MIDGROUND_SHAPES.map((shape, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: shape.x,
              top: shape.y,
              width: shape.size,
              height: shape.size,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <Image
              src={shape.src}
              alt=""
              width={shape.size}
              height={shape.size}
              className="object-contain"
              priority={false}
            />
          </div>
        ))}
      </div>

      {/* Foreground: Drifting Y2K SVGs */}
      <div ref={foregroundRef} className="absolute inset-0 pointer-events-none">
        {FOREGROUND_SVGS.map((svg, i) => (
          <motion.div
            key={i}
            className="absolute opacity-0"
            style={{
              left: svg.x,
              top: svg.y,
              width: svg.size,
              height: svg.size,
            }}
            animate={isAlive ? {
              y: [0, -10, 0],
            } : {}}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={svg.src}
              alt=""
              width={svg.size}
              height={svg.size}
              className="object-contain invert opacity-60"
              priority={false}
            />
          </motion.div>
        ))}
      </div>

      {/* Center text: "PROBLEM SOLVERS" in huge stagger-reveal type */}
      <div className="relative z-10 flex items-center justify-center px-6">
        <div ref={textRef} className="flex flex-wrap justify-center">
          {titleText.split("").map((char, i) => (
            <span
              key={i}
              data-char
              className={`inline-block text-5xl font-bold uppercase tracking-wider text-neon-blue sm:text-7xl lg:text-9xl ${
                char === " " ? "w-[0.3em]" : ""
              }`}
              style={{
                textShadow: "0 0 30px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.2)",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#07070d] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07070d] to-transparent" />
    </section>
  );
}
