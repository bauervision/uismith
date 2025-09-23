"use client";

import React from "react";
import type { DialogDesign } from "@/lib/design/dialog";
import { Toggle } from "@/components/designer/Toggle";
import { useTheme } from "@/app/providers/ThemeProvider";
import type { UISmithTheme } from "@/lib/theme";

export default function ColorDockBar({
  design,
  setDesign,
}: {
  design: DialogDesign;
  setDesign: React.Dispatch<React.SetStateAction<DialogDesign>>;
}) {
  const { theme, setToken } = useTheme();

  // Persist a user preference for linking component color edits to the global theme
  const [linkTheme, setLinkTheme] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const raw = localStorage.getItem("uismith:linkTheme");
      return raw ? JSON.parse(raw) : true;
    } catch {
      return true;
    }
  });
  React.useEffect(() => {
    try {
      localStorage.setItem("uismith:linkTheme", JSON.stringify(linkTheme));
    } catch {}
  }, [linkTheme]);

  const borderIsGradient = design.colors.borderMode === "gradient";

  // Helper: update both component design AND (optionally) the global theme token.
  const updateToken =
    (k: keyof UISmithTheme) =>
    (v: string): void => {
      // Update component-local design (for saved preset/export fidelity)
      setDesign((d) => ({ ...d, colors: { ...d.colors, [k]: v } as any }));
      // If linked, also update global theme -> writes CSS vars at :root
      if (linkTheme) setToken(k as any, v as any);
    };

  // Values shown in fields: when linked, reflect the current global theme; otherwise, the local design colors
  const val = (k: keyof UISmithTheme) =>
    linkTheme ? (theme[k] as string) : ((design.colors as any)[k] as string);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="relative w-screen border-t border-white/10 bg-slate-950/70 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50">
        {/* h-28 = 112px; include iOS safe-area inset */}
        <div className="mx-auto px-10 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] h-28 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Colors
            </div>

            {/* Link to Theme toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Local</span>
              <Toggle
                label="Link to theme"
                value={linkTheme}
                onChange={setLinkTheme}
              />
              <span className="text-xs text-slate-300">Theme</span>
            </div>
          </div>

          {/* one stable row: 9 equal cells; align bottoms so labels don't collide */}
          <div
            className="mt-2 grid gap-8 items-end"
            style={{ gridTemplateColumns: "repeat(9, minmax(140px, 1fr))" }}
          >
            <Field
              label="Background"
              value={val("bg")}
              onChange={updateToken("bg")}
            />

            <Field
              label="Foreground"
              value={val("fg")}
              onChange={updateToken("fg")}
            />

            <Field
              label="Accent"
              value={val("accent")}
              onChange={updateToken("accent")}
            />

            {/* Border mode toggle (dedicated cell) */}
            <Cell>
              <SmallLabel>Border mode</SmallLabel>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Solid</span>
                <Toggle
                  label=""
                  value={borderIsGradient}
                  onChange={(on) =>
                    setDesign((d) => ({
                      ...d,
                      colors: {
                        ...d.colors,
                        borderMode: on ? "gradient" : "solid",
                      },
                    }))
                  }
                />
                <span className="text-xs text-slate-400">Gradient</span>
              </div>
            </Cell>

            {/* Border / Start (second border cell) */}
            {!borderIsGradient ? (
              <Field
                label="Border"
                value={val("border")}
                onChange={updateToken("border")}
              />
            ) : (
              <Field
                label="Start"
                value={design.colors.borderGradStart}
                onChange={(v) =>
                  setDesign((d) => ({
                    ...d,
                    colors: { ...d.colors, borderGradStart: v },
                  }))
                }
              />
            )}

            {/* End (third border cell). Keep the cell; hide contents in solid mode to preserve layout */}
            <div
              className={
                !borderIsGradient ? "opacity-0 pointer-events-none" : ""
              }
              aria-hidden={!borderIsGradient}
            >
              <Field
                label="End"
                value={design.colors.borderGradEnd}
                onChange={(v) =>
                  setDesign((d) => ({
                    ...d,
                    colors: { ...d.colors, borderGradEnd: v },
                  }))
                }
              />
            </div>

            <Field
              label="Title fg"
              value={val("titleFg")}
              onChange={updateToken("titleFg")}
            />

            <Field
              label="Body fg"
              value={val("bodyFg")}
              onChange={updateToken("bodyFg")}
            />

            <Field
              label="Footer bg"
              value={val("footerBg")}
              onChange={updateToken("footerBg")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——— UI bits ——— */

function Cell({ children }: { children: React.ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}

function SmallLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] leading-none text-slate-400 mb-1">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <SmallLabel>{label}</SmallLabel>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 shrink-0 rounded border border-white/10 bg-transparent p-0"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full bg-slate-800/70 border border-white/10 rounded px-2 text-sm"
        />
      </div>
    </label>
  );
}
