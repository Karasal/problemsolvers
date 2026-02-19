"use client";

import { useRef, useState, type FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useToggleState } from "@/hooks/useToggleState";
import { COPY } from "@/lib/constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section 5 — THE ASK (Lead Capture)
 *
 * "Got a problem? Tell us about it."
 * Premium lead capture form — earned through the scroll experience.
 * Submits to Supabase.
 */
export default function Ask() {
  const { isAlive } = useToggleState();
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      business: (formData.get("business") as string) || undefined,
      problem: formData.get("problem") as string,
    };

    try {
      // Dynamic import to avoid loading Supabase until needed
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
            className="flex flex-col items-center gap-4 rounded-xl border border-neon-green bg-surface p-10"
          >
            <div className="text-4xl">
              <span
                className="inline-block text-neon-green"
                style={{
                  textShadow: "0 0 20px var(--neon-green)",
                }}
              >
                &#10003;
              </span>
            </div>
            <h3 className="text-xl font-semibold text-text-primary">
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

            <button
              data-form-element
              type="submit"
              disabled={formState === "submitting"}
              className="mt-2 w-full rounded-lg bg-neon-blue px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#07070d] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] disabled:opacity-50"
            >
              {formState === "submitting" ? "Sending..." : "Send It"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
