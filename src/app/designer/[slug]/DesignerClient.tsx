"use client";

import React, { useEffect, useRef, useState } from "react";
import { defaultDialogDesign, type DialogDesign } from "@/lib/design/dialog";
import type { UISmithTheme } from "@/lib/theme"; // ← from your /lib/theme.ts
import ExportToolbar from "@/components/designer/ExportToolbar";
import LayoutPanel from "@/components/designer/panels/LayoutPanel";
import StructurePanel from "@/components/designer/panels/StructurePanel";
import DialogPreview from "@/components/preview/DialogPreview";
import ColorDockBar from "@/components/designer/panels/ColorDockBar";

export default function DesignerClient({ slug }: { slug: string }) {
  const [design, setDesign] = useState<DialogDesign>(defaultDialogDesign);
  const appliedTheme = useRef(false);

  // Inject Home theme colors on first mount
  useEffect(() => {
    if (appliedTheme.current) return;
    appliedTheme.current = true;

    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("uismith:theme")
          : null;
      if (!raw) return;
      const theme = JSON.parse(raw) as UISmithTheme;

      setDesign((d) => ({
        ...d,
        colors: {
          ...d.colors,
          bg: theme.bg,
          fg: theme.fg,
          accent: theme.accent,
          border: theme.border,
          titleFg: theme.titleFg,
          bodyFg: theme.bodyFg,
          footerBg: theme.footerBg,
          // If user happens to be in gradient mode, seed start color from theme.border
          borderGradStart: d.colors.borderGradStart ?? theme.border,
        },
      }));
    } catch {
      // ignore parse errors
    }
  }, []);

  return (
    <div className="relative">
      <ExportToolbar design={design} />
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div className="h-[calc(100vh-56px-48px-112px)] overflow-hidden">
          <div className="grid h-full grid-cols-[300px_minmax(0,1fr)_300px] gap-0">
            <div className="h-full">
              <div className="h-full overflow-auto">
                <LayoutPanel design={design} setDesign={setDesign} />
              </div>
            </div>

            <div className="h-full min-w-0 flex items-center justify-center">
              <DialogPreview design={design} />
            </div>

            <div className="h-full">
              <div className="h-full overflow-auto">
                <StructurePanel design={design} setDesign={setDesign} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ColorDockBar design={design} setDesign={setDesign} />
    </div>
  );
}
