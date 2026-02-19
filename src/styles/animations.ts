import gsap from "gsap";

// ============================================
// GSAP Animation Presets
// Reusable configs for scroll-driven animations
// ============================================

/** Fade in from below */
export const fadeInUp = {
  from: { opacity: 0, y: 60 },
  to: { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
};

/** Fade in from above */
export const fadeInDown = {
  from: { opacity: 0, y: -60 },
  to: { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
};

/** Scale up from nothing */
export const scaleIn = {
  from: { opacity: 0, scale: 0.8 },
  to: { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
};

/** Slide in from left */
export const slideInLeft = {
  from: { opacity: 0, x: -100 },
  to: { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
};

/** Slide in from right */
export const slideInRight = {
  from: { opacity: 0, x: 100 },
  to: { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
};

/** Neon text reveal — chars appear with glow */
export const neonReveal = {
  from: { opacity: 0, textShadow: "0 0 0px transparent" },
  to: {
    opacity: 1,
    textShadow: "0 0 20px var(--neon-blue), 0 0 40px var(--neon-blue)",
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.03,
  },
};

/** Standard ScrollTrigger defaults for a section */
export function sectionTrigger(trigger: string | Element) {
  return {
    trigger,
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse" as const,
  };
}

/** Pin a section during its scroll range */
export function pinSection(trigger: string | Element) {
  return {
    trigger,
    start: "top top",
    end: "+=100%",
    pin: true,
    scrub: 1,
  };
}

/** Create a staggered entrance timeline for child elements */
export function staggerEntrance(
  container: string | Element,
  children: string,
  config?: gsap.TweenVars
) {
  return gsap.from(children, {
    scrollTrigger: sectionTrigger(container),
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    ...config,
  });
}
