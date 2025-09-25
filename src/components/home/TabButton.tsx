export default function TabButton({
  id,
  active,
  onClick,
  label,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      className="relative inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
      onClick={onClick}
      style={{
        color: active
          ? "#0b0f17"
          : "color-mix(in srgb, var(--body-fg) 92%, transparent)",
      }}
    >
      {/* selection pill */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: active
            ? "color-mix(in srgb, var(--accent) 55%, transparent)"
            : "transparent",
          boxShadow: active
            ? "0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent)"
            : "none",
          transform: active ? "translateZ(0)" : undefined,
        }}
      />
      <span className="relative">{label}</span>
    </button>
  );
}
