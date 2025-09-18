"use client";

import React, { useEffect, useRef, useState } from "react";
import ExportToolbar from "@/components/designer/ExportToolbar";
import ColorDockBar from "@/components/designer/panels/ColorDockBar";

// dialog bits
import { defaultDialogDesign, type DialogDesign } from "@/lib/design/dialog";
import LayoutPanel from "@/components/designer/panels/LayoutPanel";
import StructurePanel from "@/components/designer/panels/StructurePanel";
import DialogPreview from "@/components/preview/DialogPreview";

// navbar bits
import { defaultNavbarDesign, type NavbarDesign } from "@/lib/design/navbar";
import NavbarLayoutPanel from "@/components/designer/panels/navbar/NavbarLayoutPanel";
import NavbarStructurePanel from "@/components/designer/panels/navbar/NavbarStructurePanel";
import NavbarPreview from "@/components/preview/NavbarPreview";
import A11yAlerts from "@/components/designer/A11yAlerts";

type Kind = "dialog" | "navbar";

export default function DesignerClient({ slug }: { slug: string }) {
  const kind: Kind = slug === "navbar" ? "navbar" : "dialog";

  // Keep separate pieces of state so switching routes doesn’t bleed values
  const [dialogDesign, setDialogDesign] =
    useState<DialogDesign>(defaultDialogDesign);
  const [navbarDesign, setNavbarDesign] =
    useState<NavbarDesign>(defaultNavbarDesign);

  // Theme injection (from Home)
  const applied = useRef(false);
  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    try {
      const raw = localStorage.getItem("uismith:theme");
      if (!raw) return;
      const t = JSON.parse(raw) as any;
      setDialogDesign((d) => ({
        ...d,
        colors: {
          ...d.colors,
          bg: t.bg,
          fg: t.fg,
          accent: t.accent,
          border: t.border,
          titleFg: t.titleFg,
          bodyFg: t.bodyFg,
          footerBg: t.footerBg,
        },
      }));
      setNavbarDesign((d) => ({
        ...d,
        colors: {
          ...d.colors,
          bg: t.bg,
          fg: t.fg,
          accent: t.accent,
          border: t.border,
          titleFg: t.titleFg,
          bodyFg: t.bodyFg,
          footerBg: t.footerBg,
        },
      }));
    } catch {}
  }, []);

  // pick active model + setters
  const design = kind === "dialog" ? dialogDesign : navbarDesign;
  const setDesign = (
    kind === "dialog" ? setDialogDesign : setNavbarDesign
  ) as any;

  return (
    <div className="relative">
      {/* Pass kind so we can disable export for navbar for now */}
      <ExportToolbar design={design as any} kind={kind} />

      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div className="h-[calc(100vh-56px-48px-112px)] overflow-hidden">
          <div className="grid h-full grid-cols-[300px_minmax(0,1fr)_300px] gap-0">
            <div className="h-full min-h-0">
              <div className="h-full overflow-auto">
                {kind === "dialog" ? (
                  <LayoutPanel
                    design={design as DialogDesign}
                    setDesign={setDesign}
                  />
                ) : (
                  <NavbarLayoutPanel
                    design={design as NavbarDesign}
                    setDesign={setDesign}
                  />
                )}
              </div>
            </div>

            <div
              className={`h-full min-w-0 ${
                kind === "navbar" ? "" : "flex items-center justify-center"
              }`}
            >
              {kind === "dialog" ? (
                <DialogPreview design={design as DialogDesign} />
              ) : (
                <NavbarPreview design={design as NavbarDesign} />
              )}
            </div>

            <div className="h-full">
              <div className="h-full overflow-auto">
                {kind === "dialog" ? (
                  <StructurePanel
                    design={design as DialogDesign}
                    setDesign={setDesign}
                  />
                ) : (
                  <NavbarStructurePanel
                    design={design as NavbarDesign}
                    setDesign={setDesign}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ColorDockBar design={design as any} setDesign={setDesign} />

      <A11yAlerts
        themeLike={{
          bg: design.colors.bg,
          fg: design.colors.fg,
          titleFg: design.colors.titleFg,
          bodyFg: design.colors.bodyFg,
          accent: design.colors.accent,
          border: design.colors.border,
        }}
      />
    </div>
  );
}
