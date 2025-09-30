// components/designer/Slider.tsx
"use client";
import * as React from "react";

type NumberLike = number | { value?: number } | undefined;

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = "",
}: {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: NumberLike; // accepts number | token | undefined
  onChange: (n: number) => void; // always returns a number
  className?: string;
}) {
  // Extract numeric value if token-like
  const extract = (v: NumberLike) =>
    typeof v === "number"
      ? v
      : v && typeof v === "object" && typeof v.value === "number"
      ? v.value
      : undefined;

  const numeric = extract(value);

  // Stable fallback so the input is controlled on the very first render
  const fallbackRef = React.useRef<number>(
    Number.isFinite(numeric) ? (numeric as number) : min
  );
  const controlled = Number.isFinite(numeric)
    ? (numeric as number)
    : fallbackRef.current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = e.currentTarget.valueAsNumber;
    // valueAsNumber can be NaN if the browser can't parse; guard it
    if (Number.isFinite(n)) onChange(n);
  };

  return (
    <label className={`block text-sm ${className}`}>
      {label && <div className="text-[11px] text-slate-400 mb-1">{label}</div>}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={controlled} // always a number
          onChange={handleChange}
          className="flex-1 accent-emerald-400"
        />
        <div className="w-10 text-right tabular-nums">
          {Math.round(controlled)}
        </div>
      </div>
    </label>
  );
}
