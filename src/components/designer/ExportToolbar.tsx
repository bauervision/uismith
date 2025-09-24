// components/designer/ExportToolbar.tsx
"use client";

import * as React from "react";
import { useConfig } from "@/app/providers/ConfigProvider";
import { kebab } from "@/lib/strings";

type Kind = "dialog" | "navbar"; // or pass a generic slug: string

export default function ExportToolbar({
  design,
  kind, // keep as you have it; Dialog passes "dialog", Navbar passes "navbar"
}: {
  design: any;
  kind: Kind;
}) {
  const { config } = useConfig();
  const pkg = kebab(config.packageName || "app-ui");
  const compId = `${pkg}-${kind}`; // ← e.g. app-ui-dialog / app-ui-navbar

  return (
    <nav className="border-b border-white/10 bg-slate-950/20 backdrop-blur supports-[backdrop-filter]:bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400">Toolbar</span>
          <span className="text-slate-400">Component:</span>
          <code className="rounded-md bg-slate-800/60 px-2 py-0.5 text-slate-200">
            {compId}
          </code>
        </div>

        {/* keep your existing right-side toggles/actions */}
        <div className="flex items-center gap-3">{/* ... */}</div>
      </div>
    </nav>
  );
}
