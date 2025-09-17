// /lib/design/dialog.ts
export type Breakpoint = "sm" | "md" | "lg";
export type StyleToken<T> = { base: T; sm?: T; md?: T; lg?: T };
export type RadiusMode = "uniform" | "custom";
export type BorderMode = "solid" | "gradient";

export interface DialogStructure {
  showTitle: boolean;
  showBody: boolean;
  showFooter: boolean;
  showClose: boolean;
  footerButtons: string[];
}

export interface DialogLayout {
  maxWidth: StyleToken<number>;
  padding: StyleToken<number>;
  gap: number;
  radiusMode: RadiusMode;
  radius: number;
  radiusTL: number;
  radiusTR: number;
  radiusBR: number;
  radiusBL: number;
  borderWidth: number;
  borderGradientAngle: number;
}

export interface DialogColors {
  bg: string;
  fg: string;
  accent: string;
  borderMode: BorderMode;
  border: string;
  borderGradStart: string;
  borderGradEnd: string;
  titleBg: string;
  titleFg: string;
  bodyFg: string;
  footerBg: string;
}

export interface DialogType {
  titleSize: number;
  titleWeight: number; // 400–800
}

export interface DialogA11y {
  closeOnEsc: boolean;
  closeOnOverlay: boolean;
  initialFocus: "auto" | "close" | "firstButton";
}

export interface DialogDesign {
  name: string; // ComponentName (e.g., NiceDialog)
  structure: DialogStructure;
  layout: DialogLayout;
  colors: DialogColors;
  type: DialogType;
  shadow: number; // slider 0–48
  a11y: DialogA11y;
}

export const defaultDialogDesign: DialogDesign = {
  name: "NiceDialog",
  structure: {
    showTitle: true,
    showBody: true,
    showFooter: true,
    showClose: true,
    footerButtons: ["Primary", "Secondary"],
  },
  layout: {
    maxWidth: { base: 560 },
    padding: { base: 20 },
    gap: 16,
    radiusMode: "uniform",
    radius: 16,
    radiusTL: 16,
    radiusTR: 16,
    radiusBR: 16,
    radiusBL: 16,
    borderWidth: 1,
    borderGradientAngle: 45,
  },
  colors: {
    bg: "#0f172a",
    fg: "#e2e8f0",
    accent: "#22c55e",

    borderMode: "solid",
    border: "#334155",
    borderGradStart: "#22c55e",
    borderGradEnd: "#06b6d4",

    titleBg: "transparent",
    titleFg: "#f8fafc",
    bodyFg: "#cbd5e1",
    footerBg: "transparent",
  },
  type: {
    titleSize: 18,
    titleWeight: 600,
  },
  shadow: 24,
  a11y: {
    closeOnEsc: true,
    closeOnOverlay: true,
    initialFocus: "auto",
  },
};
