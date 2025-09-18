// Contrast + color utilities and "Fix All" helpers

export function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const s =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex(r: number, g: number, b: number) {
  const to = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
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
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

export function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
  } else if (120 <= h && h < 180) {
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function relLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b]
    .map((v) => v / 255)
    .map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function contrastRatio(fg: string, bg: string) {
  const L1 = relLuminance(fg);
  const L2 = relLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type A11yIssue = {
  id: string;
  message: string;
  ratio: number;
  required: number;
};

export function checkThemeContrast({
  bg,
  fg,
  titleFg,
  bodyFg,
  accent,
  border,
}: {
  bg: string;
  fg: string;
  titleFg: string;
  bodyFg: string;
  accent: string;
  border: string;
}): A11yIssue[] {
  const issues: A11yIssue[] = [];
  const push = (id: string, message: string, ratio: number, required: number) =>
    issues.push({
      id,
      message,
      ratio: Math.round(ratio * 100) / 100,
      required,
    });

  const rBody = contrastRatio(bodyFg, bg);
  if (rBody < 4.5)
    push("body", `Body text contrast too low (${rBody}:1)`, rBody, 4.5);

  const rTitle = contrastRatio(titleFg, bg);
  if (rTitle < 3)
    push("title", `Title contrast may be low (${rTitle}:1)`, rTitle, 3);

  const rUI = contrastRatio(fg, bg);
  if (rUI < 3)
    push("ui", `UI foreground contrast may be low (${rUI}:1)`, rUI, 3);

  const rBtn = contrastRatio(accent, "#0b0f17");
  if (rBtn < 4.5)
    push("btn", `Primary button text contrast too low (${rBtn}:1)`, rBtn, 4.5);

  const rBorder = contrastRatio(border, bg);
  if (rBorder < 1.5)
    push(
      "border",
      `Border may be indistinguishable from background (${rBorder}:1)`,
      rBorder,
      1.5
    );

  return issues;
}

/* ---------- Fixers ---------- */

/**
 * Adjust `fg` lightness (keeping hue/sat) until it meets required contrast vs `bg`.
 * Prefers minimal change. Returns a hex.
 */
export function tuneToContrast(fgHex: string, bgHex: string, required: number) {
  const bgL = relLuminance(bgHex);
  const startRatio = contrastRatio(fgHex, bgHex);
  if (startRatio >= required) return fgHex;

  // target luminance bounds from algebra:
  // If L* >= Lbg -> L* >= required*(Lbg+0.05) - 0.05
  // If L* <= Lbg -> L* <= (Lbg+0.05)/required - 0.05
  const upTarget = required * (bgL + 0.05) - 0.05; // luminance above bg
  const downTarget = (bgL + 0.05) / required - 0.05; // luminance below bg

  const { r, g, b } = hexToRgb(fgHex);
  const { h, s, l } = rgbToHsl(r, g, b);

  const trySolve = (goLighter: boolean) => {
    // binary search on HSL lightness to reach target luminance band
    let lo = 0,
      hi = 1;
    let bestHex = fgHex,
      bestDelta = Infinity;

    for (let i = 0; i < 18; i++) {
      const mid = goLighter ? l + (hi - l) * (i / 18) : l - (l - lo) * (i / 18);
      const { r, g, b } = hslToRgb(h, s, Math.max(0, Math.min(1, mid)));
      const hex = rgbToHex(r, g, b);
      const ratio = contrastRatio(hex, bgHex);
      const delta = Math.abs(mid - l);
      if (ratio >= required && delta < bestDelta) {
        bestDelta = delta;
        bestHex = hex;
      }
    }
    return bestHex;
  };

  const fgL = relLuminance(fgHex);
  // decide which side needs less movement (toward upTarget or downTarget)
  const moveUp = Math.max(0, upTarget - fgL);
  const moveDown = Math.max(0, fgL - downTarget);
  const preferLighten = moveUp <= moveDown;

  const hex1 = trySolve(preferLighten);
  const hex2 = trySolve(!preferLighten);
  // pick the one with the better ratio, tie-break by minimal delta from original
  const choose = (a: string, b: string) => {
    const ra = contrastRatio(a, bgHex);
    const rb = contrastRatio(b, bgHex);
    if (ra >= required && rb >= required) {
      // both pass: pick closer lightness to original
      const aRgb = hexToRgb(a);
      const bRgb = hexToRgb(b);
      const la = rgbToHsl(aRgb.r, aRgb.g, aRgb.b).l;
      const lb = rgbToHsl(bRgb.r, bRgb.g, bRgb.b).l;
      return Math.abs(la - l) <= Math.abs(lb - l) ? a : b;
    }
    return ra >= rb ? a : b;
  };

  return choose(hex1, hex2);
}

/** Fix all theme colors to meet baseline WCAG heuristics */
export function fixAllThemeColors<
  T extends {
    bg: string;
    fg: string;
    titleFg: string;
    bodyFg: string;
    accent: string;
    border: string;
  }
>(theme: T): T {
  const next = { ...theme };

  next.bodyFg = tuneToContrast(next.bodyFg, next.bg, 4.5);
  next.titleFg = tuneToContrast(next.titleFg, next.bg, 3.0);
  next.fg = tuneToContrast(next.fg, next.bg, 3.0);
  next.accent = tuneToContrast(next.accent, "#0b0f17", 4.5);
  next.border = tuneToContrast(next.border, next.bg, 1.5);

  return next;
}
