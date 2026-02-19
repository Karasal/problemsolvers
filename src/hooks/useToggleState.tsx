"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface ToggleState {
  isAlive: boolean;
  activate: () => void;
}

const ToggleContext = createContext<ToggleState>({
  isAlive: false,
  activate: () => {},
});

export function ToggleProvider({ children }: { children: ReactNode }) {
  const [isAlive, setIsAlive] = useState(false);

  const activate = useCallback(() => {
    setIsAlive(true);
  }, []);

  // Sync data attribute to body for CSS state switching
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-alive",
      isAlive ? "true" : "false"
    );
  }, [isAlive]);

  return (
    <ToggleContext.Provider value={{ isAlive, activate }}>
      {children}
    </ToggleContext.Provider>
  );
}

export function useToggleState() {
  return useContext(ToggleContext);
}
