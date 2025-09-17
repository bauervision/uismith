"use client";

import React, { useState } from "react";
import { defaultDialogDesign, type DialogDesign } from "@/lib/design/dialog";
import ExportToolbar from "@/components/designer/ExportToolbar";
import LayoutPanel from "@/components/designer/panels/LayoutPanel";
import StructurePanel from "@/components/designer/panels/StructurePanel";
import DialogPreview from "@/components/preview/DialogPreview";
import ColorDockBar from "@/components/designer/panels/ColorDockBar";

export default function DesignerClient({ slug }: { slug: string }) {
  const [design, setDesign] = useState<DialogDesign>(defaultDialogDesign);

  return (
    <div className="relative">
      {/* Full-width toolbar (48px high) */}
      <ExportToolbar design={design} />

      {/* Full-bleed workspace, hard-capped to viewport without scroll */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen ">
        {/* HEIGHT BUDGET: 100vh - navbar(56px) - toolbar(48px) - dock(96px) */}
        <div className="h-[calc(100vh-56px-48px-96px)] overflow-hidden">
          <div className="grid h-full grid-cols-[300px_minmax(0,1fr)_300px] gap-4">
            {/* LEFT panel: internal scroll only */}
            <div className="h-full">
              <div className="h-full overflow-auto">
                <LayoutPanel design={design} setDesign={setDesign} />
              </div>
            </div>

            {/* CENTER: preview fills available space (no scroll) */}
            <div className="h-full w-full flex items-center justify-center">
              <DialogPreview design={design} />
            </div>

            {/* RIGHT panel: internal scroll only */}
            <div className="h-full">
              <div className="h-full overflow-auto">
                <StructurePanel design={design} setDesign={setDesign} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed, full-width Color Dock at the bottom (96px high) */}
      <ColorDockBar design={design} setDesign={setDesign} />
    </div>
  );
}
