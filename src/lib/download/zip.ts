// /lib/download/zip.ts
"use client";
import JSZip from "jszip";

export async function downloadZip(
  zipName: string,
  files: { filename: string; code: string }[]
) {
  const zip = new JSZip();
  for (const f of files) zip.file(f.filename, f.code);
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName.endsWith(".zip") ? zipName : `${zipName}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
