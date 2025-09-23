"use client";

import * as React from "react";
import {
  type DataClient,
  FetchClient,
  type QueryKey,
  type QueryOptions,
  type MutationFn,
  type DataProviderHandle,
} from "@/lib/data/types";
import { stableKey } from "@/lib/data/util";

type CacheEntry<T = any> = {
  data?: T;
  error?: any;
  promise?: Promise<T>;
  updatedAt?: number; // ms epoch
};

type Ctx = {
  client: DataClient;
  getCache: () => Map<string, CacheEntry>;
  setCache: (k: string, v: CacheEntry) => void;
  invalidate: (key: QueryKey) => void;
  prefetch: <T>(key: QueryKey, fn: () => Promise<T>) => Promise<T>;
};

const DataCtx = React.createContext<Ctx | null>(null);

export function DataProvider({
  children,
  client,
  baseUrl,
  headers,
  initialCache,
  handleRef,
}: {
  children: React.ReactNode;
  /** Optional: still allow passing a client when everything is client-side */
  client?: DataClient;
  /** Preferred: pass primitives only from server → client */
  baseUrl?: string;
  headers?: Record<string, string>;
  initialCache?: Record<string, CacheEntry>;
  handleRef?: React.MutableRefObject<DataProviderHandle | null>;
}) {
  const cacheRef = React.useRef<Map<string, CacheEntry>>(new Map());
  React.useEffect(() => {
    if (initialCache) {
      for (const [k, v] of Object.entries(initialCache))
        cacheRef.current.set(k, v);
    }
  }, [initialCache]);

  const _client = React.useMemo<DataClient>(
    () => client ?? FetchClient({ baseUrl, headers }),
    // stringify headers to keep the dep stable-ish; it's fine here
    [client, baseUrl, headers && JSON.stringify(headers)]
  );

  const getCache = React.useCallback(() => cacheRef.current, []);
  const setCache = React.useCallback((k: string, v: CacheEntry) => {
    cacheRef.current.set(k, v);
  }, []);
  const invalidate = React.useCallback((key: QueryKey) => {
    cacheRef.current.delete(stableKey(key));
  }, []);
  const prefetch = React.useCallback(
    async <T,>(key: QueryKey, fn: () => Promise<T>) => {
      const k = stableKey(key);
      const existing = cacheRef.current.get(k);
      if (existing?.data) return existing.data as T;
      const p = fn();
      cacheRef.current.set(k, { promise: p });
      try {
        const data = await p;
        cacheRef.current.set(k, { data, updatedAt: Date.now() });
        return data;
      } catch (e) {
        cacheRef.current.set(k, { error: e, updatedAt: Date.now() });
        throw e;
      }
    },
    []
  );

  const ctx = React.useMemo<Ctx>(
    () => ({
      client: _client,
      getCache,
      setCache,
      invalidate,
      prefetch,
    }),
    [_client, getCache, setCache, invalidate, prefetch]
  );

  // Optional external handle
  React.useEffect(() => {
    if (!handleRef) return;
    handleRef.current = {
      invalidate: (k) => invalidate(k),
      prefetch: (k, fn) => prefetch(k, fn),
      getCache: () => getCache(),
    };
    return () => {
      handleRef.current = null;
    };
  }, [handleRef, invalidate, prefetch, getCache]);

  return <DataCtx.Provider value={ctx}>{children}</DataCtx.Provider>;
}

function useDataCtx() {
  const c = React.useContext(DataCtx);
  if (!c) throw new Error("useData* hooks must be used within DataProvider");
  return c;
}

/* ---------------- Hooks ---------------- */

export function useQuery<T>(
  key: QueryKey,
  fetcher: (client: DataClient) => Promise<T>,
  opts: QueryOptions = {}
) {
  const { client, getCache, setCache } = useDataCtx();
  const k = React.useMemo(() => stableKey(key), [key]);
  const [, force] = React.useReducer((x) => x + 1, 0);

  const entry = getCache().get(k) as CacheEntry<T> | undefined;
  const staleTime = opts.staleTime ?? 15_000;

  const isStale =
    !entry?.updatedAt || Date.now() - (entry.updatedAt ?? 0) > staleTime;

  // Kick off fetch if needed
  React.useEffect(() => {
    let canceled = false;
    const current = getCache().get(k);
    if (
      !current ||
      (!current.data && !current.promise) ||
      (isStale && opts.revalidateIfStale !== false)
    ) {
      const p = fetcher(client);
      setCache(k, { ...current, promise: p });
      p.then(
        (data) => {
          if (canceled) return;
          setCache(k, { data, updatedAt: Date.now() });
          force();
        },
        (error) => {
          if (canceled) return;
          setCache(k, { error, updatedAt: Date.now() });
          force();
        }
      );
    }
    return () => {
      canceled = true;
    };
  }, [k, client, fetcher, setCache, getCache, isStale, opts.revalidateIfStale]);

  // Optional: refetch on window focus if stale
  React.useEffect(() => {
    if (opts.revalidateOnFocus === false) return;
    const onFocus = () => {
      const cur = getCache().get(k);
      const stale =
        !cur?.updatedAt || Date.now() - (cur.updatedAt ?? 0) > staleTime;
      if (stale) {
        // trigger effect by "changing" fetcher identity via force?
        force();
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [k, getCache, staleTime, opts.revalidateOnFocus]);

  const refetch = React.useCallback(async () => {
    const p = fetcher(client);
    setCache(k, { promise: p });
    try {
      const data = await p;
      setCache(k, { data, updatedAt: Date.now() });
      force();
      return data;
    } catch (e) {
      setCache(k, { error: e, updatedAt: Date.now() });
      force();
      throw e;
    }
  }, [k, client, fetcher, setCache]);

  return {
    data: entry?.data as T | undefined,
    error: entry?.error,
    loading: !entry?.data && !!(entry?.promise || isStale),
    refetch,
  };
}

export function useMutation<TArgs, TData>(fn: MutationFn<TArgs, TData>) {
  const { client, invalidate } = useDataCtx();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);

  const mutate = React.useCallback(
    async (args: TArgs, opts?: { invalidateKeys?: QueryKey[] }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fn(client, args);
        for (const k of opts?.invalidateKeys ?? []) invalidate(k);
        return data;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fn, client, invalidate]
  );

  return { mutate, loading, error };
}

// Simple REST helper using the client
export function useResource<T>(
  key: QueryKey,
  path: string,
  params?: Record<string, any>,
  opts?: QueryOptions
) {
  const fetcher = React.useCallback(
    async (client: DataClient) => {
      return client.get<T>(path, { params });
    },
    [path, JSON.stringify(params)]
  );
  return useQuery<T>(key, fetcher, opts);
}
