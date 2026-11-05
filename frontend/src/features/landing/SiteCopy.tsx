"use client";

import { createContext, use, useCallback } from "react";
import { setActiveLang } from "@/shared/i18n/active";
import type { Lang } from "@/shared/i18n/config";
import { fill, type Vars } from "@/shared/i18n/fill";
import type { SiteKey, SiteT } from "./copy";

type SiteCopy = { lang: Lang; copy: Record<SiteKey, string> };

const CopyContext = createContext<SiteCopy | null>(null);

/**
 * Hands the current language's site copy (translated on the server) to client sections,
 * so the landing bundle never carries the other languages or the dashboard dictionary.
 */
export function SiteCopyProvider({ lang, copy, children }: SiteCopy & { children: React.ReactNode }) {
  // Browser only: on the server this module is shared between requests.
  if (typeof window !== "undefined") setActiveLang(lang);
  return <CopyContext value={{ lang, copy }}>{children}</CopyContext>;
}

function useSiteCopy(): SiteCopy {
  const ctx = use(CopyContext);
  if (!ctx) throw new Error("Landing sections need SiteCopyProvider");
  return ctx;
}

export const useSiteLang = (): Lang => useSiteCopy().lang;

export function useCopy(): SiteT {
  const { copy } = useSiteCopy();
  return useCallback((key: SiteKey, vars?: Vars) => fill(copy[key], vars), [copy]);
}
