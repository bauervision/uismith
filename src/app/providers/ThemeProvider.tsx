"use client";

import * as React from "react";
import { defaultTheme, type UISmithTheme } from "@/lib/theme";
import { usePersistentTheme } from "@/lib/theme/usePersistantTheme";

type ThemeCtx = {
  theme: UISmithTheme;
  setTheme: React.Dispatch<React.SetStateAction<UISmithTheme>>;
  setToken: <K extends keyof UISmithTheme>(
    key: K,
    value: UISmithTheme[K]
  ) => void;
  setTokens: (patch: Partial<UISmithTheme>) => void;
  resetTheme: () => void;
};

const Ctx = React.createContext<ThemeCtx | null>(null);

function applyCssVars(t: UISmithTheme) {
  const root = document.documentElement;
  root.style.setProperty("--bg", t.bg);
  root.style.setProperty("--fg", t.fg);
  root.style.setProperty("--accent", t.accent);
  root.style.setProperty("--border", t.border);
  root.style.setProperty("--title-fg", t.titleFg);
  root.style.setProperty("--body-fg", t.bodyFg);
  root.style.setProperty("--footer-bg", t.footerBg);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Persisted theme (SSR default matches defaultTheme to avoid hydration mismatches)
  const [theme, setTheme] = usePersistentTheme();

  React.useLayoutEffect(() => {
    applyCssVars(theme);
  }, [theme]);

  const setToken = React.useCallback(
    <K extends keyof UISmithTheme>(key: K, value: UISmithTheme[K]) =>
      setTheme((prev) => ({ ...prev, [key]: value })),
    [setTheme]
  );

  const setTokens = React.useCallback(
    (patch: Partial<UISmithTheme>) =>
      setTheme((prev) => ({ ...prev, ...patch })),
    [setTheme]
  );

  const resetTheme = React.useCallback(
    () => setTheme(defaultTheme),
    [setTheme]
  );

  const value = React.useMemo(
    () => ({ theme, setTheme, setToken, setTokens, resetTheme }),
    [theme, setTheme, setToken, setTokens, resetTheme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
