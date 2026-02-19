"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SoundManagerState {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (id: string) => void;
}

// Sound definitions with real asset paths
const SOUNDS: Record<string, { src: string; volume: number; loop?: boolean }> = {
  toggle: { src: "/audio/bell.mp3", volume: 0.5 },
  bassTone: { src: "/audio/bass-tone.mp3", volume: 0.3 },
  whoosh: { src: "/audio/whoosh.wav", volume: 0.2 },
  submit: { src: "/audio/button-push.mp3", volume: 0.4 },
  ambient: { src: "/audio/delay.mp3", volume: 0.15, loop: true },
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

    // Start ambient loop if available
    if (howlsRef.current.ambient) {
      howlsRef.current.ambient.play();
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
