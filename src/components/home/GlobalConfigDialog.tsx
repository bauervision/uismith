"use client";

import * as React from "react";
import { useConfig } from "@/app/providers/ConfigProvider";

export default function GlobalConfigDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { config, updateConfig } = useConfig();
  const [draft, setDraft] = React.useState(config);

  React.useEffect(() => {
    if (open) setDraft(config);
  }, [open, config]);

  const save = () => {
    updateConfig(draft);
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
        className="mb-1 text-xs uppercase tracking-wide text-[11px]"
        style={{ color: "var(--body-fg)" }}
      >
        {label}
      </div>
      {children}
    </label>
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4"
      style={{ background: "color-mix(in srgb, black 60%, transparent)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl rounded-2xl border shadow-xl"
        style={{
          background: "var(--bg)",
          color: "var(--fg)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="text-sm font-semibold"
            style={{ color: "var(--title-fg)" }}
          >
            Global configuration
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

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="UI package name">
            <input
              value={draft.packageName}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  packageName:
                    e.target.value
                      .replace(/[^a-z0-9\-]/gi, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "") || "app-ui",
                }))
              }
              className="h-10 w-full rounded-md border px-3 bg-transparent"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
              placeholder="app-ui"
            />
          </Field>

          <Field label="Styling system">
            <div className="flex items-center gap-2 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="styling"
                  value="core-css"
                  checked={draft.styling === "core-css"}
                  onChange={() =>
                    setDraft((d) => ({ ...d, styling: "core-css" }))
                  }
                />
                Core CSS
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="styling"
                  value="tailwind"
                  checked={draft.styling === "tailwind"}
                  onChange={() =>
                    setDraft((d) => ({ ...d, styling: "tailwind" }))
                  }
                />
                Tailwind
              </label>
            </div>
          </Field>

          <Field label="File structure">
            <select
              value={draft.fileStructure}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  fileStructure: e.target.value as any,
                }))
              }
              className="h-10 w-full rounded-md border bg-transparent"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              <option value="nested">Nested folders (shadcn-like)</option>
              <option value="flat">Flat components folder</option>
            </select>
          </Field>

          <Field label="CSS variable prefix (optional)">
            <input
              value={draft.cssVarPrefix}
              onChange={(e) =>
                setDraft((d) => ({ ...d, cssVarPrefix: e.target.value }))
              }
              className="h-10 w-full rounded-md border px-3 bg-transparent"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
              placeholder="ui-"
            />
          </Field>

          <Field label="ClassName prefix (optional)">
            <input
              value={draft.classPrefix}
              onChange={(e) =>
                setDraft((d) => ({ ...d, classPrefix: e.target.value }))
              }
              className="h-10 w-full rounded-md border px-3 bg-transparent"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
              placeholder="ui-"
            />
          </Field>

          <div className="flex flex-col justify-end gap-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.includeDataProvider}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    includeDataProvider: e.target.checked,
                  }))
                }
              />
              Include DataProvider in export
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.includeReadme}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, includeReadme: e.target.checked }))
                }
              />
              Include README.md
            </label>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-3 px-5 py-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-xs" style={{ color: "var(--body-fg)" }}>
            These settings shape your export folder (
            <span className="font-semibold">
              {draft.packageName || "app-ui"}
            </span>
            ).
          </div>
          <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}
