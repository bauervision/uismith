// /components/designer/panels/StructurePanel.tsx
"use client";
import React from "react";
import type { DialogDesign } from "@/lib/design/dialog";
import { DesignerSection } from "@/components/designer/DesignerSection";
import { Toggle } from "@/components/designer/Toggle";

export default function StructurePanel({
  design,
  setDesign,
}: {
  design: DialogDesign;
  setDesign: React.Dispatch<React.SetStateAction<DialogDesign>>;
}) {
  return (
    <aside className="h-full  border border-white/10 bg-slate-900/60 shadow-lg">
      <div className="p-4 h-full overflow-auto">
        <h2 className="text-sm font-semibold mb-3">Structure</h2>
        <DesignerSection title="">
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
      </div>
    </aside>
  );
}
