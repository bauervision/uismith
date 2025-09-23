"use client";

import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useTheme } from "../providers/ThemeProvider";
import {
  packageJsonTemplate,
  readmeTemplate,
  indexTsTemplate,
  tokensCssTemplate,
  themeTsTemplate,
  providerTsxTemplate,
  shadowTsTemplate,
  navbarTsxTemplate,
  dialogTsxTemplate,
  dataProviderTsxTemplate,
  dataTypesTsTemplate,
  dataUtilTsTemplate,
} from "@/lib/export/templates";

export default function ExporterPage() {
  const { theme } = useTheme();
  const [name, setName] = React.useState("app-ui");
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const exportZip = async () => {
    setBusy(true);
    setDone(false);
    try {
      const zip = new JSZip();
      const root = zip.folder(name)!;

      root.file("package.json", packageJsonTemplate(name));
      root.file("README.md", readmeTemplate(name));
      root.file("index.ts", indexTsTemplate());

      root.folder("styles")!.file("tokens.css", tokensCssTemplate(theme));
      root
        .folder("providers")!
        .file("ThemeProvider.tsx", providerTsxTemplate());
      const lib = root.folder("lib")!;
      lib.file("theme.ts", themeTsTemplate());
      lib.file("shadow.ts", shadowTsTemplate());

      root
        .folder("components/navigation")!
        .file("Navbar.tsx", navbarTsxTemplate());
      root
        .folder("components/feedback")!
        .file("Dialog.tsx", dialogTsxTemplate());

      root
        .folder("providers")!
        .file("DataProvider.tsx", dataProviderTsxTemplate());
      const dataLib = root.folder("lib")!.folder("data")!;
      dataLib.file("types.ts", dataTypesTsTemplate());
      dataLib.file("util.ts", dataUtilTsTemplate());

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${name}.zip`);
      setDone(true);
    } finally {
      setBusy(false);
      setTimeout(() => setDone(false), 1500);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-4">
      <h1 className="text-xl font-semibold">Export Library</h1>
      <label className="block">
        <div className="text-sm text-slate-400 mb-1">Folder name</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.trim() || "app-ui")}
          className="h-10 w-full rounded-md border border-white/10 bg-slate-900/70 px-3"
          placeholder="my-ui-kit"
        />
      </label>
      <button
        onClick={exportZip}
        disabled={busy}
        className="rounded-md px-4 py-2 border border-white/10 bg-emerald-500/90 text-slate-900 font-semibold disabled:opacity-60"
      >
        {busy ? "Building…" : done ? "Exported ✓" : "Export Library (zip)"}
      </button>
      <p className="text-xs text-slate-400">
        Exports the current theme tokens and the Navbar + Dialog components into{" "}
        <code>&lt;name&gt;/</code>.
      </p>
    </div>
  );
}
