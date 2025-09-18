"use client";
import React from "react";
import type { NavbarDesign } from "@/lib/design/navbar";
import { DesignerSection } from "@/components/designer/DesignerSection";
import { Slider } from "@/components/designer/Slider";
import { Toggle } from "@/components/designer/Toggle";

export default function NavbarLayoutPanel({
  design,
  setDesign,
}: {
  design: NavbarDesign;
  setDesign: React.Dispatch<React.SetStateAction<NavbarDesign>>;
}) {
  const isGradient = design.colors.borderMode === "gradient";
  const mm = design.layout.mobileMenu;

  const setMM = (patch: Partial<typeof mm>) =>
    setDesign((d) => ({
      ...d,
      layout: { ...d.layout, mobileMenu: { ...d.layout.mobileMenu, ...patch } },
    }));

  return (
    <aside className="h-full border-r border-white/10 bg-slate-900/60 shadow-none">
      <div className="p-4 h-full overflow-auto">
        <h2 className="text-sm font-semibold mb-3">Layout & Shape</h2>

        <DesignerSection title="">
          <Slider
            label="Height"
            min={44}
            max={80}
            value={design.layout.height}
            onChange={(n) =>
              setDesign((d) => ({ ...d, layout: { ...d.layout, height: n } }))
            }
          />
          <Slider
            label="Padding X"
            min={8}
            max={40}
            value={design.layout.paddingX}
            onChange={(n) =>
              setDesign((d) => ({ ...d, layout: { ...d.layout, paddingX: n } }))
            }
          />
          <Slider
            label="Gap"
            min={6}
            max={28}
            value={design.layout.gap}
            onChange={(n) =>
              setDesign((d) => ({ ...d, layout: { ...d.layout, gap: n } }))
            }
          />
          <Slider
            label="Border width"
            min={0}
            max={4}
            value={design.layout.borderWidth}
            onChange={(n) =>
              setDesign((d) => ({
                ...d,
                layout: { ...d.layout, borderWidth: n },
              }))
            }
          />

          <Toggle
            label="Uniform radius"
            value={design.layout.radiusMode === "uniform"}
            onChange={(uniform) =>
              setDesign((d) => ({
                ...d,
                layout: {
                  ...d.layout,
                  radiusMode: uniform ? "uniform" : "custom",
                },
              }))
            }
          />

          {design.layout.radiusMode === "uniform" ? (
            <Slider
              label="Border radius"
              min={0}
              max={48}
              value={design.layout.radius}
              onChange={(n) =>
                setDesign((d) => ({ ...d, layout: { ...d.layout, radius: n } }))
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Slider
                label="Top-left"
                min={0}
                max={64}
                value={design.layout.radiusTL}
                onChange={(n) =>
                  setDesign((d) => ({
                    ...d,
                    layout: { ...d.layout, radiusTL: n },
                  }))
                }
              />
              <Slider
                label="Top-right"
                min={0}
                max={64}
                value={design.layout.radiusTR}
                onChange={(n) =>
                  setDesign((d) => ({
                    ...d,
                    layout: { ...d.layout, radiusTR: n },
                  }))
                }
              />
              <Slider
                label="Bottom-right"
                min={0}
                max={64}
                value={design.layout.radiusBR}
                onChange={(n) =>
                  setDesign((d) => ({
                    ...d,
                    layout: { ...d.layout, radiusBR: n },
                  }))
                }
              />
              <Slider
                label="Bottom-left"
                min={0}
                max={64}
                value={design.layout.radiusBL}
                onChange={(n) =>
                  setDesign((d) => ({
                    ...d,
                    layout: { ...d.layout, radiusBL: n },
                  }))
                }
              />
            </div>
          )}

          {isGradient && (
            <Slider
              label="Border gradient angle"
              min={0}
              max={360}
              value={design.layout.borderGradientAngle}
              onChange={(n) =>
                setDesign((d) => ({
                  ...d,
                  layout: { ...d.layout, borderGradientAngle: n },
                }))
              }
            />
          )}

          <Slider
            label="Shadow"
            min={0}
            max={48}
            value={design.layout.shadow}
            onChange={(n) =>
              setDesign((d) => ({ ...d, layout: { ...d.layout, shadow: n } }))
            }
          />
        </DesignerSection>

        {/* NEW: Mobile menu section */}
        <h3 className="text-sm font-semibold mt-6 mb-3">Mobile menu</h3>
        <DesignerSection title="">
          {/* Alignment */}
          <div className="text-sm">
            <div className="text-[11px] text-slate-400 mb-1">Alignment</div>
            <div className="flex gap-2">
              {(["left", "right"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setMM({ align: a })}
                  className={`px-2 py-1 rounded border text-xs ${
                    mm.align === a
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Width mode */}
          <div className="text-sm">
            <div className="text-[11px] text-slate-400 mb-1">Width</div>
            <div className="flex gap-2">
              {(["full", "contextual"] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setMM({ widthMode: w })}
                  className={`px-2 py-1 rounded border text-xs ${
                    mm.widthMode === w
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {mm.widthMode === "contextual" && (
            <Slider
              label="Contextual width"
              min={220}
              max={420}
              value={mm.contextualWidth}
              onChange={(n) => setMM({ contextualWidth: n })}
            />
          )}

          {/* Hover effect */}
          <div className="text-sm">
            <div className="text-[11px] text-slate-400 mb-1">Hover effect</div>
            <div className="flex flex-wrap gap-2">
              {(["none", "fade", "scale", "scaleFade"] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setMM({ hoverEffect: h })}
                  className={`px-2 py-1 rounded border text-xs ${
                    mm.hoverEffect === h
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Background color (sheet) */}
          <label className="block">
            <div className="text-[11px] text-slate-400 mb-1">
              Menu background
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={mm.bg}
                onChange={(e) => setMM({ bg: e.target.value })}
                className="h-7 w-7 rounded border border-white/10 bg-transparent"
              />
              <input
                value={mm.bg}
                onChange={(e) => setMM({ bg: e.target.value })}
                className="h-9 w-full bg-slate-800/70 border border-white/10 rounded px-2 text-sm"
              />
            </div>
          </label>

          {/* Radius controls for the sheet */}
          <Toggle
            label="Uniform menu radius"
            value={mm.radiusMode === "uniform"}
            onChange={(uniform) =>
              setMM({ radiusMode: uniform ? "uniform" : "custom" })
            }
          />
          {mm.radiusMode === "uniform" ? (
            <Slider
              label="Menu radius"
              min={0}
              max={32}
              value={mm.radius}
              onChange={(n) => setMM({ radius: n })}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Slider
                label="Menu TL"
                min={0}
                max={48}
                value={mm.radiusTL}
                onChange={(n) => setMM({ radiusTL: n })}
              />
              <Slider
                label="Menu TR"
                min={0}
                max={48}
                value={mm.radiusTR}
                onChange={(n) => setMM({ radiusTR: n })}
              />
              <Slider
                label="Menu BL"
                min={0}
                max={48}
                value={mm.radiusBL}
                onChange={(n) => setMM({ radiusBL: n })}
              />
              <Slider
                label="Menu BR"
                min={0}
                max={48}
                value={mm.radiusBR}
                onChange={(n) => setMM({ radiusBR: n })}
              />
            </div>
          )}

          {/* Hamburger options */}
          <div className="text-sm">
            <div className="text-[11px] text-slate-400 mb-1">
              Hamburger style
            </div>
            <div className="flex gap-2">
              {(["bars", "roundedBars", "dots"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setMM({ hamburgerVariant: v })}
                  className={`px-2 py-1 rounded border text-xs ${
                    mm.hamburgerVariant === v
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <Slider
            label="Hamburger thickness"
            min={1}
            max={4}
            value={mm.hamburgerThickness}
            onChange={(n) => setMM({ hamburgerThickness: n })}
          />
        </DesignerSection>
      </div>
    </aside>
  );
}
