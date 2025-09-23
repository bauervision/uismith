"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import type { Easing } from "framer-motion";

export type MotionMode = "system" | "reduced" | "normal" | "spicy";
export type EasingId = "soft" | "snap" | "easeInOut" | "linear";

export type MotionSettings = {
  mode: MotionMode;
  baseDurationMs: number; // used as reference; page scales relative to this
  easing: EasingId;
  staggerMs: number; // default stagger for lists
  delayChildrenMs: number;
};

const STORAGE_KEY = "uismith:motion";

const DEFAULT: MotionSettings = {
  mode: "system",
  baseDurationMs: 350,
  easing: "soft",
  staggerMs: 80,
  delayChildrenMs: 150,
};

function useSystemReduced(): boolean {
  const [reduced, set] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => set(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

type Ctx = {
  settings: MotionSettings;
  setSettings: React.Dispatch<React.SetStateAction<MotionSettings>>;
  /** Derived */
  reduced: boolean;
  easingValue: Easing;
  durationMult: number; // 0 for reduced, 1 normal, 1.25 spicy
  secs: (ms: number) => number; // helper -> seconds
};

const Ctx = React.createContext<Ctx | null>(null);

export function MotionSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const sysReduced = useSystemReduced();
  const [settings, setSettings] = React.useState<MotionSettings>(DEFAULT);

  // hydrate from localStorage
  const hydrated = React.useRef(false);
  React.useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {}
  }, []);
  // persist
  React.useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const reduced =
    settings.mode === "system" ? sysReduced : settings.mode === "reduced";

  const easingValue: Easing =
    settings.easing === "linear"
      ? "linear"
      : settings.easing === "easeInOut"
      ? [0.4, 0.0, 0.2, 1]
      : settings.easing === "snap"
      ? [0.16, 1, 0.3, 1]
      : [0.2, 0.8, 0.2, 1]; // soft (default)

  const durationMult = reduced ? 0 : settings.mode === "spicy" ? 1.25 : 1; // spicy boosts subtly

  const secs = React.useCallback((ms: number) => ms / 1000, []);

  const value: Ctx = React.useMemo(
    () => ({ settings, setSettings, reduced, easingValue, durationMult, secs }),
    [settings, reduced, easingValue, durationMult, secs]
  );

  return (
    <Ctx.Provider value={value}>
      {/* Also teach Framer the global reduced-motion intent */}
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>
        {children}
      </MotionConfig>
    </Ctx.Provider>
  );
}

export function useMotionSettings() {
  const ctx = React.useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useMotionSettings must be used within MotionSettingsProvider"
    );
  return ctx;
}
