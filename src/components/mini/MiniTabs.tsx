"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UISmithTheme } from "@/lib/theme";
import { useMotionMode } from "@/app/hooks/useMotionMode";
import { useId } from "react";

const easeSoft: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export default function MiniTabs({ theme }: { theme: UISmithTheme }) {
  const mode = useMotionMode();
  const uid = useId();
  const [active, setActive] = React.useState<"overview" | "api" | "examples">(
    "overview"
  );

  const duration = mode === "reduced" ? 0.12 : 0.22;
  const MotionDiv: any = mode === "off" ? "div" : motion.div;
  const Highlight: any = mode === "off" ? "span" : motion.span;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "api", label: "API" },
    { key: "examples", label: "Examples" },
  ] as const;

  return (
    <MotionDiv
      className="mt-3 rounded-xl border p-3"
      style={{
        background: theme.bg,
        color: theme.fg,
        borderColor: theme.border,
      }}
      {...(mode !== "off"
        ? {
            initial: { opacity: 0, y: 6 },
            animate: { opacity: 1, y: 0 },
            transition: { duration, ease: easeSoft },
          }
        : {})}
    >
      {/* Tablist */}
      <div
        role="tablist"
        aria-label="Mini tabs"
        className="inline-flex items-center gap-1 rounded-full border p-1"
        style={{ borderColor: `${theme.fg}2a` }}
      >
        {tabs.map((t) => {
          const selected = active === t.key;
          const tabId = `${uid}-tab-${t.key}`;
          const panelId = `${uid}-panel-${t.key}`;
          return (
            <button
              key={t.key}
              id={tabId}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              onClick={() => setActive(t.key)}
              className="relative inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium"
              style={{
                WebkitTapHighlightColor: "transparent",
                color: selected ? "#0b0f17" : theme.bodyFg,
              }}
            >
              {selected && (
                <Highlight
                  aria-hidden
                  layoutId={mode === "off" ? undefined : `${uid}-tabPill`}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `color-mix(in srgb, ${theme.accent} 55%, transparent)`,
                    boxShadow: `0 0 0 1px color-mix(in srgb, ${theme.accent} 35%, transparent)`,
                  }}
                  {...(mode !== "off"
                    ? { transition: { duration, ease: easeSoft } }
                    : {})}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="mt-3 text-[11px]">
        <AnimatePresence mode="wait" initial={false}>
          <MotionDiv
            key={active}
            id={`${uid}-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${active}`}
            style={{ color: theme.bodyFg }}
            {...(mode !== "off"
              ? {
                  initial: { opacity: 0, y: 4 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -4 },
                  transition: { duration, ease: easeSoft },
                }
              : {})}
          >
            {active === "overview" && (
              <p>Lightweight tabs with animated selection pill.</p>
            )}
            {active === "api" && (
              <p>
                Props: <code>defaultValue</code>, <code>onChange</code>, etc.
              </p>
            )}
            {active === "examples" && (
              <p>Try switching themes and motion modes in Global settings.</p>
            )}
          </MotionDiv>
        </AnimatePresence>
      </div>
    </MotionDiv>
  );
}
