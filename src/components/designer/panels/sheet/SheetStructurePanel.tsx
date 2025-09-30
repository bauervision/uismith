"use client";
import React from "react";
import type { SheetDesign } from "@/lib/design/sheet";
import { DesignerSection } from "@/components/designer/DesignerSection";
import { Toggle } from "@/components/designer/Toggle";

export default function SheetStructurePanel({
  design,
  setDesign,
}: {
  design: SheetDesign;
  setDesign: React.Dispatch<React.SetStateAction<SheetDesign>>;
}) {
  const setS = <K extends keyof SheetDesign["structure"]>(
    k: K,
    v: SheetDesign["structure"][K]
  ) => setDesign((d) => ({ ...d, structure: { ...d.structure, [k]: v } }));

  return (
    <aside className="h-full border-l border-white/10 bg-slate-900/60 shadow-none">
      <div className="p-4 h-full overflow-auto">
        <h2 className="text-sm font-semibold mb-3">Structure</h2>

        <DesignerSection title="Header">
          <Toggle
            label="Show header"
            value={design.structure.showHeader}
            onChange={(v) => setS("showHeader", v)}
          />
          <label className="block text-sm">
            <div className="text-[11px] text-slate-400 mb-1">Title</div>
            <input
              value={design.structure.headerTitle}
              onChange={(e) => setS("headerTitle", e.target.value)}
              className="w-full bg-slate-800/70 border border-white/10 rounded px-2 py-1"
            />
          </label>
          <Toggle
            label="Close button"
            value={design.structure.showClose}
            onChange={(v) => setS("showClose", v)}
          />
        </DesignerSection>

        <DesignerSection title="Footer">
          <Toggle
            label="Show footer"
            value={design.structure.showFooter}
            onChange={(v) => setS("showFooter", v)}
          />
          {design.structure.showFooter && (
            <div className="space-y-2">
              <label className="block text-sm">
                <div className="text-[11px] text-slate-400 mb-1">
                  Primary CTA
                </div>
                <input
                  value={design.structure.primaryCta}
                  onChange={(e) => setS("primaryCta", e.target.value)}
                  className="w-full bg-slate-800/70 border border-white/10 rounded px-2 py-1"
                />
              </label>
              <label className="block text-sm">
                <div className="text-[11px] text-slate-400 mb-1">
                  Secondary CTA
                </div>
                <input
                  value={design.structure.secondaryCta}
                  onChange={(e) => setS("secondaryCta", e.target.value)}
                  className="w-full bg-slate-800/70 border border-white/10 rounded px-2 py-1"
                />
              </label>
            </div>
          )}
        </DesignerSection>
      </div>
    </aside>
  );
}
