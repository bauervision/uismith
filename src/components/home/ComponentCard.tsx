"use client";
import Link from "next/link";
import React from "react";
import type { UISmithTheme } from "@/lib/theme";

// existing minis
import MiniDialog from "@/components/mini/MiniDialog";
import MiniNavbar from "@/components/mini/MiniNavbar";

// new minis
import MiniTabs from "@/components/mini/MiniTabs";
import MiniSheet from "@/components/mini/MiniSheet";

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
  // Prevent card navigation when clicking inside the preview area.
  const stopNavInsidePreview = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const preview = renderPreview(slug, theme);

  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-slate-900/50 p-4 hover:border-emerald-500/40 transition block"
      // If any descendant marked data-preview-interactive might be used later,
      // we can guard at the card level too. For now we wrap the preview div.
    >
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-slate-400">{blurb}</div>

      {/* Wrap preview area so interactions (open sheet, switch tabs) don't navigate */}
      <div onClickCapture={stopNavInsidePreview}>
        {preview ?? <Placeholder theme={theme} title={title} />}
      </div>
    </Link>
  );
}

function renderPreview(slug: string, theme: UISmithTheme) {
  switch (slug) {
    case "dialog":
      return <MiniDialog theme={theme} />;
    case "navbar":
      return <MiniNavbar theme={theme} />;
    case "tabs":
      return <MiniTabs theme={theme} />;
    case "sheet":
      return <MiniSheet theme={theme} />;
    // easy to add:
    // case "button": return <MiniButton theme={theme} />;
    // case "login":  return <MiniLogin theme={theme} />;
    default:
      return null;
  }
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
