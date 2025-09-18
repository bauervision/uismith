"use client";

import React from "react";
import {
  checkThemeContrast,
  type A11yIssue,
  fixAllThemeColors,
} from "@/lib/a11y/contrast";

export default function A11yAlerts({
  themeLike,
  onFixAll, // optional; when present, shows the Fix All button
}: {
  themeLike: {
    bg: string;
    fg: string;
    titleFg: string;
    bodyFg: string;
    accent: string;
    border: string;
  };
  onFixAll?: (updated: {
    bg: string;
    fg: string;
    titleFg: string;
    bodyFg: string;
    accent: string;
    border: string;
  }) => void;
}) {
  const issues = React.useMemo<A11yIssue[]>(
    () => checkThemeContrast(themeLike),
    [themeLike]
  );

  const [busy, setBusy] = React.useState(false);
  const [donePulse, setDonePulse] = React.useState(false);

  if (issues.length === 0) return null;

  const handleFixAll = () => {
    if (!onFixAll) return;
    setBusy(true);
    // deterministic + synchronous fix
    const updated = fixAllThemeColors(themeLike);
    onFixAll(updated);
    // tiny success pulse
    setBusy(false);
    setDonePulse(true);
    const t = setTimeout(() => setDonePulse(false), 900);
    return () => clearTimeout(t);
  };

  return (
    <div className="fixed right-3 top-[56px] z-[80] w-[340px] rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 backdrop-blur">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-sm font-semibold text-amber-300">
          Accessibility alerts
        </div>

        {onFixAll && (
          <button
            onClick={handleFixAll}
            disabled={busy}
            className={`text-xs rounded-md px-2 py-1 border transition ${
              donePulse
                ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                : "border-amber-300/40 hover:bg-amber-300/10 text-amber-200"
            } ${busy ? "opacity-60 cursor-not-allowed" : ""}`}
            aria-label="Automatically fix all contrast issues"
            title="Automatically fix all contrast issues"
          >
            {donePulse ? "Fixed ✓" : busy ? "Fixing…" : "Fix All"}
          </button>
        )}
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
