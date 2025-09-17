// /app/designer/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { defaultDialogDesign, DialogDesign } from "@/lib/design/dialog";
import { mapShadowToBoxShadow } from "@/lib/design/shadow";
import { Slider } from "@/components/designer/Slider";
import { Toggle } from "@/components/designer/Toggle";
import { ColorInput } from "@/components/designer/ColorInput";
import { buildTwoFileDialog, buildTestDialogUsage } from "@/lib/export/dialog";
import { downloadZip } from "@/lib/download/zip";
import DialogSidebar from "@/components/designer/DialogSidebar";

export default function Page() {
  const [design, setDesign] = useState<DialogDesign>(defaultDialogDesign);
  const [includeTest, setIncludeTest] = useState(true);
  const [nextClient, setNextClient] = useState(true);

  const cssVars = useMemo(() => {
    return {
      // core tokens
      maxWidth: `${design.layout.maxWidth.base}px`,
      padding: `${design.layout.padding.base}px`,
      gap: `${design.layout.gap}px`,
      radius: `${design.layout.radius}px`,
      borderWidth: `${design.layout.borderWidth}px`,
      bg: design.colors.bg,
      fg: design.colors.fg,
      border: design.colors.border,
      titleBg: design.colors.titleBg,
      titleFg: design.colors.titleFg,
      bodyFg: design.colors.bodyFg,
      footerBg: design.colors.footerBg,
      shadow: mapShadowToBoxShadow(design.shadow),
    };
  }, [design]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl p-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Sidebar controls */}
        <aside className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg">
          <h1 className="text-xl font-semibold mb-4">UISmith — Dialog</h1>

          <DialogSidebar design={design} setDesign={setDesign} />
        </aside>

        {/* Preview */}
        <main className="rounded-2xl border border-white/10 bg-slate-900/30 p-6 min-h-[420px] relative">
          <div className="grid place-items-center h-full p-6">
            <div
              className="w-full"
              style={{ maxWidth: cssVars.maxWidth as string }}
            >
              <div
                className="flex flex-col"
                style={{
                  background: cssVars.bg as string,
                  color: cssVars.fg as string,
                  borderRadius: cssVars.radius as string,
                  padding: cssVars.padding as string,
                  gap: cssVars.gap as string,
                  boxShadow: cssVars.shadow as string,
                  border: `${cssVars.borderWidth} solid ${cssVars.border}`,
                }}
              >
                {design.structure.showTitle && (
                  <div
                    className="flex items-center justify-between"
                    style={{
                      background: cssVars.titleBg as string,
                      color: design.colors.titleFg,
                    }}
                  >
                    <div
                      style={{
                        fontSize: design.type.titleSize,
                        fontWeight: design.type.titleWeight,
                      }}
                    >
                      Dialog title
                    </div>
                    {design.structure.showClose && (
                      <button
                        className="rounded-md px-2 py-1 hover:bg-white/10"
                        aria-label="Close"
                        style={{ color: cssVars.fg as string }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}

                {design.structure.showBody && (
                  <div
                    className="text-sm"
                    style={{ color: cssVars.bodyFg as string }}
                  >
                    This is the body of your dialog. We’ll wire a11y + motion
                    after export generator.
                  </div>
                )}

                {design.structure.showFooter && (
                  <div
                    className="flex items-center justify-end gap-3"
                    style={{ background: cssVars.footerBg as string }}
                  >
                    {design.structure.footerButtons.map((b, i) => (
                      <button
                        key={i}
                        className="px-4 py-2 rounded-full font-semibold"
                        style={{
                          background: i === 0 ? "#22c55e" : "transparent",
                          color: i === 0 ? "#0b0f17" : (cssVars.fg as string),
                          border:
                            i === 0
                              ? "none"
                              : `1px solid ${cssVars.fg as string}33`,
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Export actions Two-file ZIP section */}

              <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <header className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">
                    Export (.tsx + .module.css
                    {includeTest ? " + .test.tsx" : ""})
                  </h2>
                  <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={nextClient}
                        onChange={(e) => setNextClient(e.target.checked)}
                      />
                      Next.js: add <code>'use client'</code>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeTest}
                        onChange={(e) => setIncludeTest(e.target.checked)}
                      />
                      Include test file
                    </label>
                  </div>
                </header>

                <button
                  className="px-3 py-1.5 rounded-md bg-emerald-500 text-slate-900 font-semibold"
                  onClick={async () => {
                    const files = buildTwoFileDialog(design, { nextClient });
                    if (includeTest)
                      files.push(buildTestDialogUsage(design, { nextClient }));
                    await downloadZip(design.name || "UISmithDialog", files);
                  }}
                >
                  Download ZIP
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
