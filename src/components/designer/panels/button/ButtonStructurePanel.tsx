"use client";
import React from "react";
import type { ButtonDesign } from "@/lib/design/button";
import { DesignerSection } from "@/components/designer/DesignerSection";
import { Toggle } from "@/components/designer/Toggle";

export default function ButtonStructurePanel({
  design,
  setDesign,
}: {
  design: ButtonDesign;
  setDesign: React.Dispatch<React.SetStateAction<ButtonDesign>>;
}) {
  const set = <K extends keyof ButtonDesign>(k: K, v: ButtonDesign[K]) =>
    setDesign((d) => ({ ...d, [k]: v }));

  return (
    <aside className="h-full border-l border-white/10 bg-slate-900/60 shadow-none">
      <div className="p-4 h-full overflow-auto">
        <h2 className="text-sm font-semibold mb-3">Structure</h2>

        <DesignerSection title="Content">
          <label className="block text-sm mb-2">
            <div className="text-[11px] text-slate-400 mb-1">Label</div>
            <input
              value={design.label}
              onChange={(e) => set("label", e.target.value)}
              className="w-full bg-slate-800/70 border border-white/10 rounded px-2 py-1 text-sm"
            />
          </label>

          <Toggle
            label="Uppercase"
            value={design.uppercase}
            onChange={(v) => set("uppercase", v)}
          />
        </DesignerSection>

        <DesignerSection title="Icons">
          <Toggle
            label="Icon left"
            value={design.iconLeft}
            onChange={(v) => set("iconLeft", v)}
          />
          <Toggle
            label="Icon right"
            value={design.iconRight}
            onChange={(v) => set("iconRight", v)}
          />
        </DesignerSection>
      </div>
    </aside>
  );
}
