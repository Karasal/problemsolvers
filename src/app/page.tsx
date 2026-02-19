"use client";

import { useRef } from "react";
import { ToggleProvider, useToggleState } from "@/hooks/useToggleState";
import { useScrollEngine } from "@/hooks/useScrollEngine";
import Gate from "@/components/sections/Gate";
import Wow from "@/components/sections/Wow";
import Pitch from "@/components/sections/Pitch";
import Machine from "@/components/sections/Machine";
import Proof from "@/components/sections/Proof";
import Ask from "@/components/sections/Ask";
import SoundToggle from "@/components/ui/SoundToggle";

function SiteContent() {
  const { isAlive } = useToggleState();
  const mainRef = useRef<HTMLDivElement>(null);

  // Initialize scroll engine only after toggle is activated
  useScrollEngine(isAlive);

  return (
    <div
      ref={mainRef}
      className={`relative ${!isAlive ? "h-screen overflow-hidden" : ""}`}
    >
      {/* Sound toggle — always visible */}
      <SoundToggle />

      {/* Section 0 — The Gate (always visible) */}
      <Gate />

      {/* Sections 1-5 — Only scrollable after toggle */}
      <Wow />
      <Pitch />
      <Machine />
      <Proof />
      <Ask />
    </div>
  );
}

export default function Home() {
  return (
    <ToggleProvider>
      <SiteContent />
    </ToggleProvider>
  );
}
