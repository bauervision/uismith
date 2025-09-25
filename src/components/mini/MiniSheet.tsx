"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UISmithTheme } from "@/lib/theme";
import { useMotionMode } from "@/app/hooks/useMotionMode";

const easeSnap: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function MiniSheet({ theme }: { theme: UISmithTheme }) {
  const mode = useMotionMode();
  const [open, setOpen] = React.useState(false);

  const dur = mode === "reduced" ? 0.12 : 0.22;

  const Container: any = mode === "off" ? "div" : motion.div;

  return (
    <Container
      className="mt-3 rounded-xl border p-3"
      style={{
        background: theme.bg,
        color: theme.fg,
        borderColor: theme.border,
      }}
      {...(mode !== "off"
        ? {
            initial: { opacity: 0, y: 6 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: dur, ease: easeSnap },
          }
        : {})}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold" style={{ color: theme.titleFg }}>
          Sheet
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className="text-[11px] rounded-full px-2 py-1 font-semibold"
          style={{ background: theme.accent, color: "#0b0f17" }}
        >
          Open
        </button>
      </div>

      {/* Overlay + Panel */}
      {mode === "off" ? (
        open && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0"
              style={{ background: `${theme.fg}26` }}
              onClick={() => setOpen(false)}
            />
            <div
              className="absolute right-0 top-0 h-full w-[280px] border-l p-3"
              role="dialog"
              aria-modal="true"
              aria-label="Mini sheet"
              style={{
                background: theme.bg,
                borderColor: theme.border,
                color: theme.fg,
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="text-xs font-semibold"
                  style={{ color: theme.titleFg }}
                >
                  Panel
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-[11px] rounded-md px-2 py-1"
                  style={{ border: `1px solid ${theme.fg}33` }}
                >
                  Close
                </button>
              </div>
              <div className="mt-2 text-[11px]" style={{ color: theme.bodyFg }}>
                Edge-docked panel content…
              </div>
            </div>
          </div>
        )
      ) : (
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-50" initial={false}>
              {/* overlay */}
              <motion.button
                aria-label="Close"
                className="absolute inset-0"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur, ease: easeSnap }}
                style={{ background: `${theme.fg}26` }}
              />
              {/* panel */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Mini sheet"
                className="absolute right-0 top-0 h-full w-[280px] border-l p-3"
                style={{
                  background: theme.bg,
                  borderColor: theme.border,
                  color: theme.fg,
                }}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: dur, ease: easeSnap }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="text-xs font-semibold"
                    style={{ color: theme.titleFg }}
                  >
                    Panel
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-[11px] rounded-md px-2 py-1"
                    style={{ border: `1px solid ${theme.fg}33` }}
                  >
                    Close
                  </button>
                </div>
                <div
                  className="mt-2 text-[11px]"
                  style={{ color: theme.bodyFg }}
                >
                  Edge-docked panel content…
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Container>
  );
}
