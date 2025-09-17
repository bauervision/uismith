"use client";
import Link from "next/link";
import React from "react";
import type { UISmithTheme } from "@/lib/theme";

export default function ComponentCard({
  href,
  title,
  blurb,
  theme,
}: {
  href: string;
  title: string;
  blurb: string;
  theme: UISmithTheme;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-slate-900/50 p-4 hover:border-emerald-500/40 transition block"
    >
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-slate-400">{blurb}</div>

      {/* Scoped preview uses theme colors only inside this card */}
      <MiniDialog theme={theme} />
    </Link>
  );
}

function MiniDialog({ theme }: { theme: UISmithTheme }) {
  return (
    <div
      className="mt-3 rounded-xl border p-3"
      style={{
        background: theme.bg,
        color: theme.fg,
        borderColor: theme.border,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ color: theme.titleFg }}
      >
        <div className="text-xs font-semibold">Dialog</div>
        <div className="text-xs/none opacity-70">×</div>
      </div>
      <div className="mt-2 text-[11px]" style={{ color: theme.bodyFg }}>
        Body preview text…
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <span
          className="text-[11px] rounded-full px-2 py-1 font-semibold"
          style={{ background: theme.accent, color: "#0b0f17" }}
        >
          Primary
        </span>
        <span
          className="text-[11px] rounded-full px-2 py-1"
          style={{ border: `1px solid ${theme.fg}33` }}
        >
          Secondary
        </span>
      </div>
    </div>
  );
}
