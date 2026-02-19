"use client";

import { useRef, useState, useEffect, useCallback, type FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { useToggleState } from "@/hooks/useToggleState";
import { COPY } from "@/lib/constants";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Confetti particle for success
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

function generateConfetti(): ConfettiParticle[] {
  const colors = ["#00f0ff", "#ff2d7b", "#39ff14", "#bf5af2", "#ffb800"];
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 400 - 200,
    y: -(Math.random() * 300 + 100),
    color: colors[i % colors.length],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
  }));
}

/**
 * Section 5 — THE ASK (Lead Capture)
 *
 * Premium lead form with holographic background, glitch overlay,
 * neon submit button, confetti success state, SFX triggers.
 */
export default function Ask() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const soundPlayedRef = useRef(false);

  // Import and play sound dynamically
  const playSound = useCallback(async (soundId: string) => {
    try {
      const { Howl } = await import("howler");
      const sounds: Record<string, { src: string; volume: number }> = {
        submit: { src: "/audio/button-push.mp3", volume: 0.4 },
        success: { src: "/audio/bell.mp3", volume: 0.5 },
      };
      const config = sounds[soundId];
      if (config) {
        const sound = new Howl({ src: [config.src], volume: config.volume });
        sound.play();
      }
    } catch {
      // Sound is optional, don't block on failure
    }
  }, []);

  useGSAP(
    () => {
      if (!isAlive || !sectionRef.current) return;

      gsap.from("[data-form-element]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: sectionRef, dependencies: [isAlive] }
  );

  // Success confetti
  useEffect(() => {
    if (formState === "success" && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      setConfetti(generateConfetti());
      playSound("success");
      const timer = setTimeout(() => setConfetti([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [formState, playSound]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    playSound("submit");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      business: (formData.get("business") as string) || undefined,
      problem: formData.get("problem") as string,
    };

    try {
      const { submitLead } = await import("@/lib/supabase");
      await submitLead(data);
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  const inputClasses =
    "w-full rounded-lg border border-border-custom bg-bg px-4 py-3 text-text-primary placeholder:text-text-dim focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors";

  return (
    <section
      ref={sectionRef}
      id="ask"
      className="section relative overflow-hidden py-20"
    >
      {/* Background: Holographic texture */}
      <div className="absolute inset-0 opacity-[0.04]">
        <Image
          src="/assets/ask/holographic-bg.webp"
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Glitch overlay texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-screen">
        <Image
          src="/assets/ask/glitch-texture.webp"
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-10 px-6 text-center">
        {/* Section header */}
        <div data-form-element>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neon-green">
            Let&apos;s Talk
          </p>
          <h2 className="text-3xl font-bold text-text-primary sm:text-5xl">
            {COPY.cta}
          </h2>
        </div>

        {formState === "success" ? (
          <div
            data-form-element
            className="relative flex flex-col items-center gap-6 rounded-xl border border-neon-green bg-surface p-12"
          >
            {/* Confetti */}
            <AnimatePresence>
              {confetti.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-sm pointer-events-none"
                  style={{
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    left: "50%",
                    top: "50%",
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: 0,
                    rotate: p.rotation,
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </AnimatePresence>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl"
            >
              <span
                className="inline-block text-neon-green"
                style={{
                  textShadow: "0 0 30px var(--neon-green), 0 0 60px var(--neon-green)",
                }}
              >
                &#10003;
              </span>
            </motion.div>
            <h3 className="text-2xl font-semibold text-text-primary">
              We got it!
            </h3>
            <p className="text-text-dim">
              We&apos;ll be in touch soon. Get ready to solve some problems.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-4 text-left"
          >
            <div data-form-element className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                type="text"
                required
                placeholder="Your name"
                className={inputClasses}
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className={inputClasses}
              />
            </div>

            <div data-form-element className="grid gap-4 sm:grid-cols-2">
              <input
                name="phone"
                type="tel"
                placeholder="Phone (optional)"
                className={inputClasses}
              />
              <input
                name="business"
                type="text"
                placeholder="Business name (optional)"
                className={inputClasses}
              />
            </div>

            <textarea
              data-form-element
              name="problem"
              required
              rows={4}
              placeholder="Tell us about your problem..."
              className={inputClasses + " resize-none"}
            />

            {formState === "error" && (
              <p className="text-sm text-neon-pink">
                Something went wrong. Please try again.
              </p>
            )}

            <motion.button
              data-form-element
              type="submit"
              disabled={formState === "submitting"}
              className="mt-2 w-full rounded-lg bg-neon-blue px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#07070d] transition-all duration-300 disabled:opacity-50"
              whileHover={{
                boxShadow: "0 0 30px rgba(0,240,255,0.4), 0 0 60px rgba(0,240,255,0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  "0 0 10px rgba(0,240,255,0.2)",
                  "0 0 20px rgba(0,240,255,0.3)",
                  "0 0 10px rgba(0,240,255,0.2)",
                ],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {formState === "submitting" ? "Sending..." : "Send It"}
            </motion.button>
          </form>
        )}
      </div>
    </section>
  );
}
