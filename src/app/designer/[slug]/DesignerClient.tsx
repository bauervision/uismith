// app/designer/DesignerClient.tsx
"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Variants, Easing } from "framer-motion";

import ExportToolbar from "@/components/designer/ExportToolbar";
import ColorDockBar from "@/components/designer/panels/ColorDockBar";

// Dialog bits
import { defaultDialogDesign, type DialogDesign } from "@/lib/design/dialog";
import LayoutPanel from "@/components/designer/panels/LayoutPanel";
import StructurePanel from "@/components/designer/panels/StructurePanel";
import DialogPreview from "@/components/preview/DialogPreview";

// Navbar bits
import { defaultNavbarDesign, type NavbarDesign } from "@/lib/design/navbar";
import NavbarLayoutPanel from "@/components/designer/panels/navbar/NavbarLayoutPanel";
import NavbarStructurePanel from "@/components/designer/panels/navbar/NavbarStructurePanel";
import NavbarPreview from "@/components/preview/NavbarPreview";

// A11y & Motion
import A11yAlerts from "@/components/designer/a11y/A11yAlerts";
import A11yMagnifier, {
  A11yMagnifierHandle,
} from "@/components/designer/a11y/A11yMagnifier";
import {
  MotionSettingsProvider,
  useMotionSettings,
} from "@/app/providers/MotionSettingsProvider";
import MotionConfigPanel from "@/components/designer/MotionConfigDialog";

type Kind = "dialog" | "navbar";

/* ------- Motion variants from settings ------- */
function useVariants() {
  const { reduced, easingValue, durationMult, secs, settings } =
    useMotionSettings();

  const ease = easingValue as Easing;
  const scale = durationMult || 0;
  const t = (ms: number) => secs(ms * scale);

  const initialVariant = reduced ? "show" : "hidden";
  const animateVariant = "show";

  const barV: Variants = {
    hidden: { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0, transition: { duration: t(350), ease } },
  };
  const colLeftV: Variants = {
    hidden: { opacity: 0, x: -16, scale: 0.98 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: t(settings.baseDurationMs + 100), ease },
    },
  };
  const colRightV: Variants = {
    hidden: { opacity: 0, x: 16, scale: 0.98 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: t(settings.baseDurationMs + 100), ease },
    },
  };
  const centerV: Variants = {
    hidden: { opacity: 0, scale: 0.985 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: t(settings.baseDurationMs), ease, delay: t(50) },
    },
  };

  return { initialVariant, animateVariant, barV, colLeftV, colRightV, centerV };
}

/* ---------------- Root wrapper ---------------- */
export default function DesignerClient({ slug }: { slug: string }) {
  return (
    <MotionSettingsProvider>
      <DesignerClientInner slug={slug} />
    </MotionSettingsProvider>
  );
}

/* ---------------- Page ---------------- */
function DesignerClientInner({ slug }: { slug: string }) {
  const kind: Kind = slug === "navbar" ? "navbar" : "dialog";

  const [dialogDesign, setDialogDesign] =
    useState<DialogDesign>(defaultDialogDesign);
  const [navbarDesign, setNavbarDesign] =
    useState<NavbarDesign>(defaultNavbarDesign);

  // apply theme from Home (once)
  const applied = useRef(false);
  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    try {
      const raw = localStorage.getItem("uismith:theme");
      if (!raw) return;
      const t = JSON.parse(raw) as any;
      setDialogDesign((d) => ({
        ...d,
        colors: {
          ...d.colors,
          bg: t.bg,
          fg: t.fg,
          accent: t.accent,
          border: t.border,
          titleFg: t.titleFg,
          bodyFg: t.bodyFg,
          footerBg: t.footerBg,
        },
      }));
      setNavbarDesign((d) => ({
        ...d,
        colors: {
          ...d.colors,
          bg: t.bg,
          fg: t.fg,
          accent: t.accent,
          border: t.border,
          titleFg: t.titleFg,
          bodyFg: t.bodyFg,
          footerBg: t.footerBg,
        },
      }));
    } catch {}
  }, []);

  const design = kind === "dialog" ? dialogDesign : navbarDesign;
  const setDesign = (
    kind === "dialog" ? setDialogDesign : setNavbarDesign
  ) as React.Dispatch<React.SetStateAction<any>>;

  // refs
  const centerRef = useRef<HTMLDivElement | null>(null);
  const magRef = useRef<A11yMagnifierHandle | null>(null);

  // motion
  const { barV, colLeftV, colRightV, centerV, initialVariant, animateVariant } =
    useVariants();

  // motion panel state
  const [motionOpen, setMotionOpen] = useState(false);

  const DOCK_BASE = 124; // current position above ColorDockBar
  const VIEWPORT_CTRL_H = 48; // approximate pill height incl. shadow
  const EXTRA_GAP = 12; // breathing room between the two rows
  const dockBottom =
    kind === "navbar"
      ? DOCK_BASE + VIEWPORT_CTRL_H + EXTRA_GAP // lift dock when navbar controls are present
      : DOCK_BASE;

  return (
    <div className="relative min-h-screen">
      <AuroraBgFixed />

      {/* Top toolbar */}
      <motion.div
        variants={barV}
        initial={initialVariant}
        animate={animateVariant}
        className="relative z-20"
      >
        <ExportToolbar design={design as any} kind={kind} />
      </motion.div>

      {/* Full-width grid */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen z-10">
        <div className="h-[calc(100vh-56px-48px-112px)] overflow-hidden">
          <div className="grid h-full grid-cols-[300px_minmax(0,1fr)_300px] gap-0">
            {/* Left controls */}
            <motion.div
              variants={colLeftV}
              initial={initialVariant}
              animate={animateVariant}
              className="h-full min-h-0 will-change-transform"
            >
              <div className="h-full overflow-auto">
                {kind === "dialog" ? (
                  <LayoutPanel
                    design={design as DialogDesign}
                    setDesign={setDesign}
                  />
                ) : (
                  <NavbarLayoutPanel
                    design={design as NavbarDesign}
                    setDesign={setDesign}
                  />
                )}
              </div>
            </motion.div>

            {/* Center preview */}
            <motion.div
              key={kind}
              ref={centerRef as any}
              variants={centerV}
              initial={initialVariant}
              animate={animateVariant}
              className={`h-full min-w-0 relative overflow-hidden will-change-transform ${
                kind === "navbar" ? "" : "flex items-center justify-center"
              }`}
            >
              {/* A11y magnifier; hide built-in trigger */}
              <A11yMagnifier
                ref={magRef}
                containerRef={centerRef}
                renderTrigger={false}
              />

              {/* Preview */}
              {kind === "dialog" ? (
                <DialogPreview design={design as DialogDesign} />
              ) : (
                <NavbarPreview design={design as NavbarDesign} />
              )}

              {/* Bottom-center dock */}
              <div
                className="absolute inset-x-0 z-[80] pointer-events-none"
                style={{ bottom: dockBottom }}
              >
                <div className="mx-auto w-fit flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => magRef.current?.toggle()}
                    className="rounded-full border px-3 py-1.5 text-xs shadow-sm"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--fg)",
                      background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--bg) 80%, transparent), color-mix(in srgb, var(--bg) 60%, transparent))",
                    }}
                    title="Inspect Accessibility (Alt+I)"
                  >
                    🔎 Inspect Accessibility
                  </button>

                  <button
                    onClick={() => setMotionOpen((v) => !v)}
                    className="rounded-full border px-3 py-1.5 text-xs shadow-sm"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--fg)",
                      background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--bg) 80%, transparent), color-mix(in srgb, var(--bg) 60%, transparent))",
                    }}
                    title="Motion settings"
                  >
                    🎞 Motion
                  </button>
                </div>

                {motionOpen && (
                  <div className="mx-auto mt-2 w-fit pointer-events-auto relative z-[90]">
                    <MotionConfigPanel
                      open={motionOpen}
                      onClose={() => setMotionOpen(false)}
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right controls */}
            <motion.div
              variants={colRightV}
              initial={initialVariant}
              animate={animateVariant}
              className="h-full will-change-transform"
            >
              <div className="h-full overflow-auto">
                {kind === "dialog" ? (
                  <StructurePanel
                    design={design as DialogDesign}
                    setDesign={setDesign}
                  />
                ) : (
                  <NavbarStructurePanel
                    design={design as NavbarDesign}
                    setDesign={setDesign}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Color dock */}
      <ColorDockBar design={design as any} setDesign={setDesign} />

      {/* A11y Alerts */}
      <A11yAlerts
        themeLike={{
          bg: design.colors.bg,
          fg: design.colors.fg,
          titleFg: design.colors.titleFg,
          bodyFg: design.colors.bodyFg,
          accent: design.colors.accent,
          border: design.colors.border,
        }}
        onFixAll={(u) =>
          setDesign((d: { colors: any }) => ({
            ...d,
            colors: {
              ...d.colors,
              bg: u.bg,
              fg: u.fg,
              titleFg: u.titleFg,
              bodyFg: u.bodyFg,
              accent: u.accent,
              border: u.border,
            },
          }))
        }
      />
    </div>
  );
}

/* ---------- Background ---------- */
function AuroraBgFixed() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 0% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%)," +
            "radial-gradient(900px 500px at 100% 20%, color-mix(in srgb, var(--title-fg) 8%, transparent), transparent 55%)," +
            "radial-gradient(1000px 500px at 50% 100%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%)",
        }}
      />
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
