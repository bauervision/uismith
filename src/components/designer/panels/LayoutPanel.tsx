// /components/designer/panels/LayoutPanel.tsx
"use client";
import React from "react";
import type { DialogDesign } from "@/lib/design/dialog";
import { DesignerSection } from "@/components/designer/DesignerSection";
import { Slider } from "@/components/designer/Slider";
import { Toggle } from "../Toggle";

export default function LayoutPanel({
  design,
  setDesign,
}: {
  design: DialogDesign;
  setDesign: React.Dispatch<React.SetStateAction<DialogDesign>>;
}) {
  return (
    <aside className="h-full  border-r border-white/10 bg-slate-900/60 shadow-none">
      <div className="p-4 h-full overflow-auto">
        <h2 className="text-sm font-semibold mb-3">Layout & Shape</h2>
        <DesignerSection title="">
          {/* sliders unchanged */}
          <Slider
            label="Max width"
            min={320}
            max={860}
            step={10}
            value={design.layout.maxWidth.base}
            onChange={(n) =>
              setDesign((d) => ({
                ...d,
                layout: {
                  ...d.layout,
                  maxWidth: { ...d.layout.maxWidth, base: n },
                },
              }))
            }
          />
          <Slider
            label="Padding"
            min={8}
            max={48}
            value={design.layout.padding.base}
            onChange={(n) =>
              setDesign((d) => ({
                ...d,
                layout: {
                  ...d.layout,
                  padding: { ...d.layout.padding, base: n },
                },
              }))
            }
          />
          <Slider
            label="Gap"
            min={8}
            max={36}
            value={design.layout.gap}
            onChange={(n) =>
              setDesign((d) => ({ ...d, layout: { ...d.layout, gap: n } }))
            }
          />
          <Toggle
            label="Uniform radius"
            value={design.layout.radiusMode === "uniform"}
            onChange={(isUniform) =>
              setDesign((d) => ({
                ...d,
                layout: {
                  ...d.layout,
                  radiusMode: isUniform ? "uniform" : "custom",
                },
              }))
            }
          />

          {design.layout.radiusMode === "uniform" ? (
            <Slider
              label="Border radius"
              min={0}
              max={48}
              value={design.layout.radius}
              onChange={(n) =>
                setDesign((d) => ({ ...d, layout: { ...d.layout, radius: n } }))
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Slider
                label="Top-left"
                min={0}
                max={64}
                value={design.layout.radiusTL}
                onChange={(n) =>
                  setDesign((d) => ({
                    ...d,
                    layout: { ...d.layout, radiusTL: n },
                  }))
                }
              />
              <Slider
                label="Top-right"
                min={0}
                max={64}
                value={design.layout.radiusTR}
                onChange={(n) =>
                  setDesign((d) => ({
                    ...d,
                    layout: { ...d.layout, radiusTR: n },
                  }))
                }
              />
              <Slider
                label="Bottom-left"
                min={0}
                max={64}
                value={design.layout.radiusBL}
                onChange={(n) =>
                  setDesign((d) => ({
                    ...d,
                    layout: { ...d.layout, radiusBL: n },
                  }))
                }
              />
              <Slider
                label="Bottom-right"
                min={0}
                max={64}
                value={design.layout.radiusBR}
                onChange={(n) =>
                  setDesign((d) => ({
                    ...d,
                    layout: { ...d.layout, radiusBR: n },
                  }))
                }
              />
            </div>
          )}
          <Slider
            label="Border width"
            min={0}
            max={4}
            value={design.layout.borderWidth}
            onChange={(n) =>
              setDesign((d) => ({
                ...d,
                layout: { ...d.layout, borderWidth: n },
              }))
            }
          />
          <Slider
            label="Shadow"
            min={0}
            max={48}
            value={design.shadow}
            onChange={(n) => setDesign((d) => ({ ...d, shadow: n }))}
          />
          {design.colors.borderMode === "gradient" && (
            <Slider
              label="Border gradient angle"
              min={0}
              max={360}
              value={design.layout.borderGradientAngle}
              onChange={(n) =>
                setDesign((d) => ({
                  ...d,
                  layout: { ...d.layout, borderGradientAngle: n },
                }))
              }
            />
          )}
        </DesignerSection>
      </div>
    </aside>
  );
}
