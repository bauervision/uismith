"use client";
import React from "react";
import type {
  SheetDesign,
  SheetSide,
  SheetWidthMode,
} from "@/lib/design/sheet";
import { DesignerSection } from "@/components/designer/DesignerSection";
import { Slider } from "@/components/designer/Slider";
import { Toggle } from "@/components/designer/Toggle";

export default function SheetLayoutPanel({
  design,
  setDesign,
}: {
  design: SheetDesign;
  setDesign: React.Dispatch<React.SetStateAction<SheetDesign>>;
}) {
  const set = <K extends keyof SheetDesign["layout"]>(
    k: K,
    v: SheetDesign["layout"][K]
  ) => setDesign((d) => ({ ...d, layout: { ...d.layout, [k]: v } }));

  return (
    <aside className="h-full border-r border-white/10 bg-slate-900/60 shadow-none">
      <div className="p-4 h-full overflow-auto">
        <h2 className="text-sm font-semibold mb-3">Layout & Shape</h2>

        <DesignerSection title="">
          {/* Side */}
          <div className="text-sm">
            <div className="text-[11px] text-slate-400 mb-1">Open from</div>
            <div className="flex gap-2">
              {(["left", "right", "bottom"] as const satisfies SheetSide[]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => set("side", s)}
                    className={`px-2 py-1 rounded border text-xs ${
                      design.layout.side === s
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Width mode */}
          <div className="text-sm">
            <div className="text-[11px] text-slate-400 mb-1">Width</div>
            <div className="flex gap-2">
              {(["full", "contextual"] as const satisfies SheetWidthMode[]).map(
                (w) => (
                  <button
                    key={w}
                    onClick={() => set("widthMode", w)}
                    className={`px-2 py-1 rounded border text-xs ${
                      design.layout.widthMode === w
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    {w}
                  </button>
                )
              )}
            </div>
          </div>

          {design.layout.widthMode === "contextual" && (
            <Slider
              label="Contextual width"
              min={240}
              max={520}
              value={design.layout.contextualWidth}
              onChange={(n) => set("contextualWidth", n)}
            />
          )}

          <Slider
            label="Padding"
            min={8}
            max={40}
            value={design.layout.padding}
            onChange={(n) => set("padding", n)}
          />

          <Slider
            label="Border width"
            min={0}
            max={4}
            value={design.layout.borderWidth}
            onChange={(n) => set("borderWidth", n)}
          />

          <Toggle
            label="Uniform radius"
            value={design.layout.radiusMode === "uniform"}
            onChange={(uniform) =>
              set("radiusMode", uniform ? "uniform" : "custom")
            }
          />

          {design.layout.radiusMode === "uniform" ? (
            <Slider
              label="Border radius"
              min={0}
              max={48}
              value={design.layout.radius}
              onChange={(n) => set("radius", n)}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Slider
                label="Top-left"
                min={0}
                max={64}
                value={design.layout.radiusTL}
                onChange={(n) => set("radiusTL", n)}
              />
              <Slider
                label="Top-right"
                min={0}
                max={64}
                value={design.layout.radiusTR}
                onChange={(n) => set("radiusTR", n)}
              />
              <Slider
                label="Bottom-right"
                min={0}
                max={64}
                value={design.layout.radiusBR}
                onChange={(n) => set("radiusBR", n)}
              />
              <Slider
                label="Bottom-left"
                min={0}
                max={64}
                value={design.layout.radiusBL}
                onChange={(n) => set("radiusBL", n)}
              />
            </div>
          )}

          <Slider
            label="Shadow"
            min={0}
            max={48}
            value={design.layout.shadow}
            onChange={(n) => set("shadow", n)}
          />
        </DesignerSection>
      </div>
    </aside>
  );
}
