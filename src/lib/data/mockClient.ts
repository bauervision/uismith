import type { DataClient, RequestOptions } from "./types";

export function MockClient(
  seed: Record<string, any> = {},
  latency = 250
): DataClient {
  const db = { ...seed };

  const get = async <T>(path: string, opts?: RequestOptions) => {
    await delay(latency);
    const key = withParams(path, opts?.params);
    return (db[key] ?? db[path] ?? null) as T;
  };

  const request = get; // keep it simple for mock
  const post = get,
    put = get,
    patch = get,
    _delete = get;

  return {
    baseUrl: "",
    request,
    get,
    post,
    put,
    patch,
    delete: _delete,
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
function withParams(path: string, params?: Record<string, any>) {
  if (!params) return path;
  const qs = new URLSearchParams(params as any).toString();
  return qs ? `${path}?${qs}` : path;
}
