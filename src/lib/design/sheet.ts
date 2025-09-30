export type SheetSide = "left" | "right" | "bottom";
export type SheetWidthMode = "full" | "contextual";
export type SheetRadiusMode = "uniform" | "custom";

export type SheetDesign = {
  layout: {
    side: SheetSide;
    widthMode: SheetWidthMode;
    contextualWidth: number; // px for contextual
    padding: number; // px
    borderWidth: number; // px
    radiusMode: SheetRadiusMode;
    radius: number; // uniform
    radiusTL: number; // custom
    radiusTR: number;
    radiusBR: number;
    radiusBL: number;
    shadow: number; // 0–48
  };
  structure: {
    showHeader: boolean;
    headerTitle: string;
    showClose: boolean;
    showFooter: boolean;
    primaryCta: string;
    secondaryCta: string;
  };
};

export const defaultSheetDesign: SheetDesign = {
  layout: {
    side: "right",
    widthMode: "contextual",
    contextualWidth: 360,
    padding: 16,
    borderWidth: 1,
    radiusMode: "uniform",
    radius: 16,
    radiusTL: 16,
    radiusTR: 16,
    radiusBR: 16,
    radiusBL: 16,
    shadow: 24,
  },
  structure: {
    showHeader: true,
    headerTitle: "Settings",
    showClose: true,
    showFooter: true,
    primaryCta: "Save",
    secondaryCta: "Cancel",
  },
};
