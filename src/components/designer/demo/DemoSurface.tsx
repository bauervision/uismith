"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/app/providers/ThemeProvider";

import MiniNavbar from "@/components/mini/MiniNavbar";
import MiniButton from "@/components/mini/MiniButton";
import MiniDialog from "@/components/mini/MiniDialog";
import MiniLogin from "@/components/mini/MiniLogin";
import MiniSheet from "@/components/mini/MiniSheet";
import MiniTabs from "@/components/mini/MiniTabs";

import DemoColorDock from "./DemoColorDock";

export default function DemoSurface() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* User-designed Navbar preview (no UiSmith navbar on this page) */}
      <div className="sticky top-0 z-40">
        <MiniNavbar theme={theme} />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <h1
          className="text-3xl font-semibold tracking-tight"
          style={{ color: theme.titleFg }}
        >
          Full-page Component Demo
        </h1>
        <p className="mt-2 max-w-prose" style={{ color: theme.bodyFg }}>
          Preview how your theme and motion settings look across all components
          together.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="#login"
            className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm hover:bg-white/5"
          >
            Jump to Login
          </Link>
        </div>
      </section>

      {/* Grid of Minis */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Buttons */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2
              className="text-lg font-medium"
              style={{ color: theme.titleFg }}
            >
              Buttons
            </h2>
            <p className="mt-1 text-sm" style={{ color: theme.bodyFg }}>
              Compare primary, ghost, and disabled states.
            </p>
            <MiniButton theme={theme} />
          </div>

          {/* Dialog (card-style mini) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2
              className="text-lg font-medium"
              style={{ color: theme.titleFg }}
            >
              Dialog (preview)
            </h2>
            <p className="mt-1 text-sm" style={{ color: theme.bodyFg }}>
              Static dialog layout to validate type scale and contrast.
            </p>
            <MiniDialog theme={theme} />
          </div>

          {/* Sheet (opens overlay) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2
              className="text-lg font-medium"
              style={{ color: theme.titleFg }}
            >
              Sheet
            </h2>
            <p className="mt-1 text-sm" style={{ color: theme.bodyFg }}>
              Open the edge-docked panel to test overlay + motion.
            </p>
            <MiniSheet theme={theme} />
          </div>

          {/* Tabs */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2
              className="text-lg font-medium"
              style={{ color: theme.titleFg }}
            >
              Tabs
            </h2>
            <p className="mt-1 text-sm" style={{ color: theme.bodyFg }}>
              Animated selection pill (respects motion mode).
            </p>
            <MiniTabs theme={theme} />
          </div>

          {/* Login */}
          <div
            id="login"
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <h2
              className="text-lg font-medium"
              style={{ color: theme.titleFg }}
            >
              Login
            </h2>
            <p className="mt-1 text-sm" style={{ color: theme.bodyFg }}>
              Form fields, labels, and actions.
            </p>
            <MiniLogin theme={theme} />
          </div>

          {/* Navbar in isolation (optional second view) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2
              className="text-lg font-medium"
              style={{ color: theme.titleFg }}
            >
              Navbar (card)
            </h2>
            <p className="mt-1 text-sm" style={{ color: theme.bodyFg }}>
              Also view navbar in a contained card.
            </p>
            <MiniNavbar theme={theme} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="mt-auto w-full py-10"
        style={{ background: theme.footerBg }}
      >
        <div
          className="mx-auto max-w-7xl px-6 text-sm"
          style={{ color: theme.bodyFg }}
        >
          Footer area respects your theme tokens.
        </div>
      </footer>

      {/* Collapsible ColorDock (bottom-left) */}
      <DemoColorDock />
    </div>
  );
}
