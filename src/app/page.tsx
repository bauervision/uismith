"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants, Easing } from "framer-motion";
import ComponentCard from "@/components/home/ComponentCard";
import ThemeEditor from "@/components/home/ThemeEditor";
import { COMPONENTS } from "@/lib/registry/components";
import A11yAlerts from "@/components/designer/a11y/A11yAlerts";
import { useTheme } from "./providers/ThemeProvider";
import GlobalConfigDialog from "@/components/home/GlobalConfigDialog";
import { useConfig } from "./providers/ConfigProvider";
import { useMotionMode } from "./hooks/useMotionMode";
import TabButton from "@/components/home/TabButton";

/* ---------- Motion setup (typed) ---------- */

const easeSoft: Easing = [0.2, 0.8, 0.2, 1];
const easeSnap: Easing = [0.16, 1, 0.3, 1];

// Hero (title + subheading)
const heroV: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeSoft },
  },
};

// Theme toolbar reveal:
// Shell fades in; inner expands from center using scaleX (GPU-friendly)
const toolbarShellV: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeSnap },
  },
};
const toolbarInnerV: Variants = {
  hidden: { scaleX: 0, transformOrigin: "50% 50%" },
  show: {
    scaleX: 1,
    transformOrigin: "50% 50%",
    transition: { duration: 0.6, ease: easeSnap },
  },
};

// Grid + cards stagger
const gridV: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.15, staggerChildren: 0.08 } },
};
const cardV: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: easeSoft },
  },
};

/* ---------- Page ---------- */

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { config } = useConfig();
  const [openConfig, setOpenConfig] = React.useState(false);
  const [activeKind, setActiveKind] = React.useState<"simple" | "functional">(
    "simple"
  );
  const motionMode = useMotionMode() ?? "on";
  // Never leave content "hidden" after hydration:
  // if reduced motion → start visible; otherwise animate in.
  const prefersReducedMotion = useReducedMotion();
  const initialVariant = prefersReducedMotion ? "show" : "hidden";
  const animateVariant = "show";

  // counts for the tabs
  const simpleCount = React.useMemo(
    () => COMPONENTS.filter((c) => c.kind === "simple").length,
    []
  );
  const functionalCount = React.useMemo(
    () => COMPONENTS.filter((c) => c.kind === "functional").length,
    []
  );

  const items = React.useMemo(() => {
    const seen = new Set<string>();
    return COMPONENTS.filter((c) => c.kind === activeKind).filter((c) => {
      if (seen.has(c.slug)) return false;
      seen.add(c.slug);
      return true;
    });
  }, [activeKind]);

  // keep your existing eases but make sure they're typed tuples:
  const easeSoft: Easing = [0.2, 0.8, 0.2, 1];
  const easeSnap: Easing = [0.16, 1, 0.3, 1];

  const listTrans =
    motionMode === "off"
      ? undefined
      : {
          duration: motionMode === "reduced" ? 0.12 : 0.22,
          ease: easeSoft,
        };

  const tabsV: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: easeSoft,
        when: "beforeChildren",
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const tabItemV: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.22, ease: easeSoft },
    },
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBgFixed />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 space-y-8">
        {/* Hero */}
        <motion.header
          variants={heroV}
          initial={initialVariant}
          animate={animateVariant}
          className="pt-8 will-change-transform"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--title-fg), var(--accent))",
            }}
          >
            What do you want to craft?
          </h1>
          <p
            className="mt-2 text-base sm:text-lg md:text-xl"
            style={{ color: "color-mix(in srgb, var(--fg) 80%, transparent)" }}
          >
            Pick a component to design or edit.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setOpenConfig(true)}
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--accent) 25%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))",
                color: "#0b0f17",
                border:
                  "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))",
                boxShadow:
                  "0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent)",
              }}
            >
              Global settings
            </button>
            <span
              className="text-xs"
              style={{
                color: "color-mix(in srgb, var(--body-fg) 90%, transparent)",
              }}
            >
              Export target: <b>{config.packageName}</b> • {config.styling}
            </span>
          </div>
        </motion.header>

        {/* Theme toolbar reveal */}
        <motion.section
          variants={toolbarShellV}
          initial={initialVariant}
          animate={animateVariant}
          className="rounded-2xl will-change-transform"
          style={{
            boxShadow:
              "0 0 60px color-mix(in srgb, var(--accent) 12%, transparent)",
          }}
        >
          <motion.div
            variants={toolbarInnerV}
            initial={initialVariant}
            animate={animateVariant}
            className="overflow-hidden will-change-transform"
          >
            <ThemeEditor theme={theme} setTheme={setTheme} />
          </motion.div>
        </motion.section>

        <section className="mt-4 flex justify-center">
          <motion.nav
            role="tablist"
            aria-label="Component class"
            className="inline-flex items-center rounded-full border p-1 will-change-transform"
            style={{
              borderColor: "color-mix(in srgb, var(--fg) 18%, transparent)",
            }}
            variants={tabsV}
            initial={initialVariant}
            animate={animateVariant}
          >
            <motion.div variants={tabItemV}>
              <TabButton
                id="tab-simple"
                active={activeKind === "simple"}
                onClick={() => setActiveKind("simple")}
                label={`Simple (${simpleCount})`}
              />
            </motion.div>

            <motion.div variants={tabItemV}>
              <TabButton
                id="tab-functional"
                active={activeKind === "functional"}
                onClick={() => setActiveKind("functional")}
                label={`Functional (${functionalCount})`}
              />
            </motion.div>
          </motion.nav>
        </section>

        {/* Components grid with staggered cards */}
        <motion.div
          variants={gridV}
          initial={initialVariant}
          animate={animateVariant}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
          key={activeKind}
        >
          {items.map((c, idx) => (
            <motion.div
              key={`${c.slug}-${idx}`}
              variants={cardV}
              className="will-change-transform"
            >
              <ComponentCard
                href={`/designer/${c.slug}`}
                title={c.title}
                blurb={c.blurb}
                theme={theme} // swatches only; visuals use CSS vars
                slug={c.slug}
              />
            </motion.div>
          ))}
        </motion.div>

        <A11yAlerts
          themeLike={{
            bg: theme.bg,
            fg: theme.fg,
            titleFg: theme.titleFg,
            bodyFg: theme.bodyFg,
            accent: theme.accent,
            border: theme.border,
          }}
          onFixAll={(updated) => setTheme((prev) => ({ ...prev, ...updated }))}
        />
      </div>

      <GlobalConfigDialog
        open={openConfig}
        onClose={() => setOpenConfig(false)}
      />
    </div>
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
