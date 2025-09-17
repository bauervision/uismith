"use client";
import React, { useState } from "react";
import type { DialogDesign } from "@/lib/design/dialog";
import {
  buildSingleFileDialog,
  buildTwoFileDialog,
  buildTestDialogUsage,
} from "@/lib/export/dialog";
import { downloadZip } from "@/lib/download/zip";

export default function ExportPanel({ design }: { design: DialogDesign }) {
  const [includeTest, setIncludeTest] = useState(true);
  const [nextClient, setNextClient] = useState(true);

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <header className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Export</h2>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nextClient}
              onChange={(e) => setNextClient(e.target.checked)}
            />
            Next.js: add <code>'use client'</code>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeTest}
              onChange={(e) => setIncludeTest(e.target.checked)}
            />
            Include test file
          </label>
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-sm"
          onClick={() => {
            const { filename, code } = buildSingleFileDialog(design, {
              nextClient,
            });
            navigator.clipboard.writeText(code);
            alert(`Copied ${filename} to clipboard`);
          }}
        >
          Copy single-file .tsx
        </button>

        <button
          className="px-3 py-1.5 rounded-md bg-emerald-500 text-slate-900 font-semibold"
          onClick={async () => {
            const files = buildTwoFileDialog(design, { nextClient });
            if (includeTest)
              files.push(buildTestDialogUsage(design, { nextClient }));
            await downloadZip(design.name || "UISmithDialog", files);
          }}
        >
          Download ZIP (.tsx + .module.css{includeTest ? " + .test.tsx" : ""})
        </button>
      </div>
    </section>
  );
}
