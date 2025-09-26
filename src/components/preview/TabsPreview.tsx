"use client";
import React from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import MiniTabs from "@/components/mini/MiniTabs";

export default function TabsPreview() {
  const { theme } = useTheme();
  return (
    <div className="p-6">
      <MiniTabs theme={theme} />
    </div>
  );
}
