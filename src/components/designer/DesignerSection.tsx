"use client";
import React from "react";

export function DesignerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4">
      <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
      <div className="my-3 border-t border-white/10" />
    </section>
  );
}
