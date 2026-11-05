import { DEFAULT_LANG, type Lang } from "./config";
import { messages, type MsgKey } from "./messages";
import { toCyrillic } from "./translit";

export type Vars = Record<string, string | number>;
export type T = (key: MsgKey, vars?: Vars) => string;

const cyrCache = new Map<string, string>();

function cyrillic(key: string): string {
  let s = cyrCache.get(key);
  if (s === undefined) {
    s = messages[key]?.cy ?? toCyrillic(key);
    cyrCache.set(key, s);
  }
  return s;
}

/** Unknown keys (e.g. text that came from the API) fall back to the source text. */
export function translate(lang: Lang, key: string, vars?: Vars): string {
  let s = lang === "uz" ? key : lang === "uz-Cyrl" ? cyrillic(key) : (messages[key]?.[lang] ?? key);
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] !== undefined ? String(vars[k]) : m));
  return s;
}

let active: Lang = DEFAULT_LANG;

/** Set by `I18nProvider` in the browser, read by code outside React (`api`, `format`). */
export const setActiveLang = (lang: Lang) => {
  active = lang;
};
export const activeLang = () => active;
export const tr: T = (key, vars) => translate(active, key, vars);
