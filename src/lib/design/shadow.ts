// /lib/design/shadow.ts
export function mapShadowToBoxShadow(n: number) {
  const s = Math.max(0, n);
  const alpha = Math.min(0.45, 0.05 + s / 100);
  const blur = 8 + s * 1.2;
  const spread = Math.floor(s / 12);
  const y = Math.ceil(s / 8);
  return `0 ${y}px ${Math.ceil(blur)}px ${spread}px rgba(0,0,0,${alpha})`;
}
