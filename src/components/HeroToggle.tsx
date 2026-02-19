"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToggleState } from "@/hooks/useToggleState";

// Particle config
const PARTICLE_COUNT = 24;
const RING_CRACK_COUNT = 8;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * HeroToggle — SVG face morph toggle with neon energy burst.
 *
 * Dormant: Sad face (dot eyes + frown arc), dim, subtle breathing pulse
 * Click: Morphs sad → happy, particle burst + energy cracks
 * Alive: Neon glow face, pulsing ring
 */
export default function HeroToggle() {
  const { isAlive, activate } = useToggleState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      angle: (360 / PARTICLE_COUNT) * i + randomBetween(-15, 15),
      distance: randomBetween(120, 220),
      size: randomBetween(3, 8),
      delay: randomBetween(0, 0.15),
      color: ["#00f0ff", "#ff2d7b", "#39ff14", "#bf5af2", "#ffb800"][i % 5],
    }))
  );
  const [cracks] = useState(() =>
    Array.from({ length: RING_CRACK_COUNT }, (_, i) => ({
      id: i,
      angle: (360 / RING_CRACK_COUNT) * i + randomBetween(-10, 10),
      length: randomBetween(40, 80),
      delay: randomBetween(0, 0.1),
    }))
  );

  const handleToggle = useCallback(() => {
    if (!isAlive) {
      setShowParticles(true);
      activate();
    }
  }, [isAlive, activate]);

  // Clean up particles after animation
  useEffect(() => {
    if (showParticles) {
      const timer = setTimeout(() => setShowParticles(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showParticles]);

  // SVG face paths
  const sadMouth = "M 35 72 Q 50 62 65 72"; // frown
  const happyMouth = "M 35 68 Q 50 82 65 68"; // smile

  return (
    <div ref={containerRef} className="relative flex items-center justify-center">
      {/* Energy cracks radiating outward on activation */}
      <AnimatePresence>
        {showParticles && cracks.map((crack) => {
          const rad = (crack.angle * Math.PI) / 180;
          const startX = Math.cos(rad) * 72;
          const startY = Math.sin(rad) * 72;
          const endX = Math.cos(rad) * (72 + crack.length);
          const endY = Math.sin(rad) * (72 + crack.length);
          return (
            <motion.div
              key={`crack-${crack.id}`}
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: crack.delay }}
            >
              <svg
                width="300"
                height="300"
                viewBox="-150 -150 300 300"
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <motion.line
                  x1={startX}
                  y1={startY}
                  x2={startX}
                  y2={startY}
                  stroke="#00f0ff"
                  strokeWidth="2"
                  filter="url(#crackGlow)"
                  animate={{ x2: endX, y2: endY }}
                  transition={{ duration: 0.3, delay: crack.delay, ease: "easeOut" }}
                />
                <defs>
                  <filter id="crackGlow">
                    <feGaussianBlur stdDeviation="3" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Particle burst */}
      <AnimatePresence>
        {showParticles && particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.distance;
          const ty = Math.sin(rad) * p.distance;
          return (
            <motion.div
              key={`particle-${p.id}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                left: "50%",
                top: "50%",
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: tx,
                y: ty,
                opacity: 0,
                scale: 0.2,
              }}
              transition={{
                duration: 0.8 + p.delay,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Main toggle button */}
      <button
        onClick={handleToggle}
        disabled={isAlive}
        className="group relative focus:outline-none"
        aria-label={isAlive ? "Site is active" : "Activate site"}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid",
            borderColor: isAlive ? "#00f0ff" : "#2a2a3e",
          }}
          animate={
            isAlive
              ? {
                  boxShadow: [
                    "0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(0,240,255,0.15), inset 0 0 20px rgba(0,240,255,0.1)",
                    "0 0 30px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.25), inset 0 0 30px rgba(0,240,255,0.15)",
                    "0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(0,240,255,0.15), inset 0 0 20px rgba(0,240,255,0.1)",
                  ],
                  borderColor: "#00f0ff",
                }
              : {
                  boxShadow: "0 0 0px transparent",
                  borderColor: "#2a2a3e",
                }
          }
          transition={
            isAlive
              ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.7 }
          }
          whileHover={!isAlive ? { borderColor: "#4a4a6a", boxShadow: "0 0 15px rgba(74,74,106,0.3)" } : undefined}
        />

        {/* Breathing pulse (dormant only) */}
        {!isAlive && (
          <motion.div
            className="absolute inset-0 rounded-full border border-[#2a2a3e]"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* SVG Face */}
        <svg
          viewBox="0 0 100 100"
          className="h-32 w-32 sm:h-40 sm:w-40"
          fill="none"
        >
          {/* Left eye */}
          <motion.circle
            cx="38"
            cy="42"
            r="4"
            animate={{
              fill: isAlive ? "#00f0ff" : "#2a2a3e",
              r: isAlive ? 5 : 4,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={isAlive ? { filter: "drop-shadow(0 0 6px #00f0ff)" } : {}}
          />
          {/* Right eye */}
          <motion.circle
            cx="62"
            cy="42"
            r="4"
            animate={{
              fill: isAlive ? "#00f0ff" : "#2a2a3e",
              r: isAlive ? 5 : 4,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={isAlive ? { filter: "drop-shadow(0 0 6px #00f0ff)" } : {}}
          />
          {/* Eye shine (alive only) */}
          {isAlive && (
            <>
              <motion.circle
                cx="36"
                cy="40"
                r="1.5"
                fill="#fff"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.3 }}
              />
              <motion.circle
                cx="60"
                cy="40"
                r="1.5"
                fill="#fff"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.3 }}
              />
            </>
          )}
          {/* Mouth morph */}
          <motion.path
            d={isAlive ? happyMouth : sadMouth}
            stroke={isAlive ? "#39ff14" : "#2a2a3e"}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: isAlive ? happyMouth : sadMouth,
              stroke: isAlive ? "#39ff14" : "#2a2a3e",
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={isAlive ? { filter: "drop-shadow(0 0 8px #39ff14)" } : {}}
          />
        </svg>

        {/* Click prompt (dormant only) */}
        {!isAlive && (
          <motion.span
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-widest text-[#2a2a3e]"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            click me
          </motion.span>
        )}
      </button>
    </div>
  );
}
