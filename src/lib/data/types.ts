export type QueryKey = string | [string, ...any[]];

export type QueryOptions = {
  staleTime?: number; // ms; default 15s
  revalidateOnFocus?: boolean; // default true
  revalidateIfStale?: boolean; // default true
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
  request<T = any>(
    path: string,
    init?: RequestInit & RequestOptions
  ): Promise<T>;
};

export type MutationFn<TArgs, TData> = (
  client: DataClient,
  args: TArgs
) => Promise<TData>;

export type DataProviderHandle = {
  invalidate: (key: QueryKey) => void;
  prefetch: <T>(key: QueryKey, fn: () => Promise<T>) => Promise<T>;
  getCache: () => Map<string, any>;
};

/** Simple fetch client */
export function FetchClient(config?: {
  baseUrl?: string;
  headers?: Record<string, string>;
  onRequest?: (init: RequestInit & RequestOptions & { url: string }) => void;
  onResponse?: (res: Response) => void;
}): DataClient {
  const baseUrl = config?.baseUrl?.replace(/\/+$/, "") || "";
  const defaultHeaders = config?.headers ?? {};

  const toUrl = (path: string, params?: Record<string, any>) => {
    const u = new URL(path.replace(/^\//, ""), baseUrl || "http://local/");
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null) continue;
        u.searchParams.set(k, String(v));
      }
    }
    const out = (baseUrl ? u.toString() : `/${u.pathname}${u.search}`).replace(
      "http://local",
      ""
    );
    return out;
  };

  async function request<T>(
    path: string,
    init: RequestInit & RequestOptions = {} as any
  ): Promise<T> {
    const url = toUrl(path, init.params);
    const headers = {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...(init.headers ?? {}),
    };
    const body =
      init.body !== undefined
        ? typeof init.body === "string"
          ? init.body
          : JSON.stringify(init.body)
        : undefined;

    const finalInit: RequestInit = { ...init, headers, body };
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    config?.onRequest?.({ ...(init as any), url });

    const res = await fetch(url, finalInit);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    config?.onResponse?.(res);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return (await res.json()) as T;
    // fallback
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
