"use client";
import React from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import MiniLogin from "@/components/mini/MiniLogin";

export default function LoginPreview() {
  const { theme } = useTheme();
  return (
    <div className="p-6 max-w-md">
      <MiniLogin theme={theme} />
    </div>
  );
}
