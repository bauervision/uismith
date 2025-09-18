"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* ---------- internal types & helpers ---------- */
type Info = {
  tag: string;
  role?: string;
  implicitRole?: string;
  name?: string;
  aria: Array<{ k: string; v: string }>;
  tabIndex?: number;
  id?: string;
  checks: string[];
};

function isElement(n: any): n is Element {
  return n && n.nodeType === 1;
}
function implicitRoleFor(el: Element): string | undefined {
  const tag = el.tagName.toLowerCase();
  if (tag === "nav") return "navigation";
  if (tag === "a" && (el as HTMLAnchorElement).hasAttribute("href"))
    return "link";
  if (tag === "button") return "button";
  if (tag === "header") return "banner";
  if (tag === "footer") return "contentinfo";
  if (tag === "main") return "main";
  if (tag === "aside") return "complementary";
  if (tag === "form") return "form";
  if (tag === "dialog") return "dialog";
  return undefined;
}
function getAccessibleName(el: Element): string | undefined {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel.trim();
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const ids = labelledby.split(/\s+/);
    const txt = ids
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean)
      .join(" ");
    if (txt) return txt;
  }
  const tag = el.tagName.toLowerCase();
  if (tag === "button" || tag === "a")
    return (el as HTMLElement).innerText?.trim() || undefined;
  return undefined;
}
function gatherInfo(el: Element): Info {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute("role") || undefined;
  const implicitRole = role ? undefined : implicitRoleFor(el);
  const name = getAccessibleName(el);
  const aria: Array<{ k: string; v: string }> = [];
  for (let i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i];
    if (a.name.startsWith("aria-")) aria.push({ k: a.name, v: a.value });
  }
  const tabIndexAttr = el.getAttribute("tabindex");
  const tabIndex =
    tabIndexAttr != null
      ? parseInt(tabIndexAttr, 10)
      : (el as HTMLElement).tabIndex;
  const id = el.getAttribute("id") || undefined;

  const checks: string[] = [];
  if (role === "dialog" || implicitRole === "dialog") {
    if (el.getAttribute("aria-modal") !== "true")
      checks.push("Dialog: aria-modal missing/false");
    const hasLabel = !!name || !!el.getAttribute("aria-labelledby");
    if (!hasLabel) checks.push("Dialog: missing accessible name");
  }
  if (tag === "button" && el.getAttribute("aria-controls")) {
    if (!el.hasAttribute("aria-expanded"))
      checks.push("Button: aria-controls without aria-expanded");
  }
  if (role === "navigation" || implicitRole === "navigation" || tag === "nav") {
    if (!el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby"))
      checks.push("Nav: add aria-label or aria-labelledby");
  }

  return { tag, role, implicitRole, name, aria, tabIndex, id, checks };
}
function within(container: HTMLElement, el: Element | null) {
  if (!el) return false;
  return container === el || container.contains(el);
}
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/* ---------- component ---------- */

export default function A11yMagnifier({
  containerRef,
  hotkey = "KeyI", // Alt+I toggles
  initialOpen = false,
  dockPx = 96, // height of ColorDockBar
  gapPx = 16, // gap above the dock
  side = "right", // place button to left|right of center
  offsetPx = 180, // distance from exact center (positive)
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  hotkey?: string;
  initialOpen?: boolean;
  dockPx?: number;
  gapPx?: number;
  side?: "left" | "right";
  offsetPx?: number;
}) {
  const [active, setActive] = useState(initialOpen);
  const [pinned, setPinned] = useState<Element | null>(null);
  const [hover, setHover] = useState<Element | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const target = pinned ?? hover;
  const info = useMemo<Info | null>(
    () => (target ? gatherInfo(target) : null),
    [target]
  );

  // Keyboard toggle (Alt+I) + Esc to exit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.code === hotkey) {
        e.preventDefault();
        setActive((v) => !v);
      }
      if (active && e.key === "Escape") {
        setActive(false);
        setPinned(null);
        setHover(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, hotkey]);

  // Mouse move tracking within the preview container
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !active) return;
    const onMove = (e: MouseEvent) => {
      if (pinned) return;
      setMouse({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!isElement(el) || !within(root, el)) {
        setHover(null);
        setRect(null);
        return;
      }
      setHover(el);
      setRect(el.getBoundingClientRect());
    };
    const onLeave = () => {
      if (!pinned) {
        setHover(null);
        setRect(null);
      }
    };
    window.addEventListener("mousemove", onMove, true);
    root.addEventListener("mouseleave", onLeave, true);
    return () => {
      window.removeEventListener("mousemove", onMove, true);
      root.removeEventListener("mouseleave", onLeave, true);
    };
  }, [active, pinned, containerRef]);

  // Pin/unpin on click inside container when active
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !active) return;
    const onClick = (e: MouseEvent) => {
      if (!active) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!isElement(el) || !within(root, el)) return;
      if (pinned && pinned === el) setPinned(null);
      else {
        setPinned(el);
        setRect(el.getBoundingClientRect());
      }
    };
    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, [active, pinned, containerRef]);

  // Keep rect in sync
  useEffect(() => {
    if (!target) return;
    const on = () => setRect(target.getBoundingClientRect());
    window.addEventListener("resize", on);
    window.addEventListener("scroll", on, true);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("scroll", on, true);
    };
  }, [target]);

  // Panel position near cursor/rect (top-left of panel)
  const panelPos = useMemo(() => {
    if (!rect) return null;
    const vw = window.innerWidth,
      vh = window.innerHeight;
    const baseX = mouse?.x ?? rect.left + rect.width / 2;
    const baseY = mouse?.y ?? rect.top;
    const x = clamp(baseX + 12, 8, vw - 280 - 8); // 280px panel width
    const y = clamp(baseY + 12, 8, vh - 160 - 8);
    return { left: x, top: y };
  }, [rect, mouse]);

  // --- UI ---

  // Off-center shift (so we can sit next to ViewportControls)
  const shift = side === "right" ? +offsetPx : -offsetPx;

  return (
    <>
      {/* bottom-center HUD button (next to ViewportControls) */}
      <div
        className="fixed inset-x-0 z-[70] flex justify-center pointer-events-none"
        style={{ bottom: dockPx + gapPx }}
      >
        <div
          className="pointer-events-auto"
          style={{ transform: `translateX(${shift}px)` }}
        >
          <button
            className={`inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs backdrop-blur ${
              active
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-slate-900/70 text-slate-200 hover:bg-white/5"
            }`}
            title="Inspect accessibility (Alt+I)"
            aria-pressed={active}
            onClick={() => setActive((v) => !v)}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>🔍</span> Inspect
            Accessibility
          </button>
        </div>
      </div>

      {/* highlight box */}
      {active && rect && (
        <div
          className="fixed pointer-events-none z-[64]"
          style={{
            left: rect.left - 2,
            top: rect.top - 2,
            width: rect.width + 4,
            height: rect.height + 4,
            border: "2px solid #22c55e",
            borderRadius: 8,
            boxShadow: "0 0 0 2px rgba(34,197,94,0.25)",
          }}
        />
      )}

      {/* info panel */}
      {active && info && panelPos && (
        <div
          className="fixed z-[66] w-[280px] rounded-xl border border-white/10 bg-slate-950/90 backdrop-blur p-3 text-xs"
          style={panelPos}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">
              {info.role ?? info.implicitRole ?? info.tag}
              {info.name ? (
                <span className="text-slate-400"> — “{info.name}”</span>
              ) : null}
            </div>
            <div className="flex items-center gap-1">
              <button
                className={`rounded px-2 py-0.5 border ${
                  pinned
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 hover:bg-white/5"
                }`}
                onClick={() =>
                  setPinned((p) => (p ? null : (target as Element)))
                }
              >
                {pinned ? "Pinned" : "Pin"}
              </button>
              <button
                className="rounded px-2 py-0.5 border border-white/10 hover:bg-white/5"
                onClick={() => {
                  setActive(false);
                  setPinned(null);
                  setHover(null);
                }}
                aria-label="Close inspector"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <Row k="Tag" v={`<${info.tag}>`} />
            {info.role && <Row k="Role" v={info.role} />}
            {!info.role && info.implicitRole && (
              <Row k="Implicit role" v={info.implicitRole} />
            )}
            {info.name && <Row k="Name" v={info.name} />}
            {info.id && <Row k="id" v={info.id} />}
            {typeof info.tabIndex === "number" && (
              <Row k="tabIndex" v={String(info.tabIndex)} />
            )}
            {info.aria.length > 0 && (
              <div>
                <div className="text-[11px] text-slate-400 mb-0.5">ARIA</div>
                <ul className="max-h-24 overflow-auto pr-1">
                  {info.aria.map(({ k, v }) => (
                    <li key={k}>
                      <code className="text-[11px] text-slate-200">{k}</code>
                      <span className="text-slate-400">=</span>
                      <span className="text-slate-300">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {info.checks.length > 0 && (
              <div className="mt-1">
                <div className="text-[11px] text-amber-300 mb-0.5">Checks</div>
                <ul className="list-disc ml-4 text-amber-200">
                  {info.checks.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-2 text-[11px] text-slate-400">
            Tip: click an element to pin. Press{" "}
            <kbd className="px-1 py-0.5 border border-white/10 rounded">
              Esc
            </kbd>{" "}
            to exit.
          </div>
        </div>
      )}
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-[11px] text-slate-400">{k}</div>
      <div
        className="text-[11px] text-slate-200 truncate max-w-[170px]"
        title={v}
      >
        {v}
      </div>
    </div>
  );
}
