// app/designer/_registry.tsx
"use client";
import * as React from "react";
import type { UISmithTheme } from "@/lib/theme";
import type { DesignsBySlug, DesignerSlug, Registry } from "./_designerTypes";

// Panels / Previews
import LayoutPanel from "@/components/designer/panels/LayoutPanel";
import StructurePanel from "@/components/designer/panels/StructurePanel";
import NavbarLayoutPanel from "@/components/designer/panels/navbar/NavbarLayoutPanel";
import NavbarStructurePanel from "@/components/designer/panels/navbar/NavbarStructurePanel";
import DialogPreview from "@/components/preview/DialogPreview";
import NavbarPreview from "@/components/preview/NavbarPreview";
import ButtonLayoutPanel from "@/components/designer/panels/button/ButtonLayoutPanel";
import ButtonStructurePanel from "@/components/designer/panels/button/ButtonStructurePanel";
import SheetLayoutPanel from "@/components/designer/panels/sheet/SheetLayoutPanel";
import SheetStructurePanel from "@/components/designer/panels/sheet/SheetStructurePanel";
import MiniButton from "@/components/mini/MiniButton";
import MiniSheet from "@/components/mini/MiniSheet";

type LeftProps<K extends DesignerSlug> = {
  design: DesignsBySlug[K];
  setDesign: React.Dispatch<React.SetStateAction<DesignsBySlug[K]>>;
};
type RightProps<K extends DesignerSlug> = LeftProps<K>;
type CenterProps<K extends DesignerSlug> = {
  design: DesignsBySlug[K];
  theme: UISmithTheme;
};

type Entry<K extends DesignerSlug> = {
  left: React.FC<LeftProps<K>>;
  right: React.FC<RightProps<K>>;
  center: React.FC<CenterProps<K>>;
  centerClass?: string; // layout tweak for center column
  exportKind: "dialog" | "navbar"; // ExportToolbar limitation
};

export const REGISTRY: Registry = {
  dialog: {
    left: (p) => <LayoutPanel design={p.design} setDesign={p.setDesign} />,
    right: (p) => <StructurePanel design={p.design} setDesign={p.setDesign} />,
    center: (p) => <DialogPreview design={p.design} />,
    centerClass: "flex items-center justify-center",
    exportKind: "dialog",
  },
  navbar: {
    left: (p) => (
      <NavbarLayoutPanel design={p.design} setDesign={p.setDesign} />
    ),
    right: (p) => (
      <NavbarStructurePanel design={p.design} setDesign={p.setDesign} />
    ),
    center: (p) => <NavbarPreview design={p.design} />,
    exportKind: "navbar",
  },
  button: {
    left: (p) => (
      <ButtonLayoutPanel design={p.design} setDesign={p.setDesign} />
    ),
    right: (p) => (
      <ButtonStructurePanel design={p.design} setDesign={p.setDesign} />
    ),
    center: (p) => <MiniButton theme={p.theme} design={p.design} />,
    centerClass: "flex items-center justify-center",
    exportKind: "dialog",
  },
  sheet: {
    left: (p) => <SheetLayoutPanel design={p.design} setDesign={p.setDesign} />,
    right: (p) => (
      <SheetStructurePanel design={p.design} setDesign={p.setDesign} />
    ),
    center: (p) => <MiniSheet theme={p.theme} design={p.design} />,
    centerClass: "flex items-center justify-center",
    exportKind: "dialog",
  },
};
