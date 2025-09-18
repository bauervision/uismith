"use client";

import React from "react";
import { checkThemeContrast, type A11yIssue } from "@/lib/a11y/contrast";

export default function A11yAlerts({
  themeLike, // { bg, fg, titleFg, bodyFg, accent, border }
}: {
  themeLike: {
    bg: string;
    fg: string;
    titleFg: string;
    bodyFg: string;
    accent: string;
    border: string;
  };
}) {
  const issues = React.useMemo<A11yIssue[]>(
    () => checkThemeContrast(themeLike),
    [themeLike]
  );

  if (issues.length === 0) return null;

  return (
    <div className="fixed right-3 top-[56px] z-[80] w-[320px] rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 backdrop-blur">
      <div className="text-sm font-semibold text-amber-300 mb-2">
        Accessibility alerts
      </div>
      <ul className="space-y-1 text-xs text-amber-200">
        {issues.map((i) => (
          <li key={i.id}>
            • {i.message} — needs ≥ {i.required}:1
          </li>
        ))}
      </ul>
    </div>
  );
}
