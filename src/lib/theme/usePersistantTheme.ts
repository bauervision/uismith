"use client";
import * as React from "react";
import { defaultTheme, UISmithTheme } from "../theme";

const STORAGE_KEY = "uismith:theme";

export function usePersistentTheme() {
  // SSR + first client render use identical defaultTheme
  const [theme, setTheme] = React.useState<UISmithTheme>(defaultTheme);
  const hydrated = React.useRef(false);

  // After mount, merge in any saved theme from localStorage
  React.useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<UISmithTheme>;
      setTheme((prev) => ({ ...prev, ...saved })); // merge keeps required keys
    } catch {}
  }, []);

  // Persist on change (after hydration)
  React.useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {}
  }, [theme]);

  return [theme, setTheme] as const;
}
