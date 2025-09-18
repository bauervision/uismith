"use client";
import React from "react";
import type { NavbarDesign } from "@/lib/design/navbar";
import { DesignerSection } from "@/components/designer/DesignerSection";
import { Toggle } from "@/components/designer/Toggle";

export default function NavbarStructurePanel({
  design,
  setDesign,
}: {
  design: NavbarDesign;
  setDesign: React.Dispatch<React.SetStateAction<NavbarDesign>>;
}) {
  const updateItem = (i: number, v: string) =>
    setDesign((d) => {
      const next = [...d.structure.navItems];
      next[i] = v;
      return { ...d, structure: { ...d.structure, navItems: next } };
    });

  const addItem = () =>
    setDesign((d) => ({
      ...d,
      structure: {
        ...d.structure,
        navItems: [...d.structure.navItems, "New item"],
      },
    }));

  const removeItem = (i: number) =>
    setDesign((d) => ({
      ...d,
      structure: {
        ...d.structure,
        navItems: d.structure.navItems.filter((_, idx) => idx !== i),
      },
    }));

  return (
    <aside className="h-full border-l border-white/10 bg-slate-900/60 shadow-none">
      <div className="p-4 h-full overflow-auto">
        <h2 className="text-sm font-semibold mb-3">Structure</h2>
        <DesignerSection title="">
          <Toggle
            label="Brand"
            value={design.structure.showBrand}
            onChange={(v) =>
              setDesign((d) => ({
                ...d,
                structure: { ...d.structure, showBrand: v },
              }))
            }
          />
          <Toggle
            label="Desktop nav"
            value={design.structure.showDesktopNav}
            onChange={(v) =>
              setDesign((d) => ({
                ...d,
                structure: { ...d.structure, showDesktopNav: v },
              }))
            }
          />
          <Toggle
            label="Actions"
            value={design.structure.showActions}
            onChange={(v) =>
              setDesign((d) => ({
                ...d,
                structure: { ...d.structure, showActions: v },
              }))
            }
          />
          <Toggle
            label="Hamburger (mobile)"
            value={design.structure.showHamburger}
            onChange={(v) =>
              setDesign((d) => ({
                ...d,
                structure: { ...d.structure, showHamburger: v },
              }))
            }
          />
        </DesignerSection>

        <DesignerSection title="Nav items">
          <div className="space-y-2">
            {design.structure.navItems.map((it, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={it}
                  onChange={(e) => updateItem(i, e.target.value)}
                  className="flex-1 bg-slate-800/70 border border-white/10 rounded px-2 py-1 text-sm"
                />
                <button
                  className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600"
                  onClick={() => removeItem(i)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600"
              onClick={addItem}
            >
              Add item
            </button>
          </div>
        </DesignerSection>

        <DesignerSection title="Actions">
          <label className="block text-sm mb-2">
            <div className="text-[11px] text-slate-400 mb-1">Primary CTA</div>
            <input
              value={design.structure.primaryCta}
              onChange={(e) =>
                setDesign((d) => ({
                  ...d,
                  structure: { ...d.structure, primaryCta: e.target.value },
                }))
              }
              className="w-full bg-slate-800/70 border border-white/10 rounded px-2 py-1"
            />
          </label>
          <label className="block text-sm">
            <div className="text-[11px] text-slate-400 mb-1">Secondary CTA</div>
            <input
              value={design.structure.secondaryCta}
              onChange={(e) =>
                setDesign((d) => ({
                  ...d,
                  structure: { ...d.structure, secondaryCta: e.target.value },
                }))
              }
              className="w-full bg-slate-800/70 border border-white/10 rounded px-2 py-1"
            />
          </label>
        </DesignerSection>
      </div>
    </aside>
  );
}
