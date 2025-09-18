"use client";

import React, { useState } from "react";
import type { UISmithTheme } from "@/lib/theme";

/** A tiny, themed navbar preview for the Home grid cards. */
export default function MiniNavbar({ theme }: { theme: UISmithTheme }) {
  const [open, setOpen] = useState(false);

  const btnBase =
    "text-[11px] rounded-full px-2 py-1 font-semibold border border-transparent";
  const ghost =
    "bg-transparent text-[color:var(--fg)] border-[color:var(--fg15)]";
  const primary = "bg-[color:var(--accent)] text-[#0b0f17]";

  return (
    <div
      className="mt-3 rounded-xl border"
      style={
        {
          background: theme.bg,
          color: theme.fg,
          borderColor: theme.border,
          // expose css vars so utility classes above can reference them
          // (Tailwind can't read runtime colors; this trick keeps it tidy)
          // @ts-ignore
          "--fg": theme.fg,
          "--fg15": `${theme.fg}26`,
          "--accent": theme.accent,
        } as React.CSSProperties
      }
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2">
        {/* Brand */}
        <div className="text-xs font-semibold" style={{ color: theme.titleFg }}>
          UISmith
        </div>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-3 text-[11px]"
          style={{ color: theme.bodyFg }}
        >
          <span className="opacity-90">Docs</span>
          <span className="opacity-90">Components</span>
          <span className="opacity-90">Changelog</span>
        </nav>

        {/* Actions + hamburger */}
        <div className="flex items-center gap-2">
          <button
            className={`${btnBase} ${ghost}`}
            style={{ borderColor: `${theme.fg}33` }}
          >
            Sign in
          </button>
          <button className={`${btnBase} ${primary}`}>Get started</button>

          {/* Hamburger (mobile) */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            className="md:hidden ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md"
            style={{ border: `1px solid ${theme.fg}26` }}
          >
            <span className="sr-only">Menu</span>
            {/* simple 3 bars */}
            <div className="space-y-[3px]">
              <div
                style={{ background: theme.fg }}
                className="h-[2px] w-4 rounded"
              />
              <div
                style={{ background: theme.fg }}
                className="h-[2px] w-4 rounded"
              />
              <div
                style={{ background: theme.fg }}
                className="h-[2px] w-4 rounded"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-3 py-2 text-[11px]"
          style={{ borderColor: theme.border, color: theme.bodyFg }}
        >
          <div className="py-1">Docs</div>
          <div className="py-1">Components</div>
          <div className="py-1">Changelog</div>
        </div>
      )}
    </div>
  );
}
