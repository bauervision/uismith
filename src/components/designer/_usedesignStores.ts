"use client";
import * as React from "react";

import { defaultDialogDesign, type DialogDesign } from "@/lib/design/dialog";
import { defaultNavbarDesign, type NavbarDesign } from "@/lib/design/navbar";
import { defaultButtonDesign, type ButtonDesign } from "@/lib/design/button";
import { defaultSheetDesign, type SheetDesign } from "@/lib/design/sheet";

export type DesignStores = {
  dialog: [DialogDesign, React.Dispatch<React.SetStateAction<DialogDesign>>];
  navbar: [NavbarDesign, React.Dispatch<React.SetStateAction<NavbarDesign>>];
  button: [ButtonDesign, React.Dispatch<React.SetStateAction<ButtonDesign>>];
  sheet: [SheetDesign, React.Dispatch<React.SetStateAction<SheetDesign>>];
};

type Seed = {
  padding?: number; // extend with radius/shadow later
};

// Safely apply a numeric padding seed to either `padding` or `paddingX`,
// supporting both number and token-shaped fields (e.g., { value: number, ... }).
function applyPaddingSeed<T extends { layout?: any }>(
  base: T,
  seed?: number
): T {
  if (typeof seed !== "number" || !base?.layout) return base;

  const nextLayout: any = { ...base.layout };

  const setField = (key: "padding" | "paddingX") => {
    if (!(key in nextLayout)) return;
    const curr = nextLayout[key];
    if (typeof curr === "number") {
      nextLayout[key] = seed;
    } else if (curr && typeof curr === "object") {
      // token-like
      if ("value" in curr && typeof (curr as any).value === "number") {
        nextLayout[key] = { ...curr, value: seed };
      } else {
        // fallback: replace with number (last resort)
        nextLayout[key] = seed;
      }
    }
  };

  setField("padding");
  setField("paddingX"); // navbar

  return { ...(base as any), layout: nextLayout } as T;
}

export function useDesignStores(seed?: Seed): DesignStores {
  const dialog = React.useState<DialogDesign>(
    () =>
      applyPaddingSeed(
        defaultDialogDesign as any,
        seed?.padding
      ) as DialogDesign
  );

  const navbar = React.useState<NavbarDesign>(
    () =>
      applyPaddingSeed(
        defaultNavbarDesign as any,
        seed?.padding
      ) as NavbarDesign
  );

  const button = React.useState<ButtonDesign>(
    () =>
      applyPaddingSeed(
        defaultButtonDesign as any,
        seed?.padding
      ) as ButtonDesign
  );

  const sheet = React.useState<SheetDesign>(
    () =>
      applyPaddingSeed(defaultSheetDesign as any, seed?.padding) as SheetDesign
  );

  return { dialog, navbar, button, sheet };
}
