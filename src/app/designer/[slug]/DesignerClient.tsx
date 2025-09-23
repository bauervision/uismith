"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import ExportToolbar from "@/components/designer/ExportToolbar";
import ColorDockBar from "@/components/designer/panels/ColorDockBar";

// dialog bits
import { defaultDialogDesign, type DialogDesign } from "@/lib/design/dialog";
import LayoutPanel from "@/components/designer/panels/LayoutPanel";
import StructurePanel from "@/components/designer/panels/StructurePanel";
import DialogPreview from "@/components/preview/DialogPreview";

// navbar bits
import { defaultNavbarDesign, type NavbarDesign } from "@/lib/design/navbar";
import NavbarLayoutPanel from "@/components/designer/panels/navbar/NavbarLayoutPanel";
import NavbarStructurePanel from "@/components/designer/panels/navbar/NavbarStructurePanel";
import NavbarPreview from "@/components/preview/NavbarPreview";

import A11yAlerts from "@/components/designer/a11y/A11yAlerts";
import A11yMagnifier from "@/components/designer/a11y/A11yMagnifier";

import { motion } from "framer-motion";
import type { Variants, Easing } from "framer-motion";

import {
  MotionSettingsProvider,
  useMotionSettings,
} from "@/app/providers/MotionSettingsProvider";
import MotionConfigDialog from "@/components/designer/MotionConfigDialog";
import MotionConfigPanel from "@/components/designer/MotionConfigDialog";

type Kind = "dialog" | "navbar";

/* ------- Local helper to build variants from Motion settings ------- */
function useVariants() {
  const { reduced, easingValue, durationMult, secs, settings } =
    useMotionSettings();
  const ease = easingValue as Easing;
  const f = (ms: number) => secs(ms * (durationMult || 0)); // if reduced → 0s

  const initialVariant = reduced ? "show" : "hidden";
  const animateVariant = "show";

  const barV: Variants = {
    hidden: { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0, transition: { duration: f(350), ease } },
  };
  const colLeftV: Variants = {
    hidden: { opacity: 0, x: -16, scale: 0.98 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: f(settings.baseDurationMs + 100), ease },
    },
  };
  const colRightV: Variants = {
    hidden: { opacity: 0, x: 16, scale: 0.98 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: f(settings.baseDurationMs + 100), ease },
    },
  };
  const centerV: Variants = {
    hidden: { opacity: 0, scale: 0.985 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: f(settings.baseDurationMs), ease, delay: f(50) },
    },
  };

  return {
    initialVariant,
    animateVariant,
    barV,
    colLeftV,
    colRightV,
    centerV,
  };
}

export default function DesignerClient({ slug }: { slug: string }) {
  return (
    <MotionSettingsProvider>
      <DesignerClientInner slug={slug} />
    </MotionSettingsProvider>
  );
}

function DesignerClientInner({ slug }: { slug: string }) {
  const kind: Kind = slug === "navbar" ? "navbar" : "dialog";

  // Keep separate pieces of state so switching routes doesn’t bleed values
  const [dialogDesign, setDialogDesign] =
    useState<DialogDesign>(defaultDialogDesign);
  const [navbarDesign, setNavbarDesign] =
    useState<NavbarDesign>(defaultNavbarDesign);

  // Theme injection (from Home)
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

  // pick active model + setters
  const design = kind === "dialog" ? dialogDesign : navbarDesign;
  const setDesign = (
    kind === "dialog" ? setDialogDesign : setNavbarDesign
  ) as React.Dispatch<React.SetStateAction<any>>;

  // Magnifier targets only the center preview surface
  const centerRef = useRef<HTMLDivElement | null>(null);

  // Motion bits
  const { barV, colLeftV, colRightV, centerV, initialVariant, animateVariant } =
    useVariants();

  // Dialog open
  const [motionOpen, setMotionOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <AuroraBgFixed />

      {/* Top bar (unchanged) */}
      <motion.div
        variants={barV}
        initial={initialVariant}
        animate={animateVariant}
        className="relative z-20"
      >
        <ExportToolbar design={design as any} kind={kind} />
      </motion.div>

      {/* Full-width working area */}
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
              className={`h-full min-w-0 relative will-change-transform ${
                kind === "navbar" ? "" : "flex items-center justify-center"
              }`}
            >
              {/* A11y Magnifier lives here */}
              <A11yMagnifier containerRef={centerRef} />

              {/* Your previews */}
              {kind === "dialog" ? (
                <DialogPreview design={design as DialogDesign} />
              ) : (
                <NavbarPreview design={design as NavbarDesign} />
              )}

              {/* —— Controls cluster (bottom-right), near "Inspect Accessibility" —— */}
              <div
                className="absolute right-4 z-40 flex flex-col items-end gap-2"
                style={{
                  // place above ColorDockBar (112px) + small gap
                  bottom: 124,
                }}
              >
                {/* Motion trigger */}
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

                {/* Anchored panel (appears just above the button) */}
                <div className="relative">
                  {/* offset the panel upward a bit so it doesn't collide with the button */}
                  <div className={motionOpen ? "" : "hidden"}>
                    <div className="mb-2" />
                    <MotionConfigPanel
                      open={motionOpen}
                      onClose={() => setMotionOpen(false)}
                    />
                  </div>
                </div>
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

      <ColorDockBar design={design as any} setDesign={setDesign} />

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

/* ---------- Full-page aurora background (fixed to viewport) ---------- */
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
