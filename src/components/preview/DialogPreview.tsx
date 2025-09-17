// key changes: use width (px) + maxWidth:'100%', remove outer maxWidth wrapper
"use client";

import React, { useMemo } from "react";
import type { DialogDesign } from "@/lib/design/dialog";
import { mapShadowToBoxShadow } from "@/lib/design/shadow";

export default function DialogPreview({ design }: { design: DialogDesign }) {
  const borderRadiusStyle = useMemo<React.CSSProperties>(() => {
    return design.layout.radiusMode === "uniform"
      ? { borderRadius: design.layout.radius }
      : {
          borderTopLeftRadius: design.layout.radiusTL,
          borderTopRightRadius: design.layout.radiusTR,
          borderBottomRightRadius: design.layout.radiusBR,
          borderBottomLeftRadius: design.layout.radiusBL,
        };
  }, [
    design.layout.radiusMode,
    design.layout.radius,
    design.layout.radiusTL,
    design.layout.radiusTR,
    design.layout.radiusBR,
    design.layout.radiusBL,
  ]);

  const boxStyle = useMemo<React.CSSProperties>(() => {
    const base: React.CSSProperties = {
      width: design.layout.maxWidth.base,
      maxWidth: "100%",
      color: design.colors.fg,
      padding: design.layout.padding.base,
      display: "flex",
      flexDirection: "column",
      gap: design.layout.gap,
      boxShadow: mapShadowToBoxShadow(design.shadow),
      ...borderRadiusStyle,
    };

    if (design.colors.borderMode === "gradient") {
      return {
        ...base,
        background: `
        linear-gradient(${design.colors.bg}, ${design.colors.bg}) padding-box,
        linear-gradient(${design.layout.borderGradientAngle}deg, ${design.colors.borderGradStart}, ${design.colors.borderGradEnd}) border-box
      `,
        border: `${design.layout.borderWidth}px solid transparent`,
      };
    }

    // solid
    return {
      ...base,
      background: design.colors.bg,
      border: `${design.layout.borderWidth}px solid ${design.colors.border}`,
    };
  }, [design, borderRadiusStyle]);

  const titleRowStyle = {
    background: design.colors.titleBg,
  } as React.CSSProperties;
  const titleTextStyle = {
    color: design.colors.titleFg,
    fontSize: design.type.titleSize,
    fontWeight: design.type.titleWeight as React.CSSProperties["fontWeight"],
  } as React.CSSProperties;

  return (
    <div className="w-full  bg-slate-900/30 h-full">
      <div className="h-full w-full flex items-center justify-center">
        {/* dialog box */}
        <div style={boxStyle}>
          {design.structure.showTitle && (
            <div
              className="flex items-center justify-between"
              style={titleRowStyle}
            >
              <div style={titleTextStyle}>Dialog title</div>
              {design.structure.showClose && (
                <button
                  className="rounded-md px-2 py-1 hover:bg-white/10"
                  aria-label="Close"
                  style={{ color: design.colors.fg }}
                >
                  ×
                </button>
              )}
            </div>
          )}

          {design.structure.showBody && (
            <div className="text-sm" style={{ color: design.colors.bodyFg }}>
              This is the body of your dialog. We’ll wire a11y + motion after
              export generator.
            </div>
          )}

          {design.structure.showFooter && (
            <div
              className="flex items-center justify-end gap-3"
              style={{ background: design.colors.footerBg }}
            >
              {design.structure.footerButtons.map((b, i) => (
                <button
                  key={i}
                  className="px-4 py-2 rounded-full font-semibold"
                  style={{
                    background: i === 0 ? design.colors.accent : "transparent",
                    color: i === 0 ? "#0b0f17" : design.colors.fg,
                    border:
                      i === 0 ? "none" : `1px solid ${design.colors.fg}33`,
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
