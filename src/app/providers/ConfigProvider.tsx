"use client";

import * as React from "react";

export type GlobalConfig = {
  packageName: string; // <appUIName> for export folder
  styling: "core-css" | "tailwind"; // preferred styling mode
  includeDataProvider: boolean; // export data layer files
  includeReadme: boolean; // export README.md
  fileStructure: "nested" | "flat"; // components/feedback/Dialog.tsx vs components/Dialog.tsx
  cssVarPrefix: string; // e.g. "" | "ui-"
  classPrefix: string; // e.g. "" | "ui-"
  motionMode: string;
};

const STORAGE_KEY = "uismith:config";

const DEFAULT: GlobalConfig = {
  packageName: "app-ui",
  styling: "core-css",
  includeDataProvider: true,
  includeReadme: true,
  fileStructure: "nested",
  cssVarPrefix: "",
  classPrefix: "",
  motionMode: "on" as "on" | "reduced" | "off",
};

type Ctx = {
  config: GlobalConfig;
  setConfig: React.Dispatch<React.SetStateAction<GlobalConfig>>;
  updateConfig: (patch: Partial<GlobalConfig>) => void;
};

const Ctx = React.createContext<Ctx | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<GlobalConfig>(DEFAULT);
  const hydrated = React.useRef(false);

  // hydrate once
  React.useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConfig((c) => ({ ...c, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  // persist on change
  React.useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  const updateConfig = React.useCallback(
    (patch: Partial<GlobalConfig>) => setConfig((c) => ({ ...c, ...patch })),
    []
  );

  const value = React.useMemo(
    () => ({ config, setConfig, updateConfig }),
    [config]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useConfig() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}
