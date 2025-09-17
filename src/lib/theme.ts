export type UISmithTheme = {
  bg: string;
  fg: string;
  accent: string;
  border: string;
  titleFg: string;
  bodyFg: string;
  footerBg: string; // usually "transparent"
};

export const defaultTheme: UISmithTheme = {
  bg: "#0f172a",
  fg: "#e2e8f0",
  accent: "#22c55e",
  border: "#334155",
  titleFg: "#f8fafc",
  bodyFg: "#cbd5e1",
  footerBg: "transparent",
};

export type ThemeLocks = {
  bg: boolean;
  fg: boolean;
  accent: boolean;
  border: boolean;
  titleFg: boolean;
  bodyFg: boolean;
  footerBg: boolean;
};

export const defaultThemeLocks: ThemeLocks = {
  bg: false,
  fg: false,
  accent: false,
  border: false,
  titleFg: false,
  bodyFg: false,
  footerBg: false,
};

/** Generate a dark UI theme. Respects locks: locked fields are copied from `base`. */
export function generateTheme(
  base: UISmithTheme,
  locks: ThemeLocks,
  seed?: number
): UISmithTheme {
  // PRNG (mulberry32) for reproducible cycles if a seed is passed
  let s = (seed ?? Date.now()) >>> 0;
  const rand = () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Pick a base hue and derive a palette
  const H = Math.floor(rand() * 360);
  const bg = hslToHex(
    H,
    clamp(22 + rand() * 12, 20, 40),
    clamp(9 + rand() * 6, 6, 16)
  ); // dark
  const border = hslToHex(
    H,
    clamp(18 + rand() * 10, 12, 32),
    clamp(18 + rand() * 10, 14, 30)
  ); // slightly lighter than bg
  const fg = hslToHex(H, 8, 92); // near white with tiny tint
  const titleFg = hslToHex(H, 6, 96);
  const bodyFg = hslToHex(H, 8, 78);
  const accent = hslToHex(
    (H + Math.floor(rand() * 50) + 310) % 360,
    clamp(60 + rand() * 20, 60, 85),
    clamp(48 + rand() * 10, 45, 60)
  );
  const footerBg = "transparent";

  const gen: UISmithTheme = {
    bg,
    fg,
    accent,
    border,
    titleFg,
    bodyFg,
    footerBg,
  };

  // Apply locks
  return {
    bg: locks.bg ? base.bg : gen.bg,
    fg: locks.fg ? base.fg : gen.fg,
    accent: locks.accent ? base.accent : gen.accent,
    border: locks.border ? base.border : gen.border,
    titleFg: locks.titleFg ? base.titleFg : gen.titleFg,
    bodyFg: locks.bodyFg ? base.bodyFg : gen.bodyFg,
    footerBg: locks.footerBg ? base.footerBg : gen.footerBg,
  };
}

/* ---------- tiny color utils (hex <-> hsl) ---------- */

type HSL = { h: number; s: number; l: number };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function hexToHsl(hex: string): HSL {
  const m = hex.replace("#", "");
  const bigint = parseInt(
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m,
    16
  );
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}
