// lib/export/templates.ts
import type { UISmithTheme } from "../theme";

export const packageJsonTemplate = (name: string) => `{
  "name": "${name}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
`;

export const readmeTemplate = (name: string) => `# ${name}
A tiny, copy-paste UI kit exported from UiSmith.

## Install
Copy the \`${name}/\` folder into your project (e.g. \`./ui/${name}\`).

## Setup
\`\`\`tsx
import "${name}/styles/tokens.css";
import { ThemeProvider } from "${name}/providers/ThemeProvider";
import { DataProvider } from "${name}/providers/DataProvider";
import { FetchClient } from "${name}/lib/data/types";

export default function App({ children }) {
  const client = FetchClient({ baseUrl: "/api" });
  return (
    <DataProvider client={client}>
      <ThemeProvider>{children}</ThemeProvider>
    </DataProvider>
  );
}
\`\`\`

## Use components
\`\`\`tsx
import { Navbar, Dialog } from "${name}";
\`\`\`
`;

export const indexTsTemplate = () => `export * from "./providers/ThemeProvider";
export * from "./providers/DataProvider";
export * from "./lib/theme";
export * from "./lib/data/types";
export { default as Navbar } from "./components/navigation/Navbar";
export { default as Dialog } from "./components/feedback/Dialog";
`;

export const tokensCssTemplate = (t: UISmithTheme) => `:root{
  --bg:${t.bg};
  --fg:${t.fg};
  --accent:${t.accent};
  --border:${t.border};
  --title-fg:${t.titleFg};
  --body-fg:${t.bodyFg};
  --footer-bg:${t.footerBg};
}
`;

export const themeTsTemplate = () => `export type UISmithTheme = {
  bg: string; fg: string; accent: string; border: string;
  titleFg: string; bodyFg: string; footerBg: string;
};
`;

export const providerTsxTemplate =
  () => `/* Minimal ThemeProvider (no persistence) */
"use client";
import * as React from "react";
import type { UISmithTheme } from "../lib/theme";

const DEFAULT: UISmithTheme = {
  bg: getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#0f172a",
  fg: getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#e2e8f0",
  accent: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#22c55e",
  border: getComputedStyle(document.documentElement).getPropertyValue("--border").trim() || "#334155",
  titleFg: getComputedStyle(document.documentElement).getPropertyValue("--title-fg").trim() || "#f8fafc",
  bodyFg: getComputedStyle(document.documentElement).getPropertyValue("--body-fg").trim() || "#cbd5e1",
  footerBg: getComputedStyle(document.documentElement).getPropertyValue("--footer-bg").trim() || "transparent",
};

type Ctx = {
  theme: UISmithTheme;
  setTheme: React.Dispatch<React.SetStateAction<UISmithTheme>>;
  setToken: <K extends keyof UISmithTheme>(k: K, v: UISmithTheme[K]) => void;
};
const Ctx = React.createContext<Ctx | null>(null);

function writeVars(t: UISmithTheme) {
  const r = document.documentElement;
  r.style.setProperty("--bg", t.bg);
  r.style.setProperty("--fg", t.fg);
  r.style.setProperty("--accent", t.accent);
  r.style.setProperty("--border", t.border);
  r.style.setProperty("--title-fg", t.titleFg);
  r.style.setProperty("--body-fg", t.bodyFg);
  r.style.setProperty("--footer-bg", t.footerBg);
}

export function ThemeProvider({ children, initial }: { children: React.ReactNode; initial?: Partial<UISmithTheme> }) {
  const [theme, setTheme] = React.useState<UISmithTheme>({ ...DEFAULT, ...initial });
  React.useLayoutEffect(() => { writeVars(theme); }, [theme]);
  const setToken = React.useCallback(<K extends keyof UISmithTheme>(k: K, v: UISmithTheme[K]) => setTheme(t => ({ ...t, [k]: v })), []);
  const value = React.useMemo(() => ({ theme, setTheme, setToken }), [theme]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useTheme = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useTheme must be used within ThemeProvider");
  return c;
};
`;

export const shadowTsTemplate =
  () => `export type ShadowSpec = { x:number; y:number; blur:number; spread:number; color:string; inset?:boolean }[];
export function mapShadowToBoxShadow(s: ShadowSpec | undefined) {
  if (!s || !Array.isArray(s) || s.length===0) return "none";
  return s.map(p => \`\${p.inset ? "inset " : ""}\${p.x}px \${p.y}px \${p.blur}px \${p.spread}px \${p.color}\`).join(", ");
}
`;

export const dataTypesTsTemplate =
  () => `export type QueryKey = string | [string, ...any[]];

export type QueryOptions = {
  staleTime?: number;
  revalidateOnFocus?: boolean;
  revalidateIfStale?: boolean;
};

export type RequestOptions = {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
};

export type DataClient = {
  baseUrl?: string;
  get<T = any>(path: string, opts?: RequestOptions): Promise<T>;
  post<T = any>(path: string, opts?: RequestOptions): Promise<T>;
  put<T = any>(path: string, opts?: RequestOptions): Promise<T>;
  patch<T = any>(path: string, opts?: RequestOptions): Promise<T>;
  delete<T = any>(path: string, opts?: RequestOptions): Promise<T>;
  request<T = any>(path: string, init?: RequestInit & RequestOptions): Promise<T>;
};

export type MutationFn<TArgs, TData> = (client: DataClient, args: TArgs) => Promise<TData>;

export type DataProviderHandle = {
  invalidate: (key: QueryKey) => void;
  prefetch: <T>(key: QueryKey, fn: () => Promise<T>) => Promise<T>;
  getCache: () => Map<string, any>;
};

export function FetchClient(config?: {
  baseUrl?: string;
  headers?: Record<string, string>;
  onRequest?: (init: RequestInit & RequestOptions & { url: string }) => void;
  onResponse?: (res: Response) => void;
}): DataClient {
  const baseUrl = config?.baseUrl?.replace(/\\/+\$/, "") || "";
  const defaultHeaders = config?.headers ?? {};

  const toUrl = (path: string, params?: Record<string, any>) => {
    const u = new URL(path.replace(/^\\//, ""), baseUrl || "http://local/");
    if (params) for (const [k, v] of Object.entries(params)) if (v != null) u.searchParams.set(k, String(v));
    const out = (baseUrl ? u.toString() : \`/\${u.pathname}\${u.search}\`).replace("http://local", "");
    return out;
  };

  async function request<T>(path: string, init: RequestInit & RequestOptions = {} as any): Promise<T> {
    const url = toUrl(path, init.params);
    const headers = { "Content-Type": "application/json", ...defaultHeaders, ...(init.headers ?? {}) };
    const body = init.body !== undefined ? (typeof init.body === "string" ? init.body : JSON.stringify(init.body)) : undefined;
    config?.onRequest?.({ ...(init as any), url });
    const res = await fetch(url, { ...init, headers, body });
    config?.onResponse?.(res);
    if (!res.ok) throw new Error(\`HTTP \${res.status} \${res.statusText}\`);
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return (await res.json()) as T;
    return (await res.text()) as unknown as T;
  }

  return {
    baseUrl,
    request,
    get: (p, o) => request(p, { method: "GET", ...(o ?? {}) }),
    post: (p, o) => request(p, { method: "POST", ...(o ?? {}) }),
    put: (p, o) => request(p, { method: "PUT", ...(o ?? {}) }),
    patch: (p, o) => request(p, { method: "PATCH", ...(o ?? {}) }),
    delete: (p, o) => request(p, { method: "DELETE", ...(o ?? {}) }),
  };
}
`;

export const dataUtilTsTemplate =
  () => `export function stableKey(key: any): string {
  return typeof key === "string" ? key : JSON.stringify(key, replacer);
}
function replacer(_: string, value: any) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).sort().reduce((acc, k) => { acc[k] = value[k]; return acc; }, {} as Record<string, any>);
  }
  return value;
}
`;

export const dataProviderTsxTemplate = () => `"use client";
import * as React from "react";
import { type DataClient, FetchClient, type QueryKey, type QueryOptions, type MutationFn, type DataProviderHandle } from "../lib/data/types";
import { stableKey } from "../lib/data/util";

type CacheEntry<T = any> = { data?: T; error?: any; promise?: Promise<T>; updatedAt?: number; };
type Ctx = {
  client: DataClient;
  getCache: () => Map<string, CacheEntry>;
  setCache: (k: string, v: CacheEntry) => void;
  invalidate: (key: QueryKey) => void;
  prefetch: <T>(key: QueryKey, fn: () => Promise<T>) => Promise<T>;
};
const DataCtx = React.createContext<Ctx | null>(null);

export function DataProvider({ children, client, initialCache, handleRef }:{
  children: React.ReactNode;
  client?: DataClient;
  initialCache?: Record<string, CacheEntry>;
  handleRef?: React.MutableRefObject<DataProviderHandle | null>;
}) {
  const cacheRef = React.useRef<Map<string, CacheEntry>>(new Map());
  React.useEffect(() => { if (initialCache) for (const [k, v] of Object.entries(initialCache)) cacheRef.current.set(k, v); }, [initialCache]);
  const _client = React.useMemo<DataClient>(() => client ?? FetchClient(), [client]);

  const getCache = React.useCallback(() => cacheRef.current, []);
  const setCache = React.useCallback((k: string, v: CacheEntry) => { cacheRef.current.set(k, v); }, []);
  const invalidate = React.useCallback((key: QueryKey) => { cacheRef.current.delete(stableKey(key)); }, []);
  const prefetch = React.useCallback(async <T,>(key: QueryKey, fn: () => Promise<T>) => {
    const k = stableKey(key); const existing = cacheRef.current.get(k); if (existing?.data) return existing.data as T;
    const p = fn(); cacheRef.current.set(k, { promise: p });
    try { const data = await p; cacheRef.current.set(k, { data, updatedAt: Date.now() }); return data; }
    catch (e) { cacheRef.current.set(k, { error: e, updatedAt: Date.now() }); throw e; }
  }, []);

  const ctx = React.useMemo<Ctx>(() => ({ client: _client, getCache, setCache, invalidate, prefetch }), [_client, getCache, setCache, invalidate, prefetch]);
  React.useEffect(() => { if (!handleRef) return; handleRef.current = { invalidate: (k) => invalidate(k), prefetch: (k, fn) => prefetch(k, fn), getCache: () => getCache() }; return () => { if (handleRef) handleRef.current = null; }; }, [handleRef, invalidate, prefetch, getCache]);

  return <DataCtx.Provider value={ctx}>{children}</DataCtx.Provider>;
}

function useDataCtx() { const c = React.useContext(DataCtx); if (!c) throw new Error("useData* hooks must be used within DataProvider"); return c; }

export function useQuery<T>(key: QueryKey, fetcher: (client: DataClient) => Promise<T>, opts: QueryOptions = {}) {
  const { client, getCache, setCache } = useDataCtx();
  const k = React.useMemo(() => stableKey(key), [key]);
  const [, force] = React.useReducer((x) => x + 1, 0);
  const entry = getCache().get(k) as CacheEntry<T> | undefined;
  const staleTime = opts.staleTime ?? 15000;
  const isStale = !entry?.updatedAt || Date.now() - (entry.updatedAt ?? 0) > staleTime;

  React.useEffect(() => {
    let canceled = false;
    const current = getCache().get(k);
    if (!current || (!current.data && !current.promise) || (isStale && opts.revalidateIfStale !== false)) {
      const p = fetcher(client);
      setCache(k, { ...current, promise: p });
      p.then((data) => { if (canceled) return; setCache(k, { data, updatedAt: Date.now() }); force(); },
             (error) => { if (canceled) return; setCache(k, { error, updatedAt: Date.now() }); force(); });
    }
    return () => { canceled = true; };
  }, [k, client, fetcher, setCache, getCache, isStale, opts.revalidateIfStale]);

  React.useEffect(() => {
    if (opts.revalidateOnFocus === false) return;
    const onFocus = () => {
      const cur = getCache().get(k);
      const stale = !cur?.updatedAt || Date.now() - (cur?.updatedAt ?? 0) > staleTime;
      if (stale) force();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [k, getCache, staleTime, opts.revalidateOnFocus]);

  const refetch = React.useCallback(async () => {
    const p = fetcher(client);
    setCache(k, { promise: p });
    try { const data = await p; setCache(k, { data, updatedAt: Date.now() }); force(); return data; }
    catch (e) { setCache(k, { error: e, updatedAt: Date.now() }); force(); throw e; }
  }, [k, client, fetcher, setCache]);

  return { data: entry?.data as T | undefined, error: entry?.error, loading: !entry?.data && !!(entry?.promise || isStale), refetch };
}

export function useMutation<TArgs, TData>(fn: (client: DataClient, args: TArgs) => Promise<TData>) {
  const { client, invalidate } = useDataCtx();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);
  const mutate = React.useCallback(async (args: TArgs, opts?: { invalidateKeys?: QueryKey[] }) => {
    setLoading(true); setError(null);
    try { const data = await fn(client, args); for (const k of opts?.invalidateKeys ?? []) invalidate(k); return data; }
    catch (e) { setError(e); throw e; }
    finally { setLoading(false); }
  }, [fn, client, invalidate]);
  return { mutate, loading, error };
}

export function useResource<T>(key: QueryKey, path: string, params?: Record<string, any>, opts?: QueryOptions) {
  const fetcher = React.useCallback(async (client: DataClient) => client.get<T>(path, { params }), [path, JSON.stringify(params)]);
  return useQuery<T>(key, fetcher, opts);
}
`;

/* ---------- Component templates (Navbar & Dialog) ---------- */

export const navbarTsxTemplate = () => `/* Portable Navbar (CSS vars only) */
"use client";
import React, { useRef, useState, useEffect } from "react";
import { mapShadowToBoxShadow } from "../../lib/shadow";
type ViewMode = "desktop" | "mobile";
type NavbarDesign = any; // consumer can replace with their own typing
const MOBILE_ASPECT = 2.16;

export default function Navbar({ design }: { design: NavbarDesign }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ViewMode>("desktop");
  const [mobileWidth, setMobileWidth] = useState<number>(360);
  const mobileHeight = Math.round(mobileWidth * MOBILE_ASPECT);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setOpen(false); triggerRef.current?.focus?.(); } };
    const node = sheetRef.current; node?.addEventListener("keydown", onKey as any, true);
    return () => node?.removeEventListener("keydown", onKey as any, true);
  }, [open]);

  const isGradient = design?.colors?.borderMode === "gradient";
  const border = isGradient ? \`\${design?.layout?.borderWidth ?? 1}px solid transparent\` : \`\${design?.layout?.borderWidth ?? 1}px solid var(--border)\`;
  const bgSolid = "var(--bg)";
  const background = isGradient
    ? \`linear-gradient(\${bgSolid}, \${bgSolid}) padding-box, linear-gradient(\${design?.layout?.borderGradientAngle ?? 90}deg, \${design?.colors?.borderGradStart}, \${design?.colors?.borderGradEnd}) border-box\`
    : bgSolid;
  const radius = design?.layout?.radiusMode === "uniform"
    ? { borderRadius: design?.layout?.radius ?? 12 }
    : {
        borderTopLeftRadius: design?.layout?.radiusTL ?? 12,
        borderTopRightRadius: design?.layout?.radiusTR ?? 12,
        borderBottomRightRadius: design?.layout?.radiusBR ?? 12,
        borderBottomLeftRadius: design?.layout?.radiusBL ?? 12
      };
  const wrapper: React.CSSProperties = {
    background, color: "var(--fg)", border,
    boxShadow: mapShadowToBoxShadow(design?.layout?.shadow),
    width: "100%", ...radius,
  };

  const isDesktop = mode === "desktop";
  const desktopOnly: React.CSSProperties = isDesktop ? { display: "flex" } : { display: "none" };
  const mobileOnly: React.CSSProperties = isDesktop ? { display: "none" } : { display: "inline-flex" };

  return (
    <div className="w-full h-full relative">
      <div className={\`w-full h-full \${mode === "mobile" ? "flex items-start justify-center" : ""}\`}>
        {mode === "mobile" ? (
          <DeviceFrame width={mobileWidth} height={mobileHeight} border="var(--border)">
            <div style={wrapper}>
              <Bar design={design} open={open} setOpen={setOpen} desktopOnly={desktopOnly} mobileOnly={mobileOnly} triggerRef={triggerRef} />
              <MobileSheet design={design} open={open} firstLinkRef={firstLinkRef} sheetRef={sheetRef} />
            </div>
          </DeviceFrame>
        ) : (
          <div style={wrapper}>
            <Bar design={design} open={open} setOpen={setOpen} desktopOnly={desktopOnly} mobileOnly={mobileOnly} triggerRef={triggerRef} />
          </div>
        )}
      </div>
      {/* Minimal viewport controls omitted in portable version */}
    </div>
  );
}

function Bar({ design, open, setOpen, desktopOnly, mobileOnly, triggerRef }:{
  design:any; open:boolean; setOpen:React.Dispatch<React.SetStateAction<boolean>>;
  desktopOnly:React.CSSProperties; mobileOnly:React.CSSProperties;
  triggerRef:React.RefObject<HTMLButtonElement | null>;
}) {
  const mm = design?.layout?.mobileMenu ?? {};
  const renderHamburger = () => {
    const t = mm.hamburgerThickness ?? 2;
    const common = { height: t, width: 16, background: "var(--fg)" as const };
    if (mm.hamburgerVariant === "dots") {
      const s = Math.max(2, t + 2);
      return (<div className="flex items-center gap-[3px]">
        <div style={{ width:s, height:s, background:"var(--fg)", borderRadius:s }} />
        <div style={{ width:s, height:s, background:"var(--fg)", borderRadius:s }} />
        <div style={{ width:s, height:s, background:"var(--fg)", borderRadius:s }} />
      </div>);
    }
    const rounded = mm.hamburgerVariant === "roundedBars" ? t : 0;
    return (<div className="space-y-[3px]">
      <div style={{ ...common, borderRadius: rounded }} />
      <div style={{ ...common, borderRadius: rounded }} />
      <div style={{ ...common, borderRadius: rounded }} />
    </div>);
  };

  return (
    <div className="flex items-center justify-between" style={{ height: design?.layout?.height ?? 56, padding: \`0 \${design?.layout?.paddingX ?? 16}px\` }} role="banner">
      {design?.structure?.showBrand && (
        <div className="text-sm font-semibold" style={{ color: "var(--title-fg)" }}>Brand</div>
      )}
      {design?.structure?.showDesktopNav && (
        <nav aria-label="Primary" className="hidden md:flex items-center" style={{ gap: design?.layout?.gap ?? 12, color: "var(--body-fg)", ...desktopOnly }}>
          <ul className="flex items-center" style={{ gap: design?.layout?.gap ?? 12 }}>
            {(design?.structure?.navItems ?? ["Home","About","Contact"]).map((item:string, i:number) => (
              <li key={i}><a className="text-xs opacity-90 hover:opacity-100 cursor-default" href="#">{item}</a></li>
            ))}
          </ul>
        </nav>
      )}
      <div className="flex items-center" style={{ gap: design?.layout?.gap ?? 12 }}>
        {design?.structure?.showActions && (
          <>
            <button className="text-[11px] rounded-full px-3 py-2 border"
              style={{ borderColor:"color-mix(in srgb, var(--fg) 20%, transparent)", color:"var(--fg)", ...desktopOnly }}>
              Secondary
            </button>
            <button className="text:[11px] rounded-full px-3 py-2 font-semibold"
              style={{ background:"var(--accent)", color:"#0b0f17", ...desktopOnly }}>
              Primary
            </button>
          </>
        )}
        {design?.structure?.showHamburger && (
          <button ref={triggerRef} className="md:hidden inline-flex items-center justify-center rounded-md border"
            style={{ borderColor:"color-mix(in srgb, var(--fg) 15%, transparent)", ...mobileOnly, minWidth:44, minHeight:44, padding:0 }}
            aria-label="Toggle mobile navigation" onClick={() => setOpen(v => !v)}>{renderHamburger()}</button>
        )}
      </div>
    </div>
  );
}

function MobileSheet({ design, open, firstLinkRef, sheetRef }:{
  design:any; open:boolean; firstLinkRef:React.RefObject<HTMLAnchorElement | null>;
  sheetRef:React.RefObject<HTMLDivElement | null>;
}) {
  if (!open) return null;
  const mm = design?.layout?.mobileMenu ?? {};
  const isFull = mm.widthMode === "full";
  const radius = mm.radiusMode === "uniform" ? { borderRadius: mm.radius ?? 12 } : {
    borderTopLeftRadius: mm.radiusTL ?? 12, borderTopRightRadius: mm.radiusTR ?? 12,
    borderBottomRightRadius: mm.radiusBR ?? 12, borderBottomLeftRadius: mm.radiusBL ?? 12
  };
  return (
    <div className="border-t px-3 py-2" style={{ borderTop:"1px solid var(--border)", background:"transparent", color:"var(--body-fg)" }} role="region" aria-label="Mobile navigation">
      <div ref={sheetRef} className="overflow-hidden" style={{
        background: mm.bg || "var(--footer-bg)", width: isFull ? "100%" : (mm.contextualWidth ?? 360),
        marginLeft: mm.align === "left" ? 0 : "auto", marginRight: mm.align === "right" ? 0 : "auto", ...radius
      }}>
        <ul>{(design?.structure?.navItems ?? ["Home","About","Contact"]).map((item:string, i:number) => (
          <li key={i}><a ref={i===0 ? firstLinkRef : undefined} className="block py-2 px-3 text-xs" href="#">{item}</a></li>
        ))}</ul>
      </div>
    </div>
  );
}

function DeviceFrame({ width, height, border, children }:{ width:number; height:number; border:string; children:React.ReactNode; }) {
  return (
    <div className="mt-4 overflow-hidden" style={{ width, height, borderRadius: 28, border: \`1px solid \${border}\`, boxShadow: "0 10px 30px rgba(0,0,0,0.35)", background: "var(--bg)" }}>
      <div style={{ height: "calc(100% - 40px)", overflow: "auto", WebkitOverflowScrolling: "touch" }}>{children}</div>
    </div>
  );
}
`;

export const dialogTsxTemplate = () => `/* Portable Dialog (CSS vars only) */
"use client";
import React from "react";
import { mapShadowToBoxShadow } from "../../lib/shadow";
type DialogDesign = any;

export default function Dialog({ design }: { design: DialogDesign }) {
  const [open, setOpen] = React.useState(true);
  const baseId = React.useId().replace(/:/g, "");
  const titleId = \`\${baseId}-title\`;
  const descId = \`\${baseId}-desc\`;
  const dialogRef = React.useRef<HTMLDivElement>(null);

  const isGradient = design?.colors?.borderMode === "gradient";
  const border = isGradient ? \`\${design?.layout?.borderWidth ?? 1}px solid transparent\` : \`\${design?.layout?.borderWidth ?? 1}px solid var(--border)\`;
  const bgSolid = "var(--bg)";
  const background = isGradient
    ? \`linear-gradient(\${bgSolid}, \${bgSolid}) padding-box, linear-gradient(\${design?.layout?.borderGradientAngle ?? 90}deg, \${design?.colors?.borderGradStart}, \${design?.colors?.borderGradEnd}) border-box\`
    : bgSolid;
  const radius = design?.layout?.radiusMode === "uniform"
    ? { borderRadius: design?.layout?.radius ?? 12 }
    : {
        borderTopLeftRadius: design?.layout?.radiusTL ?? 12,
        borderTopRightRadius: design?.layout?.radiusTR ?? 12,
        borderBottomRightRadius: design?.layout?.radiusBR ?? 12,
        borderBottomLeftRadius: design?.layout?.radiusBL ?? 12
      };
  const surface: React.CSSProperties = {
    maxWidth: design?.layout?.maxWidth?.base ?? 560, width: "100%",
    background, color: "var(--fg)", border,
    boxShadow: mapShadowToBoxShadow(design?.shadow),
    padding: design?.layout?.padding?.base ?? 20, display: "flex", flexDirection: "column", gap: design?.layout?.gap ?? 12, ...radius
  };

  return (
    <div className="w-full h-full grid place-items-center relative">
      {!open && <button onClick={() => setOpen(true)} className="absolute top-3 right-3 rounded-md border border-white/10 bg-black/30 px-3 py-1 text-xs">Reopen dialog</button>}
      {open && (
        <div className="absolute inset-0 grid place-items-center p-6" style={{ background: "color-mix(in srgb, black 50%, transparent)" }} onMouseDown={(e)=>{ if(e.target===e.currentTarget) setOpen(false); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={design?.structure?.showTitle ? titleId : undefined} aria-describedby={design?.structure?.showBody ? descId : undefined} tabIndex={-1} style={surface}>
            {design?.structure?.showTitle && (
              <div className="flex items-center justify-between" style={{ color: "var(--title-fg)" }}>
                <h2 id={titleId} className="text-sm font-semibold">Dialog title</h2>
                {design?.structure?.showClose && (
                  <button aria-label="Close dialog" onClick={() => setOpen(false)} className="rounded-md px-2 py-1 hover:bg-white/10" style={{ minWidth: 44, minHeight: 32, color: "var(--fg)" }}>×</button>
                )}
              </div>
            )}
            {design?.structure?.showBody && <div id={descId} className="text-sm" style={{ color: "var(--body-fg)" }}>This is the body of your dialog.</div>}
            {design?.structure?.showFooter && (
              <div className="flex items-center justify-end gap-3">
                <button className="text-sm rounded-full px-3 py-1.5" style={{ background: "var(--accent)", color: "#0b0f17", fontWeight: 600 }}>Primary</button>
                <button className="text-sm rounded-full px-3 py-1.5" style={{ background: "transparent", color: "var(--fg)", border: "1px solid color-mix(in srgb, var(--fg) 20%, transparent)" }}>Secondary</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
`;
