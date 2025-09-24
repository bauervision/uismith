// components/designer/MotionConfigPanel.tsx
"use client";

import * as React from "react";
import {
  useMotionSettings,
  type MotionMode,
  type EasingId,
} from "@/app/providers/MotionSettingsProvider";

export default function MotionConfigPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings, setSettings } = useMotionSettings();
  const [draft, setDraft] = React.useState(settings);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  // Close on Esc and focus the panel for a11y
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey, true);
    // focus root so arrow keys/sliders work without bubbling to preview
    requestAnimationFrame(() => rootRef.current?.focus());
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  const save = () => {
    setSettings(draft);
    onClose();
  };

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <label className="block">
      <div
        className="mb-1 text-[11px] uppercase tracking-wide"
        style={{ color: "var(--body-fg)" }}
      >
        {label}
      </div>
      {children}
    </label>
  );

  const radio = <T extends string>(
    name: string,
    value: T,
    current: T,
    set: (v: T) => void,
    label: string
  ) => (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="radio"
        name={name}
        checked={current === value}
        onChange={() => set(value)}
      />
      {label}
    </label>
  );

  // NOTE: z-[90] puts panel above the Dialog overlay; stopPropagation prevents backdrop handlers.
  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-label="Motion configuration"
      className="w-[min(92vw,560px)] rounded-2xl border shadow-2xl bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 focus:outline-none relative z-[90]"
      style={{ borderColor: "var(--border)", color: "var(--fg)" }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="text-sm font-semibold"
          style={{ color: "var(--title-fg)" }}
        >
          Motion configuration
        </div>
        <button
          onClick={onClose}
          className="rounded-md px-2 py-1 text-sm hover:bg-white/10"
          style={{ color: "var(--fg)" }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2">
        <Field label="Mode">
          <div className="flex flex-wrap gap-3">
            {radio<MotionMode>(
              "mode",
              "system",
              draft.mode,
              (v) => setDraft((d) => ({ ...d, mode: v })),
              "Follow system"
            )}
            {radio<MotionMode>(
              "mode",
              "reduced",
              draft.mode,
              (v) => setDraft((d) => ({ ...d, mode: v })),
              "Reduced"
            )}
            {radio<MotionMode>(
              "mode",
              "normal",
              draft.mode,
              (v) => setDraft((d) => ({ ...d, mode: v })),
              "Normal"
            )}
            {radio<MotionMode>(
              "mode",
              "spicy",
              draft.mode,
              (v) => setDraft((d) => ({ ...d, mode: v })),
              "Spicy"
            )}
          </div>
          <p className="mt-1 text-xs" style={{ color: "var(--body-fg)" }}>
            Reduced disables entrances; Spicy slightly increases durations.
          </p>
        </Field>

        <Field label="Easing">
          <select
            value={draft.easing}
            onChange={(e) =>
              setDraft((d) => ({ ...d, easing: e.target.value as EasingId }))
            }
            className="h-10 w-full rounded-md border bg-transparent px-2"
            style={{ borderColor: "var(--border)", color: "var(--fg)" }}
          >
            <option value="soft">Soft cubic (default)</option>
            <option value="snap">Snap cubic</option>
            <option value="easeInOut">Ease-in-out</option>
            <option value="linear">Linear</option>
          </select>
        </Field>

        <Field label={`Base duration (${draft.baseDurationMs}ms)`}>
          <input
            type="range"
            min={180}
            max={700}
            step={10}
            value={draft.baseDurationMs}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                baseDurationMs: parseInt(e.target.value),
              }))
            }
            className="w-full"
          />
          <p className="mt-1 text-xs" style={{ color: "var(--body-fg)" }}>
            Page anims scale relative to this number.
          </p>
        </Field>

        <Field label={`Stagger children (${draft.staggerMs}ms)`}>
          <input
            type="range"
            min={0}
            max={200}
            step={5}
            value={draft.staggerMs}
            onChange={(e) =>
              setDraft((d) => ({ ...d, staggerMs: parseInt(e.target.value) }))
            }
            className="w-full"
          />
        </Field>

        <Field label={`Delay children (${draft.delayChildrenMs}ms)`}>
          <input
            type="range"
            min={0}
            max={400}
            step={10}
            value={draft.delayChildrenMs}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                delayChildrenMs: parseInt(e.target.value),
              }))
            }
            className="w-full"
          />
        </Field>

        <div
          className="md:col-span-2 text-xs"
          style={{ color: "var(--body-fg)" }}
        >
          These settings affect the **Designer** only. Exported components keep
          their own motion unless you opt in.
        </div>
      </div>

      <div
        className="flex items-center justify-end gap-2 px-4 py-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-md border text-sm"
          style={{ borderColor: "var(--border)", color: "var(--fg)" }}
        >
          Cancel
        </button>
        <button
          onClick={save}
          className="px-3 py-1.5 rounded-md text-sm font-semibold"
          style={{ background: "var(--accent)", color: "#0b0f17" }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
