"use client";
import Link from "next/link";
import React from "react";
import type { UISmithTheme } from "@/lib/theme";
import MiniDialog from "../preview/MiniDialog";
import MiniNavbar from "../preview/MiniNavbar";

export default function ComponentCard({
  href,
  title,
  blurb,
  slug,
  theme,
}: {
  href: string;
  title: string;
  blurb: string;
  slug: string;
  theme: UISmithTheme;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-slate-900/50 p-4 hover:border-emerald-500/40 transition block"
    >
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-slate-400">{blurb}</div>

      {slug === "dialog" && <MiniDialog theme={theme} />}
      {slug === "navbar" && <MiniNavbar theme={theme} />}
      {slug !== "dialog" && slug !== "navbar" && (
        <Placeholder theme={theme} title={title} />
      )}
    </Link>
  );
}

function Placeholder({ theme, title }: { theme: UISmithTheme; title: string }) {
  return (
    <div
      className="mt-3 rounded-xl border p-3 text-[11px]"
      style={{
        background: theme.bg,
        color: theme.fg,
        borderColor: theme.border,
      }}
    >
      <div style={{ color: theme.titleFg }} className="font-semibold">
        {title}
      </div>
      <div style={{ color: theme.bodyFg }} className="opacity-80">
        Preview coming soon…
      </div>
    </div>
  );
}
