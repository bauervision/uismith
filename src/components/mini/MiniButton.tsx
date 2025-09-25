"use client";
import * as React from "react";
import { motion } from "framer-motion";
import type { UISmithTheme } from "@/lib/theme";
import { useMotionMode } from "@/app/hooks/useMotionMode";

export default function MiniButton({ theme }: { theme: UISmithTheme }) {
  const mode = useMotionMode();
  const Motion = mode === "off" ? "div" : motion.div;

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
      <div className="flex items-center gap-2">
        <button
          className="text-[11px] rounded-full px-2 py-1 font-semibold"
          style={{ background: theme.accent, color: "#0b0f17" }}
        >
          Primary
        </button>
        <button
          className="text-[11px] rounded-full px-2 py-1"
          style={{ border: `1px solid ${theme.fg}33`, color: theme.fg }}
        >
          Ghost
        </button>
        <button
          className="text-[11px] rounded-full px-2 py-1"
          style={{ border: `1px solid ${theme.border}` }}
          disabled
        >
          Disabled
        </button>
      </div>
    </Motion>
  );
}
