"use client";

import React, { useEffect, useState } from "react";
import type { UISmithTheme, ThemeLocks } from "@/lib/theme";
import { defaultTheme, defaultThemeLocks, generateTheme } from "@/lib/theme";

export default function ThemeEditor({
  theme,
  setTheme,
}: {
  theme: UISmithTheme;
  setTheme: React.Dispatch<React.SetStateAction<UISmithTheme>>;
}) {
  const [locks, setLocks] = useState<ThemeLocks>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("uismith:themeLocks");
      if (raw) {
        try {
          return JSON.parse(raw) as ThemeLocks;
        } catch {
          /* ignore */
        }
      }
    }
    return defaultThemeLocks;
  });

  useEffect(() => {
    localStorage.setItem("uismith:themeLocks", JSON.stringify(locks));
  }, [locks]);

  const toggle = (k: keyof ThemeLocks) =>
    setLocks((L) => ({ ...L, [k]: !L[k] }));

  const lockAll = () =>
    setLocks({
      bg: true,
      fg: true,
      accent: true,
      border: true,
      titleFg: true,
      bodyFg: true,
      footerBg: true,
    });
  const unlockAll = () => setLocks(defaultThemeLocks);

  const onGenerate = () => setTheme((t) => generateTheme(t, locks));

  return (
    <section className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-slate-400">
          Theme
        </div>
        <div className="flex gap-2 text-xs">
          <button
            className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600"
            onClick={lockAll}
          >
            Lock all
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600"
            onClick={unlockAll}
          >
            Unlock all
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600"
            onClick={() => setTheme(defaultTheme)}
          >
            Reset
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-emerald-500 text-slate-900 font-semibold"
            onClick={onGenerate}
          >
            Generate
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
        <Field
          label="Background"
          value={theme.bg}
          onChange={(v) => setTheme((t) => ({ ...t, bg: v }))}
          locked={locks.bg}
          onToggleLock={() => toggle("bg")}
        />
        <Field
          label="Foreground"
          value={theme.fg}
          onChange={(v) => setTheme((t) => ({ ...t, fg: v }))}
          locked={locks.fg}
          onToggleLock={() => toggle("fg")}
        />
        <Field
          label="Accent"
          value={theme.accent}
          onChange={(v) => setTheme((t) => ({ ...t, accent: v }))}
          locked={locks.accent}
          onToggleLock={() => toggle("accent")}
        />
        <Field
          label="Border"
          value={theme.border}
          onChange={(v) => setTheme((t) => ({ ...t, border: v }))}
          locked={locks.border}
          onToggleLock={() => toggle("border")}
        />
        <Field
          label="Title fg"
          value={theme.titleFg}
          onChange={(v) => setTheme((t) => ({ ...t, titleFg: v }))}
          locked={locks.titleFg}
          onToggleLock={() => toggle("titleFg")}
        />
        <Field
          label="Body fg"
          value={theme.bodyFg}
          onChange={(v) => setTheme((t) => ({ ...t, bodyFg: v }))}
          locked={locks.bodyFg}
          onToggleLock={() => toggle("bodyFg")}
        />
        <Field
          label="Footer bg"
          value={theme.footerBg}
          onChange={(v) => setTheme((t) => ({ ...t, footerBg: v }))}
          locked={locks.footerBg}
          onToggleLock={() => toggle("footerBg")}
        />
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  locked,
  onToggleLock,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] leading-none text-slate-400">{label}</div>
        <button
          type="button"
          onClick={onToggleLock}
          className={`text-[11px] px-2 py-0.5 rounded border ${
            locked
              ? "border-emerald-400/40 text-emerald-300 bg-emerald-400/10"
              : "border-white/10 text-slate-400 hover:bg-white/5"
          }`}
          aria-pressed={locked}
          title={locked ? "Unlock" : "Lock"}
        >
          {locked ? "🔒" : "🔓"}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 rounded border border-white/10 bg-transparent"
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
