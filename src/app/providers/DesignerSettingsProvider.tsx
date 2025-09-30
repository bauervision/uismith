"use client";
import * as React from "react";

type GlobalSettings = {
  padding: number;
};

const DEFAULTS: GlobalSettings = {
  padding: 20,
};

type Ctx = {
  settings: GlobalSettings;
  setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  update<K extends keyof GlobalSettings>(k: K, v: GlobalSettings[K]): void;
  reset(): void;
};

const DesignerSettingsContext = React.createContext<Ctx | null>(null);
const LS_KEY = "uismith:designer-settings";

export function DesignerSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ lazy init so the very first render has the saved value
  const [settings, setSettings] = React.useState<GlobalSettings>(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
      }
    } catch {}
    return DEFAULTS;
  });

  // persist on change
  React.useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const update = React.useCallback(
    <K extends keyof GlobalSettings>(k: K, v: GlobalSettings[K]) => {
      setSettings((s) => ({ ...s, [k]: v }));
    },
    []
  );

  const reset = React.useCallback(() => setSettings(DEFAULTS), []);

  return (
    <DesignerSettingsContext.Provider
      value={{ settings, setSettings, update, reset }}
    >
      {children}
    </DesignerSettingsContext.Provider>
  );
}

export function useDesignerSettings() {
  const ctx = React.useContext(DesignerSettingsContext);
  if (!ctx)
    throw new Error(
      "useDesignerSettings must be used within DesignerSettingsProvider"
    );
  return ctx;
}
