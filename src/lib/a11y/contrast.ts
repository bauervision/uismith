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

  // Normal text (body) 4.5:1, Titles (assume large) 3:1, Buttons (accent vs #0b0f17) 4.5:1
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

  // Borders should be visible (heuristic vs bg)
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
