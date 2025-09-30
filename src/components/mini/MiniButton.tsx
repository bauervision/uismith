"use client";
import * as React from "react";
import { motion } from "framer-motion";
import type { UISmithTheme } from "@/lib/theme";
import type { ButtonDesign } from "@/lib/design/button";
import { useMotionMode } from "@/app/hooks/useMotionMode";

export default function MiniButton({
  theme,
  design,
}: {
  theme: UISmithTheme;
  design?: ButtonDesign;
}) {
  const d: ButtonDesign = design ?? {
    label: "Get started",
    size: "md",
    radius: 12,
    weight: "solid",
    iconLeft: false,
    iconRight: false,
    fullWidth: false,
    uppercase: false,
  };

  const mode = useMotionMode();
  const Motion = mode === "off" ? "div" : motion.div;

  const pad =
    d.size === "sm"
      ? "px-3 py-1.5 text-[11px]"
      : d.size === "lg"
      ? "px-5 py-3 text-[15px]"
      : "px-4 py-2 text-[13px]";

  const radius = { borderRadius: `${d.radius}px` };

  // weight styles using your theme colors
  const solidStyle: React.CSSProperties = {
    background: theme.accent,
    color: "#0b0f17",
    border: `1px solid ${theme.border}`,
    boxShadow: `0 0 0 1px ${theme.accent}45`,
  };
  const outlineStyle: React.CSSProperties = {
    background: "transparent",
    color: theme.fg,
    border: `1px solid ${theme.border}`,
  };
  const ghostStyle: React.CSSProperties = {
    background: "transparent",
    color: theme.fg,
    border: `1px solid ${theme.fg}33`,
  };

  const style =
    d.weight === "outline"
      ? outlineStyle
      : d.weight === "ghost"
      ? ghostStyle
      : solidStyle;

  const content = (
    <span
      className={`inline-flex items-center gap-2 ${
        d.uppercase ? "uppercase" : ""
      }`}
    >
      {d.iconLeft && <span aria-hidden>✨</span>}
      <span>{d.label}</span>
      {d.iconRight && <span aria-hidden>➡️</span>}
    </span>
  );

  return (
    <Motion
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
            transition: { duration: mode === "reduced" ? 0.15 : 0.28 },
          }
        : {})}
    >
      <div
        className={`flex ${
          d.fullWidth ? "block" : "items-center justify-center"
        } gap-2`}
      >
        <button
          className={`font-semibold rounded-full transition-[transform,opacity] hover:opacity-95 active:scale-[0.985] ${pad} ${
            d.fullWidth ? "w-full" : ""
          }`}
          style={{ ...radius, ...style }}
        >
          {content}
        </button>
      </div>
    </Motion>
  );
}
