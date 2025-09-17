// /components/designer/ColorInput.tsx
"use client";
import React from "react";

export function ColorInput({
  label,
  value,
  onChange,
  width = 120,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  width?: number;
}) {
  return (
    <label className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm">
      <span className="text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded-md border border-white/10 bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-800/70 border border-white/10 rounded-lg px-2 py-1"
          style={{ width }}
        />
      </div>
    </label>
  );
}
