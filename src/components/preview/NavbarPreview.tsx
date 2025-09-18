"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import type { NavbarDesign } from "@/lib/design/navbar";
import { mapShadowToBoxShadow } from "@/lib/design/shadow";

type ViewMode = "desktop" | "mobile";
const MOBILE_ASPECT = 2.16; // portrait approx.

export default function NavbarPreview({ design }: { design: NavbarDesign }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ViewMode>("desktop");
  const [mobileWidth, setMobileWidth] = useState<number>(360);
  const mobileHeight = Math.round(mobileWidth * MOBILE_ASPECT);

  const menuId = "primary-mobile-menu";
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus?.();
      }
    };
    const node = sheetRef.current;
    node?.addEventListener("keydown", onKey as any, true);
    return () => node?.removeEventListener("keydown", onKey as any, true);
  }, [open]);

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
    : `${design.layout.borderWidth}px solid ${design.colors.border}`;

  const bgSolid = design.colors.bg;
  const background = isGradient
    ? `linear-gradient(${bgSolid}, ${bgSolid}) padding-box,
       linear-gradient(${design.layout.borderGradientAngle}deg, ${design.colors.borderGradStart}, ${design.colors.borderGradEnd}) border-box`
    : bgSolid;

  const wrapper: React.CSSProperties = {
    background,
    color: design.colors.fg,
    border,
    boxShadow: mapShadowToBoxShadow(design.layout.shadow),
    width: "100%",
    ...radiusStyle,
  };

  const isDesktop = mode === "desktop";
  const desktopOnlyStyle: React.CSSProperties = isDesktop
    ? { display: "flex" }
    : { display: "none" };
  const mobileOnlyStyle: React.CSSProperties = isDesktop
    ? { display: "none" }
    : { display: "inline-flex" };

  return (
    <div className="w-full h-full relative">
      <div
        className={`w-full h-full ${
          mode === "mobile" ? "flex items-start justify-center" : ""
        }`}
      >
        {mode === "mobile" ? (
          <DeviceFrame
            width={mobileWidth}
            height={mobileHeight}
            border={design.colors.border}
          >
            <div style={wrapper}>
              <Bar
                design={design}
                open={open}
                setOpen={setOpen}
                desktopOnlyStyle={desktopOnlyStyle}
                mobileOnlyStyle={mobileOnlyStyle}
                triggerRef={triggerRef} // accepts RefObject<HTMLButtonElement | null>
                menuId={menuId}
              />
              <MobileSheet
                design={design}
                open={open}
                menuId={menuId}
                firstLinkRef={firstLinkRef} // accepts RefObject<HTMLAnchorElement | null>
                sheetRef={sheetRef} // accepts RefObject<HTMLDivElement | null>
              />
            </div>
          </DeviceFrame>
        ) : (
          <div style={wrapper}>
            <Bar
              design={design}
              open={open}
              setOpen={setOpen}
              desktopOnlyStyle={desktopOnlyStyle}
              mobileOnlyStyle={mobileOnlyStyle}
              triggerRef={triggerRef}
              menuId={menuId}
            />
          </div>
        )}
      </div>

      <ViewportControls
        mode={mode}
        setMode={setMode}
        mobileWidth={mobileWidth}
        setMobileWidth={setMobileWidth}
        mobileHeight={mobileHeight}
      />
    </div>
  );
}

/* ---------------- pieces ---------------- */

function Bar({
  design,
  open,
  setOpen,
  desktopOnlyStyle,
  mobileOnlyStyle,
  triggerRef,
  menuId,
}: {
  design: NavbarDesign;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  desktopOnlyStyle: React.CSSProperties;
  mobileOnlyStyle: React.CSSProperties;
  // FIX: allow nullable ref object
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  menuId: string;
}) {
  const mm = design.layout.mobileMenu;

  const renderHamburger = () => {
    const t = mm.hamburgerThickness;
    const common = { height: t, width: 16, background: design.colors.fg };
    if (mm.hamburgerVariant === "dots") {
      const s = Math.max(2, t + 2);
      return (
        <div className="flex items-center gap-[3px]">
          <div
            style={{
              width: s,
              height: s,
              background: design.colors.fg,
              borderRadius: s,
            }}
          />
          <div
            style={{
              width: s,
              height: s,
              background: design.colors.fg,
              borderRadius: s,
            }}
          />
          <div
            style={{
              width: s,
              height: s,
              background: design.colors.fg,
              borderRadius: s,
            }}
          />
        </div>
      );
    }
    const rounded = mm.hamburgerVariant === "roundedBars" ? t : 0;
    return (
      <div className="space-y-[3px]">
        <div style={{ ...common, borderRadius: rounded }} />
        <div style={{ ...common, borderRadius: rounded }} />
        <div style={{ ...common, borderRadius: rounded }} />
      </div>
    );
  };

  return (
    <div
      className="flex items-center justify-between"
      style={{
        height: design.layout.height,
        padding: `0 ${design.layout.paddingX}px`,
      }}
      role="banner"
    >
      {design.structure.showBrand && (
        <div
          className="text-sm font-semibold"
          style={{ color: design.colors.titleFg }}
        >
          UISmith
        </div>
      )}

      {design.structure.showDesktopNav && (
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center"
          style={{
            gap: design.layout.gap,
            color: design.colors.bodyFg,
            ...desktopOnlyStyle,
          }}
        >
          <ul className="flex items-center" style={{ gap: design.layout.gap }}>
            {design.structure.navItems.map((item, i) => (
              <li key={i}>
                <a
                  className="text-xs opacity-90 hover:opacity-100 cursor-default"
                  href="#"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="flex items-center" style={{ gap: design.layout.gap }}>
        {design.structure.showActions && (
          <>
            <button
              className="text-[11px] rounded-full px-3 py-2 border"
              style={{
                borderColor: `${design.colors.fg}33`,
                color: design.colors.fg,
                ...desktopOnlyStyle,
              }}
            >
              {design.structure.secondaryCta}
            </button>
            <button
              className="text-[11px] rounded-full px-3 py-2 font-semibold"
              style={{
                background: design.colors.accent,
                color: "#0b0f17",
                ...desktopOnlyStyle,
              }}
            >
              {design.structure.primaryCta}
            </button>
          </>
        )}

        {design.structure.showHamburger && (
          <button
            ref={triggerRef}
            className="md:hidden inline-flex items-center justify-center rounded-md border"
            style={{
              borderColor: `${design.colors.fg}26`,
              ...mobileOnlyStyle,
              minWidth: 44,
              minHeight: 44,
              padding: 0,
            }}
            aria-label="Toggle mobile navigation"
            aria-controls={menuId}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {renderHamburger()}
          </button>
        )}
      </div>
    </div>
  );
}

function MobileSheet({
  design,
  open,
  menuId,
  firstLinkRef,
  sheetRef,
}: {
  design: NavbarDesign;
  open: boolean;
  menuId: string;
  // FIX: allow nullable ref objects
  firstLinkRef: React.RefObject<HTMLAnchorElement | null>;
  sheetRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (!open) return null;

  const mm = design.layout.mobileMenu;

  const radiusStyle: React.CSSProperties =
    mm.radiusMode === "uniform"
      ? { borderRadius: mm.radius }
      : {
          borderTopLeftRadius: mm.radiusTL,
          borderTopRightRadius: mm.radiusTR,
          borderBottomRightRadius: mm.radiusBR,
          borderBottomLeftRadius: mm.radiusBL,
        };

  const isFull = mm.widthMode === "full";
  const hoverClass =
    mm.hoverEffect === "fade"
      ? "opacity-90 hover:opacity-100 transition-opacity"
      : mm.hoverEffect === "scale"
      ? "transform hover:scale-[1.02] transition-transform"
      : mm.hoverEffect === "scaleFade"
      ? "opacity-90 hover:opacity-100 transform hover:scale-[1.02] transition-all"
      : "";

  return (
    <div
      className="border-t px-3 py-2"
      style={{
        borderTop: `1px solid ${design.colors.border}`,
        background: "transparent",
        color: design.colors.bodyFg,
      }}
      role="region"
      aria-label="Mobile navigation"
    >
      <div
        ref={sheetRef}
        id={menuId}
        className="overflow-hidden"
        style={{
          background: mm.bg || design.colors.footerBg,
          width: isFull ? "100%" : mm.contextualWidth,
          marginLeft: mm.align === "left" ? 0 : "auto",
          marginRight: mm.align === "right" ? 0 : "auto",
          ...radiusStyle,
        }}
      >
        <ul>
          {design.structure.navItems.map((item, i) => (
            <li key={i}>
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                className={`block py-2 px-3 text-xs ${hoverClass}`}
                href="#"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Fixed-size phone frame; content scrolls, frame does not resize */
function DeviceFrame({
  width,
  height,
  border,
  children,
}: {
  width: number;
  height: number;
  border: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mt-4 overflow-hidden"
      style={{
        width,
        height,
        borderRadius: 28,
        border: `1px solid ${border}`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        background: "#0b0f17",
      }}
    >
      <div className="h-4 relative">
        <div className="absolute left-1/2 top-1.5 -translate-x-1/2 h-3 w-24 rounded-full bg-black/40" />
      </div>
      <div
        style={{
          height: "calc(100% - 40px)",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>
      <div className="h-6 flex items-center justify-center">
        <div className="h-1 w-16 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

/** Bottom center controls: fixed so it never gets clipped */
function ViewportControls({
  mode,
  setMode,
  mobileWidth,
  setMobileWidth,
  mobileHeight,
  dockPx = 96,
  gapPx = 16,
}: {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  mobileWidth: number;
  setMobileWidth: (n: number) => void;
  mobileHeight: number;
  dockPx?: number;
  gapPx?: number;
}) {
  return (
    <div
      className="fixed inset-x-0 z-[70] flex justify-center pointer-events-none"
      style={{ bottom: dockPx + gapPx }}
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-2 py-1 backdrop-blur">
        <button
          className={`px-2 py-1 text-xs rounded-full ${
            mode === "desktop" ? "bg-white/10" : "hover:bg-white/5"
          }`}
          onClick={() => setMode("desktop")}
        >
          Desktop
        </button>
        <button
          className={`px-2 py-1 text-xs rounded-full ${
            mode === "mobile" ? "bg-white/10" : "hover:bg-white/5"
          }`}
          onClick={() => setMode("mobile")}
        >
          Mobile
        </button>

        {mode === "mobile" && (
          <div className="ml-1 flex items-center gap-1">
            <span className="text-xs text-slate-400">W</span>
            <select
              className="bg-slate-800/70 border border-white/10 rounded px-2 py-1 text-xs"
              value={mobileWidth}
              onChange={(e) => setMobileWidth(parseInt(e.target.value))}
            >
              <option value={320}>320</option>
              <option value={360}>360</option>
              <option value={390}>390</option>
              <option value={414}>414</option>
              <option value={428}>428</option>
            </select>
            <span className="text-xs text-slate-400">×</span>
            <span className="text-xs text-slate-300 tabular-nums">
              {mobileHeight}
            </span>
            <span className="text-xs text-slate-400">px</span>
          </div>
        )}
      </div>
    </div>
  );
}
