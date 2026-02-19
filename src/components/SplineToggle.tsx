"use client";

import { useRef, useCallback } from "react";
import { useToggleState } from "@/hooks/useToggleState";

/**
 * SplineToggle — Wraps the Spline 3D sad/happy face toggle.
 * When the user clicks, the face rolls from sad → happy,
 * triggering the dormant → alive site transition.
 *
 * PLACEHOLDER: Replace with actual Spline embed once .splinecode file is provided.
 * The Spline scene should fire a "mouseDown" event on the toggle object,
 * which we listen for to trigger the state change.
 */
export default function SplineToggle() {
  const { isAlive, activate } = useToggleState();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    if (!isAlive) {
      activate();
    }
  }, [isAlive, activate]);

  // When Spline asset arrives, replace this with:
  // import Spline from '@splinetool/react-spline';
  // <Spline scene="/spline/toggle.splinecode" onMouseDown={handleSplineEvent} />
  //
  // function handleSplineEvent(e: SplineEvent) {
  //   if (e.target.name === 'toggle') activate();
  // }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
    >
      {/* Placeholder toggle — will be replaced with Spline 3D scene */}
      <button
        onClick={handleToggle}
        disabled={isAlive}
        className="group relative h-32 w-32 rounded-full transition-all duration-700 focus:outline-none sm:h-40 sm:w-40"
        aria-label={isAlive ? "Site is active" : "Activate site"}
      >
        {/* Outer ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${
            isAlive
              ? "border-neon-blue shadow-[0_0_30px_rgba(0,240,255,0.4)]"
              : "border-dormant-text group-hover:border-[#4a4a6a]"
          }`}
        />

        {/* Face */}
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3">
          {/* Eyes */}
          <div className="flex gap-4">
            <div
              className={`h-3 w-3 rounded-full transition-all duration-700 ${
                isAlive ? "bg-neon-blue shadow-[0_0_10px_var(--neon-blue)]" : "bg-dormant-text"
              }`}
            />
            <div
              className={`h-3 w-3 rounded-full transition-all duration-700 ${
                isAlive ? "bg-neon-blue shadow-[0_0_10px_var(--neon-blue)]" : "bg-dormant-text"
              }`}
            />
          </div>

          {/* Mouth */}
          <div
            className={`h-1.5 transition-all duration-700 ${
              isAlive
                ? "w-8 rounded-b-full bg-neon-green shadow-[0_0_10px_var(--neon-green)]"
                : "w-6 rounded-t-full bg-dormant-text"
            }`}
          />
        </div>

        {/* Pulse ring on hover (dormant only) */}
        {!isAlive && (
          <div className="absolute inset-0 animate-ping rounded-full border border-dormant-text opacity-20 group-hover:opacity-40" />
        )}
      </button>
    </div>
  );
}
