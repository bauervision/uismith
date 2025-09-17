"use client";
import React from "react";
import type { DialogDesign } from "@/lib/design/dialog";
import { Toggle } from "@/components/designer/Toggle";
import { Slider } from "@/components/designer/Slider";
import { ColorInput } from "@/components/designer/ColorInput";
import { DesignerSection } from "@/components/designer/DesignerSection";

export default function DialogSidebar({
  design,
  setDesign,
}: {
  design: DialogDesign;
  setDesign: React.Dispatch<React.SetStateAction<DialogDesign>>;
}) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg">
      <h1 className="text-xl font-semibold mb-4">UISmith — Dialog</h1>

      <DesignerSection title="Structure">
        <Toggle
          label="Title"
          value={design.structure.showTitle}
          onChange={(v) =>
            setDesign((d) => ({
              ...d,
              structure: { ...d.structure, showTitle: v },
            }))
          }
        />
        <Toggle
          label="Body"
          value={design.structure.showBody}
          onChange={(v) =>
            setDesign((d) => ({
              ...d,
              structure: { ...d.structure, showBody: v },
            }))
          }
        />
        <Toggle
          label="Footer"
          value={design.structure.showFooter}
          onChange={(v) =>
            setDesign((d) => ({
              ...d,
              structure: { ...d.structure, showFooter: v },
            }))
          }
        />
        <Toggle
          label="Close icon"
          value={design.structure.showClose}
          onChange={(v) =>
            setDesign((d) => ({
              ...d,
              structure: { ...d.structure, showClose: v },
            }))
          }
        />
      </DesignerSection>

      <DesignerSection title="Layout & Shape">
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
        <Slider
          label="Border radius"
          min={0}
          max={36}
          value={design.layout.radius}
          onChange={(n) =>
            setDesign((d) => ({ ...d, layout: { ...d.layout, radius: n } }))
          }
        />
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
      </DesignerSection>

      <DesignerSection title="Colors">
        <ColorInput
          label="Background"
          value={design.colors.bg}
          onChange={(v) =>
            setDesign((d) => ({ ...d, colors: { ...d.colors, bg: v } }))
          }
        />
        <ColorInput
          label="Foreground"
          value={design.colors.fg}
          onChange={(v) =>
            setDesign((d) => ({ ...d, colors: { ...d.colors, fg: v } }))
          }
        />
        <ColorInput
          label="Border"
          value={design.colors.border}
          onChange={(v) =>
            setDesign((d) => ({ ...d, colors: { ...d.colors, border: v } }))
          }
        />
        <ColorInput
          label="Title fg"
          value={design.colors.titleFg}
          onChange={(v) =>
            setDesign((d) => ({ ...d, colors: { ...d.colors, titleFg: v } }))
          }
        />
        <ColorInput
          label="Body fg"
          value={design.colors.bodyFg}
          onChange={(v) =>
            setDesign((d) => ({ ...d, colors: { ...d.colors, bodyFg: v } }))
          }
        />
        <ColorInput
          label="Footer bg"
          value={design.colors.footerBg}
          onChange={(v) =>
            setDesign((d) => ({ ...d, colors: { ...d.colors, footerBg: v } }))
          }
        />
      </DesignerSection>
    </aside>
  );
}
