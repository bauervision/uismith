// /app/designer/page.tsx
"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants, Easing } from "framer-motion";
import { defaultDialogDesign, DialogDesign } from "@/lib/design/dialog";
import { mapShadowToBoxShadow } from "@/lib/design/shadow";
import DialogSidebar from "@/components/designer/DialogSidebar";

/* ---------- Motion setup (typed) ---------- */

const easeSoft: Easing = [0.2, 0.8, 0.2, 1];
const easeSnap: Easing = [0.16, 1, 0.3, 1];

const sidebarV: Variants = {
  hidden: { opacity: 0, x: -16, scale: 0.98 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeSoft },
  },
};

const previewShellV: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeSnap },
  },
};

const dialogCardV: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: easeSoft, delay: 0.05 },
  },
};

const exportPanelV: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeSoft, delay: 0.15 },
  },
};

/* ---------- Page ---------- */

export default function Page() {
  const [design, setDesign] = useState<DialogDesign>(defaultDialogDesign);
  const [includeTest, setIncludeTest] = useState(true);
  const [nextClient, setNextClient] = useState(true);

  const prefersReducedMotion = useReducedMotion();
  const initialVariant = prefersReducedMotion ? "show" : "hidden";
  const animateVariant = "show";

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
    <div className="relative min-h-screen">
      <AuroraBgFixed />

      <div className="relative z-10 mx-auto max-w-7xl p-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Sidebar controls */}
        <motion.aside
          variants={sidebarV}
          initial={initialVariant}
          animate={animateVariant}
          className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg will-change-transform"
          style={{
            boxShadow:
              "0 0 60px color-mix(in srgb, var(--accent) 10%, transparent)",
          }}
        >
          <h1
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--title-fg)" }}
          >
            UISmith — Dialog
          </h1>
          <DialogSidebar design={design} setDesign={setDesign} />
        </motion.aside>

        {/* Preview */}
        <motion.main
          variants={previewShellV}
          initial={initialVariant}
          animate={animateVariant}
          className="rounded-2xl border border-white/10 bg-slate-900/30 p-6 min-h-[420px] relative will-change-transform"
        >
          <div className="grid place-items-center h-full p-6">
            <div
              className="w-full"
              style={{ maxWidth: cssVars.maxWidth as string }}
            >
              {/* Dialog surface */}
              <motion.div
                variants={dialogCardV}
                initial={initialVariant}
                animate={animateVariant}
                className="flex flex-col will-change-transform"
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
                        style={{
                          color: cssVars.fg as string,
                          minHeight: 32,
                          minWidth: 44,
                        }}
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
                          background: i === 0 ? "var(--accent)" : "transparent",
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
              </motion.div>

              {/* Export actions */}
              <motion.section
                variants={exportPanelV}
                initial={initialVariant}
                animate={animateVariant}
                className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4 will-change-transform"
              >
                <header className="flex items-center justify-between mb-3">
                  <h2
                    className="font-semibold"
                    style={{ color: "var(--title-fg)" }}
                  >
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

                <ExportButton
                  design={design}
                  includeTest={includeTest}
                  nextClient={nextClient}
                />
              </motion.section>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

/* ---------- Extracted export button logic to keep the main tree clean ---------- */
function ExportButton({
  design,
  includeTest,
  nextClient,
}: {
  design: DialogDesign;
  includeTest: boolean;
  nextClient: boolean;
}) {
  const {
    buildTwoFileDialog,
    buildTestDialogUsage,
  } = require("@/lib/export/dialog");
  const { downloadZip } = require("@/lib/download/zip");

  return (
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
  );
}

/* ---------- Full-page aurora background (fixed to viewport) ---------- */
function AuroraBgFixed() {
  return (
    <>
      {/* Base wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 0% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%)," +
            "radial-gradient(900px 500px at 100% 20%, color-mix(in srgb, var(--title-fg) 8%, transparent), transparent 55%)," +
            "radial-gradient(1000px 500px at 50% 100%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%)",
        }}
      />
      {/* Animated blobs */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 aurora-anim"
        style={{
          background:
            "radial-gradient(300px 200px at 15% 20%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 60%)," +
            "radial-gradient(260px 180px at 85% 25%, color-mix(in srgb, var(--title-fg) 16%, transparent), transparent 60%)," +
            "radial-gradient(320px 200px at 50% 90%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 60%)",
          filter: "blur(34px)",
          opacity: 0.9,
        }}
      />
      <style>{`
        .aurora-anim { animation: aurora-move 22s linear infinite; }
        @keyframes aurora-move {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(6px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-anim { animation: none; }
        }
      `}</style>
    </>
  );
}
