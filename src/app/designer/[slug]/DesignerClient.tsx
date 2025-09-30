// app/designer/DesignerClient.tsx
"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Variants, Easing } from "framer-motion";

import ExportToolbar from "@/components/designer/ExportToolbar";
import ColorDockBar from "@/components/designer/panels/ColorDockBar";

import A11yAlerts from "@/components/designer/a11y/A11yAlerts";
import A11yMagnifier, {
  A11yMagnifierHandle,
} from "@/components/designer/a11y/A11yMagnifier";
import {
  MotionSettingsProvider,
  useMotionSettings,
} from "@/app/providers/MotionSettingsProvider";
import MotionConfigPanel from "@/components/designer/MotionConfigDialog";
import { useConfig } from "@/app/providers/ConfigProvider";
import { kebab } from "@/lib/strings";
import type { UISmithTheme } from "@/lib/theme";

// EXTERNAL registry/types/stores

// Global shared settings (mounted once at app root; do NOT wrap here)
import { useDesignerSettings } from "@/app/providers/DesignerSettingsProvider";
import { useDesignStores } from "@/components/designer/_usedesignStores";
import {
  DesignerSlug,
  VALID_SLUGS,
} from "@/components/designer/_designerTypes";
import { REGISTRY } from "@/components/designer/_registry";

/* ------------------------------- Motion ---------------------------------- */
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

/* -------------------------------- Root ----------------------------------- */
export default function DesignerClient({ slug }: { slug: string }) {
  // IMPORTANT: DesignerSettingsProvider should be mounted once in app/layout.tsx
  return (
    <MotionSettingsProvider>
      <DesignerClientInner slug={slug} />
    </MotionSettingsProvider>
  );
}

/* -------------------------------- Page ----------------------------------- */
function DesignerClientInner({ slug }: { slug: string }) {
  const { settings, setSettings } = useDesignerSettings();

  // Seed the design stores from global settings *at initialization time only*.
  // This guarantees navigating to a new slug starts with the current global padding.
  const stores = useDesignStores({ padding: settings.padding });

  const { config } = useConfig();
  const pkg = kebab(config.packageName || "app-ui");

  const [dialogDesign, setDialogDesign] = stores.dialog;
  const [navbarDesign, setNavbarDesign] = stores.navbar;
  const [buttonDesign, setButtonDesign] = stores.button;
  const [sheetDesign, setSheetDesign] = stores.sheet;

  // active slug (fallback to dialog if unknown)
  const isSlug = (x: string): x is DesignerSlug =>
    (VALID_SLUGS as readonly string[]).includes(x);
  const active: DesignerSlug = isSlug(slug) ? slug : "dialog";

  // pick registry + active store
  const entry = REGISTRY[active];
  const [activeDesign, setActiveDesign] =
    active === "dialog"
      ? stores.dialog
      : active === "navbar"
      ? stores.navbar
      : active === "button"
      ? stores.button
      : stores.sheet;

  // theme source: navbar uses its own theme; others use dialog theme
  const themeSource = active === "navbar" ? navbarDesign : dialogDesign;
  const miniTheme: UISmithTheme = {
    bg: themeSource.colors.bg,
    fg: themeSource.colors.fg,
    accent: themeSource.colors.accent,
    border: themeSource.colors.border,
    titleFg: themeSource.colors.titleFg,
    bodyFg: themeSource.colors.bodyFg,
    footerBg: themeSource.colors.footerBg,
  };

  // ExportToolbar only accepts "dialog" | "navbar"
  const exportKind: "dialog" | "navbar" = entry.exportKind;

  // apply theme from Home (once) into dialog + navbar colors
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
  }, [setDialogDesign, setNavbarDesign]);

  // refs
  const centerRef = useRef<HTMLDivElement | null>(null);
  const magRef = useRef<A11yMagnifierHandle | null>(null);

  // motion
  const { barV, colLeftV, colRightV, centerV, initialVariant, animateVariant } =
    useVariants();

  // motion config panel
  const [motionOpen, setMotionOpen] = useState(false);

  // bottom dock positioning
  const DOCK_BASE = 124;
  const VIEWPORT_CTRL_H = 48;
  const EXTRA_GAP = 12;
  const dockBottom =
    active === "navbar" ? DOCK_BASE + VIEWPORT_CTRL_H + EXTRA_GAP : DOCK_BASE;

  /* ----------------- ACTIVE DESIGN → GLOBAL SETTINGS (one-way, loop-proof) ---------------- */
  const readPadding = React.useCallback((d: any): number | undefined => {
    if (!d?.layout) return undefined;
    const candidate = d.layout.padding ?? d.layout.paddingX;
    if (typeof candidate === "number") return candidate;
    if (
      candidate &&
      typeof candidate === "object" &&
      typeof candidate.value === "number"
    ) {
      return candidate.value;
    }
    return undefined;
  }, []);

  const activePadding =
    active === "dialog"
      ? readPadding(dialogDesign)
      : active === "navbar"
      ? readPadding(navbarDesign)
      : active === "button"
      ? readPadding(buttonDesign)
      : readPadding(sheetDesign);

  const prevActivePaddingRef = useRef<number | undefined>(activePadding);

  useEffect(() => {
    const prev = prevActivePaddingRef.current;
    const curr = activePadding;
    if (typeof curr === "number" && curr !== prev) {
      prevActivePaddingRef.current = curr;
      if (curr !== settings.padding) {
        setSettings((s) => ({ ...s, padding: curr }));
      }
    }
    // Watch only the active design’s padding fields so we don't loop.
  }, [
    active,
    // Active design's padding fields only:
    active === "dialog" ? (dialogDesign as any)?.layout?.padding : undefined,
    active === "dialog" ? (dialogDesign as any)?.layout?.paddingX : undefined,
    active === "navbar" ? (navbarDesign as any)?.layout?.padding : undefined,
    active === "navbar" ? (navbarDesign as any)?.layout?.paddingX : undefined,
    active === "button" ? (buttonDesign as any)?.layout?.padding : undefined,
    active === "button" ? (buttonDesign as any)?.layout?.paddingX : undefined,
    active === "sheet" ? (sheetDesign as any)?.layout?.padding : undefined,
    active === "sheet" ? (sheetDesign as any)?.layout?.paddingX : undefined,

    activePadding,
    settings.padding,
    setSettings,
    readPadding,
  ]);
  /* ---------------------------------------------------------------------------------------- */

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
        <ExportToolbar design={activeDesign as any} kind={exportKind} />
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
                <entry.left
                  design={activeDesign as any}
                  setDesign={setActiveDesign as any}
                />
              </div>
            </motion.div>

            {/* Center preview */}
            <motion.div
              key={active}
              ref={centerRef as any}
              variants={centerV}
              initial={initialVariant}
              animate={animateVariant}
              className={`h-full min-w-0 relative overflow-hidden will-change-transform ${
                entry.centerClass ?? ""
              }`}
            >
              {/* A11y magnifier; hide built-in trigger */}
              <A11yMagnifier
                ref={magRef}
                containerRef={centerRef}
                renderTrigger={false}
              />

              {/* Preview */}
              <entry.center design={activeDesign as any} theme={miniTheme} />

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
                <entry.right
                  design={activeDesign as any}
                  setDesign={setActiveDesign as any}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Color dock — edit theme colors; bind to themeSource */}
      <ColorDockBar
        design={themeSource as any}
        setDesign={
          (active === "navbar" ? setNavbarDesign : setDialogDesign) as any
        }
      />

      {/* A11y Alerts */}
      <A11yAlerts
        themeLike={{
          bg: themeSource.colors.bg,
          fg: themeSource.colors.fg,
          titleFg: themeSource.colors.titleFg,
          bodyFg: themeSource.colors.bodyFg,
          accent: themeSource.colors.accent,
          border: themeSource.colors.border,
        }}
        onFixAll={(u) => {
          setDialogDesign((d: any) => ({
            ...d,
            colors: { ...d.colors, ...u },
          }));
          setNavbarDesign((d: any) => ({
            ...d,
            colors: { ...d.colors, ...u },
          }));
        }}
      />
    </div>
  );
}

/* ------------------------------ Background ------------------------------- */
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
