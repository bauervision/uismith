"use client";
import * as React from "react";
import { motion } from "framer-motion";
import type { UISmithTheme } from "@/lib/theme";
import { useMotionMode } from "@/app/hooks/useMotionMode";

export default function MiniLogin({ theme }: { theme: UISmithTheme }) {
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
            initial: { opacity: 0, scale: 0.985 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: mode === "reduced" ? 0.15 : 0.3 },
          }
        : {})}
    >
      <div className="text-xs font-semibold" style={{ color: theme.titleFg }}>
        Login
      </div>
      <form
        className="mt-2 space-y-2 text-[11px]"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          placeholder="Email"
          className="w-full rounded-md px-2 py-1 outline-none"
          style={{
            background: "transparent",
            border: `1px solid ${theme.fg}26`,
            color: theme.bodyFg,
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-md px-2 py-1 outline-none"
          style={{
            background: "transparent",
            border: `1px solid ${theme.fg}26`,
            color: theme.bodyFg,
          }}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1">
            <input type="checkbox" />
            <span style={{ color: theme.bodyFg }}>Remember me</span>
          </label>
          <button
            className="rounded-full px-2 py-1 font-semibold text-[11px]"
            style={{ background: theme.accent, color: "#0b0f17" }}
          >
            Sign in
          </button>
        </div>
      </form>
    </Motion>
  );
}
