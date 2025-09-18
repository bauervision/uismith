export type StyleToken<T> = { base: T };

export interface NavbarStructure {
  showBrand: boolean;
  showDesktopNav: boolean;
  showActions: boolean;
  showHamburger: boolean;
  navItems: string[];
  primaryCta: string;
  secondaryCta: string;
}

export interface NavbarLayout {
  height: number; // px
  paddingX: number; // px
  gap: number; // px between items
  borderWidth: number; // px
  radiusMode: "uniform" | "custom";
  radius: number; // uniform
  radiusTL: number;
  radiusTR: number;
  radiusBR: number;
  radiusBL: number;
  borderGradientAngle: number;
  shadow: number; // 0..48 (reuse your shadow mapping)
  mobileMenu: MobileMenuLayout;
}

export interface NavbarColors {
  bg: string;
  fg: string;
  accent: string;
  borderMode: "solid" | "gradient";
  border: string;
  borderGradStart: string;
  borderGradEnd: string;
  titleFg: string; // brand text
  bodyFg: string; // links
  footerBg: string; // mobile menu bg (we'll reuse)
}

export interface NavbarDesign {
  name: string;
  structure: NavbarStructure;
  layout: NavbarLayout;
  colors: NavbarColors;
}

export interface MobileMenuLayout {
  align: "left" | "right";
  widthMode: "full" | "contextual";
  contextualWidth: number; // px when widthMode === "contextual"

  /** Hover/tap affordance on menu items */
  hoverEffect: "none" | "fade" | "scale" | "scaleFade";

  /** Color + radii belong to menu sheet itself */
  bg: string;

  radiusMode: "uniform" | "custom";
  radius: number;
  radiusTL: number;
  radiusTR: number;
  radiusBR: number;
  radiusBL: number;

  /** Hamburger icon options */
  hamburgerVariant: "bars" | "dots" | "roundedBars";
  hamburgerThickness: number; // px (1..4 is plenty)
}

export const defaultNavbarDesign: NavbarDesign = {
  name: "CoolNavbar",
  structure: {
    showBrand: true,
    showDesktopNav: true,
    showActions: true,
    showHamburger: true,
    navItems: ["Docs", "Components", "Changelog"],
    primaryCta: "Get started",
    secondaryCta: "Sign in",
  },
  layout: {
    height: 56,
    paddingX: 16,
    gap: 12,
    borderWidth: 1,
    radiusMode: "uniform",
    radius: 12,
    radiusTL: 12,
    radiusTR: 12,
    radiusBR: 12,
    radiusBL: 12,
    borderGradientAngle: 90,
    shadow: 18,
    mobileMenu: {
      align: "left",
      widthMode: "full",
      contextualWidth: 320,
      hoverEffect: "none",
      bg: "rgba(2,6,23,0.6)",
      radiusMode: "uniform",
      radius: 12,
      radiusTL: 12,
      radiusTR: 12,
      radiusBR: 12,
      radiusBL: 12,
      hamburgerVariant: "bars",
      hamburgerThickness: 2,
    },
  },
  colors: {
    bg: "#0f172a",
    fg: "#e2e8f0",
    accent: "#22c55e",
    borderMode: "solid",
    border: "#334155",
    borderGradStart: "#22c55e",
    borderGradEnd: "#06b6d4",
    titleFg: "#f8fafc",
    bodyFg: "#cbd5e1",
    footerBg: "rgba(2,6,23,0.6)", // mobile sheet bg
  },
};
