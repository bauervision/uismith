// app/designer/_designerTypes.ts (or similar)
import type { UISmithTheme } from "@/lib/theme";
import type { DialogDesign } from "@/lib/design/dialog";
import type { NavbarDesign } from "@/lib/design/navbar";
import type { ButtonDesign } from "@/lib/design/button";
import type { SheetDesign } from "@/lib/design/sheet";

export const VALID_SLUGS = ["dialog", "navbar", "button", "sheet"] as const;
export type DesignerSlug = (typeof VALID_SLUGS)[number];

export type DesignsBySlug = {
  dialog: DialogDesign;
  navbar: NavbarDesign;
  button: ButtonDesign;
  sheet: SheetDesign;
};

export type Store<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type StoresBySlug = { [K in DesignerSlug]: Store<DesignsBySlug[K]> };

export type LeftProps<K extends DesignerSlug> = {
  design: DesignsBySlug[K];
  setDesign: React.Dispatch<React.SetStateAction<DesignsBySlug[K]>>;
};
export type RightProps<K extends DesignerSlug> = LeftProps<K>;
export type CenterProps<K extends DesignerSlug> = {
  design: DesignsBySlug[K];
  theme: UISmithTheme;
};

export type Entry<K extends DesignerSlug> = {
  left: React.FC<LeftProps<K>>;
  right: React.FC<RightProps<K>>;
  center: React.FC<CenterProps<K>>; // <-- compile-time guarantee
  centerClass?: string;
  exportKind: "dialog" | "navbar";
};

export type Registry = { [K in DesignerSlug]: Entry<K> };
