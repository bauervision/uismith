"use client";
import React from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import MiniSheet from "@/components/mini/MiniSheet";

export default function SheetPreview() {
  const { theme } = useTheme();
  return (
    <div className="p-6">
      <MiniSheet theme={theme} />
    </div>
  );
}
