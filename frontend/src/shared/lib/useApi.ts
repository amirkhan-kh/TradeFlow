"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

/**
 * Last response per path for this tab. Revisiting a screen renders instantly from it while a fresh
 * request runs in the background (stale-while-revalidate). Login/logout do full page loads, so the
 * cache never outlives the session that filled it.
 */
const cache = new Map<string, unknown>();
const MAX_ENTRIES = 150;

function remember(path: string, value: unknown) {
  cache.delete(path);
  cache.set(path, value);
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value!);
}

export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | undefined>(() => (path ? (cache.get(path) as T | undefined) : undefined));
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(Boolean(path));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!path) return;
    let alive = true;
    const cached = cache.get(path) as T | undefined;
    if (cached !== undefined) setData(cached);
    setLoading(true);
    setError(undefined);
    api<T>(path)
      .then((d) => {
        remember(path, d);
        if (alive) setData(d);
      })
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [path, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, error, loading, reload };
}
