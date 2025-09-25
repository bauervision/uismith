// /app/hooks/useMotionMode.ts
"use client";
import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { useConfig } from "@/app/providers/ConfigProvider";

export function useMotionMode() {
  const { config } = useConfig();
  const sysReduced = useReducedMotion(); // respects prefers-reduced-motion
  if (config.motionMode === "off") return "off" as const;
  if (config.motionMode === "reduced") return "reduced" as const;
  return sysReduced ? ("reduced" as const) : ("on" as const);
}
