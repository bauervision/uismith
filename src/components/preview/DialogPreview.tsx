"use client";

import React from "react";
import type { DialogDesign } from "@/lib/design/dialog";
import { mapShadowToBoxShadow } from "@/lib/design/shadow";

export default function DialogPreview({ design }: { design: DialogDesign }) {
  const [open, setOpen] = React.useState(true);

  // Stable ids for ARIA
  const baseId = React.useId().replace(/:/g, "");
  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const lastActiveRef = React.useRef<HTMLElement | null>(null);

  // A11y: focus trap + restore + ESC
  React.useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    if (!el) return;

    lastActiveRef.current = (document.activeElement as HTMLElement) ?? null;

    const q =
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const getFocusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>(q)).filter(
        (n) => !n.hasAttribute("disabled") && n.tabIndex !== -1
      );

    const fs = getFocusables();
    (fs[0] ?? el).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = getFocusables();
      if (nodes.length === 0) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", onKey, true);
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey, true);
      root.style.overflow = prevOverflow;
      lastActiveRef.current?.focus?.();
    };
  }, [open]);

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  // Shape
  const radiusStyle: React.CSSProperties =
    design.layout.radiusMode === "uniform"
      ? { borderRadius: design.layout.radius }
      : {
          borderTopLeftRadius: design.layout.radiusTL,
          borderTopRightRadius: design.layout.radiusTR,
          borderBottomRightRadius: design.layout.radiusBR,
          borderBottomLeftRadius: design.layout.radiusBL,
        };

  const isGradient = design.colors.borderMode === "gradient";
  const border = isGradient
    ? `${design.layout.borderWidth}px solid transparent`
    : `${design.layout.borderWidth}px solid var(--border)`;

  const bgSolid = "var(--bg)";
  const background = isGradient
    ? `linear-gradient(${bgSolid}, ${bgSolid}) padding-box,
       linear-gradient(${design.layout.borderGradientAngle ?? 90}deg, ${
        design.colors.borderGradStart
      }, ${design.colors.borderGradEnd}) border-box`
    : bgSolid;

  const surfaceStyle: React.CSSProperties = {
    maxWidth: design.layout.maxWidth?.base ?? 560,
    width: "100%",
    background,
    color: "var(--fg)",
    border,
    boxShadow: mapShadowToBoxShadow(design.shadow),
    padding: design.layout.padding?.base ?? 20,
    display: "flex",
    flexDirection: "column",
    gap: design.layout.gap,
    ...radiusStyle,
  };

  return (
    <div className="w-full h-full grid place-items-center relative">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute top-3 right-3 rounded-md border border-white/10 bg-slate-800/70 px-3 py-1 text-xs"
        >
          Reopen dialog
        </button>
      )}

      {open && (
        <div
          className="absolute inset-0 grid place-items-center p-6"
          style={{ background: "color-mix(in srgb, black 50%, transparent)" }}
          onMouseDown={onBackdropClick}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={design.structure.showTitle ? titleId : undefined}
            aria-describedby={design.structure.showBody ? descId : undefined}
            tabIndex={-1}
            style={surfaceStyle}
          >
            {design.structure.showTitle && (
              <div
                className="flex items-center justify-between"
                style={{ color: "var(--title-fg)" }}
              >
                <h2 id={titleId} className="text-sm font-semibold">
                  Dialog title
                </h2>
                {design.structure.showClose && (
                  <button
                    aria-label="Close dialog"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-1 hover:bg-white/10"
                    style={{ minWidth: 44, minHeight: 32, color: "var(--fg)" }}
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {design.structure.showBody && (
              <div
                id={descId}
                className="text-sm"
                style={{ color: "var(--body-fg)" }}
              >
                This is the body of your dialog. It traps focus, closes on Esc,
                and restores focus.
              </div>
            )}

            {design.structure.showFooter && (
              <div className="flex items-center justify-end gap-3">
                <button
                  className="text-sm rounded-full px-3 py-1.5"
                  style={{
                    background: "var(--accent)",
                    color: "#0b0f17",
                    fontWeight: 600,
                  }}
                >
                  Primary
                </button>
                <button
                  className="text-sm rounded-full px-3 py-1.5"
                  style={{
                    background: "transparent",
                    color: "var(--fg)",
                    border:
                      "1px solid color-mix(in srgb, var(--fg) 20%, transparent)",
                  }}
                >
                  Secondary
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
