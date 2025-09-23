"use client";

import * as React from "react";
import Link from "next/link";
import GlobalConfigDialog from "@/components/home/GlobalConfigDialog";
import { useConfig } from "@/app/providers/ConfigProvider";

export default function Navbar() {
  const { config } = useConfig();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{
          borderColor: "color-mix(in srgb, var(--border) 70%, transparent)",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--bg) 75%, transparent), color-mix(in srgb, var(--bg) 40%, transparent))",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--title-fg), var(--accent))",
              }}
            >
              UISmith
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="hidden sm:block text-xs md:text-sm"
              style={{
                color: "color-mix(in srgb, var(--fg) 75%, transparent)",
              }}
            >
              Design <span className="opacity-50 mx-1">→</span> Export{" "}
              <span className="opacity-50 mx-1">→</span> Drop-in
            </div>

            <button
              onClick={() => setOpen(true)}
              className="group relative rounded-full px-3 py-1.5 text-xs md:text-sm font-medium"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--accent) 16%, transparent), color-mix(in srgb, var(--accent) 6%, transparent))",
                color: "var(--fg)",
                border:
                  "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))",
                boxShadow:
                  "0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent)",
              }}
              title="Global configuration"
            >
              <span className="inline-flex items-center gap-2">
                <GearIcon />
                Settings
              </span>
              <span
                className="pointer-events-none absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                style={{
                  boxShadow:
                    "0 0 40px color-mix(in srgb, var(--accent) 35%, transparent)",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      <GlobalConfigDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function GearIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M19 12a7 7 0 0 0-.11-1.2l2.02-1.57-2-3.46-2.44.98A7.04 7.04 0 0 0 14.2 5l-.2-2h-4l-.2 2a7.04 7.04 0 0 0-2.27.75l-2.44-.98-2 3.46 2.02 1.57A7 7 0 0 0 5 12c0 .41.04.81.11 1.2l-2.02 1.57 2 3.46 2.44-.98c.7.33 1.45.58 2.27.75l.2 2h4l.2-2c.82-.17 1.57-.42 2.27-.75l2.44.98 2-3.46-2.02-1.57c.07-.39.11-.79.11-1.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".7"
      />
    </svg>
  );
}
