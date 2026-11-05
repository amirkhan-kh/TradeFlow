"use client";

import { createContext, use, useEffect, useMemo } from "react";
import { LANG_COOKIE, LOCALE_TAGS, type Lang } from "./config";
import { setActiveLang, translate, type T } from "./translate";

const LangContext = createContext<Lang>("uz");

export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  // Browser only: on the server this module is shared between requests.
  if (typeof window !== "undefined") setActiveLang(lang);
  useEffect(() => {
    document.documentElement.lang = LOCALE_TAGS[lang];
  }, [lang]);
  return <LangContext value={lang}>{children}</LangContext>;
}

/** Stores the choice for the UI and the API, then reloads so server and client render in the new language. */
export function changeLang(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  window.location.reload();
}

export function useI18n(): { lang: Lang; t: T } {
  const lang = use(LangContext);
  return useMemo(() => ({ lang, t: (key, vars) => translate(lang, key, vars) }), [lang]);
}

export const useT = (): T => useI18n().t;
