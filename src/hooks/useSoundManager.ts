"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SoundManagerState {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (id: string) => void;
}

// Sound definitions — paths will be in /public/audio/
const SOUNDS: Record<string, { src: string; volume: number; loop?: boolean }> = {
  ambient: { src: "/audio/ambient.mp3", volume: 0.3, loop: true },
  toggle: { src: "/audio/toggle.mp3", volume: 0.5 },
  whoosh: { src: "/audio/whoosh.mp3", volume: 0.4 },
  click: { src: "/audio/click.mp3", volume: 0.3 },
};

export function useSoundManager(): SoundManagerState {
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const howlsRef = useRef<Record<string, import("howler").Howl>>({});
  const initializedRef = useRef(false);

  // Lazy-init Howler instances only when unmuted for the first time
  const initSounds = useCallback(async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const { Howl } = await import("howler");

    for (const [id, config] of Object.entries(SOUNDS)) {
      howlsRef.current[id] = new Howl({
        src: [config.src],
        volume: config.volume,
        loop: config.loop ?? false,
        preload: true,
      });
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (!next) {
        // Unmuting — init sounds if first time
        initSounds();
      }

      // Mute/unmute all active howls
      Object.values(howlsRef.current).forEach((howl) => {
        howl.mute(next);
      });

      return next;
    });
  }, [initSounds]);

  const playSound = useCallback(
    (id: string) => {
      if (isMuted) return;
      const howl = howlsRef.current[id];
      if (howl) {
        howl.play();
      }
    },
    [isMuted]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(howlsRef.current).forEach((howl) => howl.unload());
      howlsRef.current = {};
      initializedRef.current = false;
    };
  }, []);

  return { isMuted, toggleMute, playSound };
}
