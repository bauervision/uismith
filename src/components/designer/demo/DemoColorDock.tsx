"use client";

import React from "react";
import ColorDockBar from "@/components/designer/panels/ColorDockBar";
import type { DialogDesign } from "@/lib/design/dialog";
import { defaultDialogDesign } from "@/lib/design/dialog";

export default function DemoColorDock() {
  const [open, setOpen] = React.useState(true);

  const [design, setDesign] = React.useState<DialogDesign>(() => ({
    ...defaultDialogDesign,
    colors: {
      ...defaultDialogDesign.colors,
      bg: "#0b1220",
      fg: "#e6edf6",
      accent: "#60a5fa",
      border: "#253047",
      borderMode: "solid",
      borderGradStart: "#60a5fa",
      borderGradEnd: "#22d3ee",
      titleFg: "#e6edf6",
      bodyFg: "#b9c2d0",
      footerBg: "#0e1626",
      // keep titleBg from default unless you want to override it here
    },
  }));

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-3 left-3 z-[55] rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm hover:bg-black/60"
        aria-expanded={open}
        aria-controls="uismith-colordock"
      >
        {open ? "Hide Colors" : "Show Colors"}
      </button>

      <div
        id="uismith-colordock"
        className={`fixed left-0 right-0 bottom-0 z-[50] transition-transform duration-200 ${
          open ? "translate-y-0" : "translate-y-[calc(100%_-_3rem)]"
        }`}
      >
        <ColorDockBar design={design} setDesign={setDesign} />
      </div>
    </>
  );
}
