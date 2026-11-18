"use client";

import { useCallback, useEffect, useState } from "react";

/** Returns `value` only after it has stopped changing for `delay` ms. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

type FetchState<T> = { data: T | null; error: string | null; loading: boolean };

/**
 * Fetch JSON with loading / error state. Aborts the in-flight request when the
 * URL changes, so a slow stale response can never overwrite a newer one.
 */
export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<FetchState<T>>({ data: null, error: null, loading: Boolean(url) });
  const [attempt, setAttempt] = useState(0);
  const refetch = useCallback(() => setAttempt((n) => n + 1), []);

  // Mark as loading as soon as the request key changes (during render, not in an effect).
  const key = `${url}#${attempt}`;
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    setState((s) => ({ ...s, loading: Boolean(url), error: null }));
  }

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
        setState({ data: body as T, error: null, loading: false });
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setState((s) => ({ ...s, error: err.message, loading: false }));
      });

    return () => controller.abort();
  }, [url, attempt]);

  return { ...state, refetch };
}
