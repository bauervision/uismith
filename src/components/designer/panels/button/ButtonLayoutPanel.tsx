"use client";
import React from "react";
import type {
  ButtonDesign,
  ButtonSize,
  ButtonWeight,
} from "@/lib/design/button";
import { DesignerSection } from "@/components/designer/DesignerSection";
import { Slider } from "@/components/designer/Slider";
import { Toggle } from "@/components/designer/Toggle";

export default function ButtonLayoutPanel({
  design,
  setDesign,
}: {
  design: ButtonDesign;
  setDesign: React.Dispatch<React.SetStateAction<ButtonDesign>>;
}) {
  const set = <K extends keyof ButtonDesign>(k: K, v: ButtonDesign[K]) =>
    setDesign((d) => ({ ...d, [k]: v }));

  return (
    <aside className="h-full border-r border-white/10 bg-slate-900/60 shadow-none">
      <div className="p-4 h-full overflow-auto">
        <h2 className="text-sm font-semibold mb-3">Layout & Style</h2>

        <DesignerSection title="">
          {/* Size */}
          <div className="text-sm">
            <div className="text-[11px] text-slate-400 mb-1">Size</div>
            <div className="flex gap-2">
              {(["sm", "md", "lg"] as const satisfies ButtonSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => set("size", s)}
                  className={`px-2 py-1 rounded border text-xs ${
                    design.size === s
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div className="text-sm">
            <div className="text-[11px] text-slate-400 mb-1">Weight</div>
            <div className="flex gap-2">
              {(
                ["solid", "outline", "ghost"] as const satisfies ButtonWeight[]
              ).map((w) => (
                <button
                  key={w}
                  onClick={() => set("weight", w)}
                  className={`px-2 py-1 rounded border text-xs ${
                    design.weight === w
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Corner radius */}
          <Slider
            label={`Corner radius`}
            min={0}
            max={32}
            value={design.radius}
            onChange={(n) => set("radius", n)}
          />

          {/* Full width */}
          <Toggle
            label="Full width"
            value={design.fullWidth}
            onChange={(v) => set("fullWidth", v)}
          />
        </DesignerSection>
      </div>
    </aside>
  );
}
