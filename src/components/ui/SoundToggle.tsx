"use client";

import { useSoundManager } from "@/hooks/useSoundManager";

/**
 * Floating sound on/off toggle.
 * Fixed position in bottom-right corner.
 */
export default function SoundToggle() {
  const { isMuted, toggleMute } = useSoundManager();

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border-custom bg-surface transition-all duration-300 hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      {isMuted ? (
        /* Muted icon */
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-dim"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        /* Sound on icon */
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-neon-blue"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
