"use client";
import React from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import MiniButton from "@/components/mini/MiniButton";

export default function ButtonPreview() {
  const { theme } = useTheme();
  return (
    <div className="p-6">
      <MiniButton theme={theme} />
    </div>
  );
}
