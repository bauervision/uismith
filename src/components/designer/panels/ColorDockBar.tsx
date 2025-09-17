// /components/designer/panels/ColorDockBar.tsx
"use client";

import React from "react";
import type { DialogDesign } from "@/lib/design/dialog";
import { Toggle } from "@/components/designer/Toggle";

export default function ColorDockBar({
  design,
  setDesign,
}: {
  design: DialogDesign;
  setDesign: React.Dispatch<React.SetStateAction<DialogDesign>>;
}) {
  const borderIsGradient = design.colors.borderMode === "gradient";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-t border-white/10 bg-slate-950/70 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 py-3 h-24 overflow-hidden">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Colors
          </div>

          {/* one stable row: 9 equal cells so nothing overlaps */}
          <div
            className="mt-2 grid gap-3"
            style={{ gridTemplateColumns: "repeat(9, minmax(120px, 1fr))" }}
          >
            <Field
              label="Background"
              value={design.colors.bg}
              onChange={(v) =>
                setDesign((d) => ({ ...d, colors: { ...d.colors, bg: v } }))
              }
            />

            <Field
              label="Foreground"
              value={design.colors.fg}
              onChange={(v) =>
                setDesign((d) => ({ ...d, colors: { ...d.colors, fg: v } }))
              }
            />

            <Field
              label="Accent"
              value={design.colors.accent}
              onChange={(v) =>
                setDesign((d) => ({ ...d, colors: { ...d.colors, accent: v } }))
              }
            />

            {/* Border mode toggle (its own cell) */}
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

            {/* Border / Start (second dedicated cell) */}
            {!borderIsGradient ? (
              <Field
                label="Border"
                value={design.colors.border}
                onChange={(v) =>
                  setDesign((d) => ({
                    ...d,
                    colors: { ...d.colors, border: v },
                  }))
                }
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

            {/* End (third dedicated cell) — keep the cell, hide in solid mode to preserve layout */}
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
              value={design.colors.titleFg}
              onChange={(v) =>
                setDesign((d) => ({
                  ...d,
                  colors: { ...d.colors, titleFg: v },
                }))
              }
            />

            <Field
              label="Body fg"
              value={design.colors.bodyFg}
              onChange={(v) =>
                setDesign((d) => ({ ...d, colors: { ...d.colors, bodyFg: v } }))
              }
            />

            <Field
              label="Footer bg"
              value={design.colors.footerBg}
              onChange={(v) =>
                setDesign((d) => ({
                  ...d,
                  colors: { ...d.colors, footerBg: v },
                }))
              }
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
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-6 shrink-0 rounded border border-white/10 bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full bg-slate-800/70 border border-white/10 rounded px-2 text-sm"
        />
      </div>
    </label>
  );
}
