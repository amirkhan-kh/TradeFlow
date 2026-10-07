"use client";

import { useEffect, useState } from "react";
import { qs, type Page } from "./api";
import { useApi } from "./useApi";

/** List state: search (debounced), status filter, pagination. */
export function usePaged<T, Extra = object>(base: string, initialStatus = "", extra: Record<string, string | undefined> = {}) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(q);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const path = `${base}${qs({ q: debounced, status, page, limit: 15, ...extra })}`;
  const result = useApi<Page<T> & Extra>(path);

  return {
    ...result,
    q,
    setQ,
    status,
    setStatus: (s: string) => {
      setStatus(s);
      setPage(1);
    },
    page,
    setPage,
  };
}
