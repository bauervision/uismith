"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/home/ComponentCard";
import ThemeEditor from "@/components/home/ThemeEditor";
import { COMPONENTS } from "@/lib/registry/components";
import { defaultTheme, type UISmithTheme } from "@/lib/theme";
import A11yAlerts from "@/components/designer/A11yAlerts";

export default function Home() {
  const [theme, setTheme] = useState<UISmithTheme>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("uismith:theme");
      if (raw) {
        try {
          return JSON.parse(raw) as UISmithTheme;
        } catch {
          /* noop */
        }
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem("uismith:theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold mt-4">What do you want to craft?</h1>
        <p className="text-slate-400">Pick a component to design or edit.</p>
      </header>

      {/* Theme row */}
      <ThemeEditor theme={theme} setTheme={setTheme} />

      {/* Component mapping with themed previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {COMPONENTS.map((c) => (
          <ComponentCard
            key={c.slug}
            href={`/designer/${c.slug}`}
            title={c.title}
            blurb={c.blurb}
            theme={theme}
            slug={c.slug}
          />
        ))}
      </div>

      <A11yAlerts
        themeLike={{
          bg: theme.bg,
          fg: theme.fg,
          titleFg: theme.titleFg,
          bodyFg: theme.bodyFg,
          accent: theme.accent,
          border: theme.border,
        }}
        onFixAll={(updated) => setTheme((prev) => ({ ...prev, ...updated }))}
      />
    </div>
  );
}
