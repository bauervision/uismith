"use client";
import React, { useState } from "react";
import type { DialogDesign } from "@/lib/design/dialog";
import {
  buildSingleFileDialog,
  buildTwoFileDialog,
  buildTestDialogUsage,
} from "@/lib/export/dialog";
import { downloadZip } from "@/lib/download/zip";

export default function ExportToolbar({ design }: { design: DialogDesign }) {
  const [includeTest, setIncludeTest] = useState(true);
  const [nextClient, setNextClient] = useState(true);

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <div className="h-12 z-30 border-b border-white/10 bg-slate-750/70 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50">
        <div className="px-4 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold">Toolbar</span>
            <span className="text-slate-400">Component:</span>
            <code className="px-2 py-0.5 rounded bg-slate-800/60 border border-white/10">
              {design.name}
            </code>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={nextClient}
                onChange={(e) => setNextClient(e.target.checked)}
              />
              Next.js: <code>'use client'</code>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeTest}
                onChange={(e) => setIncludeTest(e.target.checked)}
              />
              Include test file
            </label>
            <button
              className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600"
              onClick={() => {
                const { filename, code } = buildSingleFileDialog(design, {
                  nextClient,
                });
                navigator.clipboard.writeText(code);
                alert(`Copied ${filename} to clipboard`);
              }}
            >
              Copy single-file
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
              Download ZIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
