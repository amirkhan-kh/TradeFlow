import type { Request } from "express";
import { MESSAGES } from "./messages.js";
import { toCyrillic } from "./translit.js";

export const LANGS = ["uz", "uz-Cyrl", "ru", "en", "ky"] as const;
export type Lang = (typeof LANGS)[number];

/** Same cookie the web UI writes. */
export const LANG_COOKIE = "tf_lang";

const isLang = (v: unknown): v is Lang => typeof v === "string" && (LANGS as readonly string[]).includes(v);

/** `uz-Cyrl` has to be checked before plain `uz`. */
const ACCEPT: [RegExp, Lang][] = [
  [/^uz-cyrl/, "uz-Cyrl"],
  [/^uz/, "uz"],
  [/^ru/, "ru"],
  [/^en/, "en"],
  [/^ky/, "ky"],
];

/** Cookie (web UI) → `x-lang` header → `Accept-Language` (API clients) → `uz`. */
export function langOf(req: Request): Lang {
  const explicit = req.cookies?.[LANG_COOKIE] ?? req.headers["x-lang"];
  if (isLang(explicit)) return explicit;
  for (const part of (req.headers["accept-language"] ?? "").toLowerCase().split(",")) {
    const tag = part.split(";")[0].trim();
    const hit = ACCEPT.find(([re]) => re.test(tag));
    if (hit) return hit[1];
  }
  return "uz";
}

type Vars = Record<string, string>;

/** Keys with `{name}` slots also match the already-filled Uzbek text, e.g. "Tovar #12 topilmadi…". */
const TEMPLATES = Object.keys(MESSAGES)
  .filter((k) => k.includes("{"))
  .map((key) => {
    const source = key.replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/\\?\{(\w+)\\?\}/g, "(?<$1>.+?)");
    return { key, re: new RegExp(`^${source}$`, "s") };
  });

function lookup(text: string): { key: string; vars?: Vars } | undefined {
  if (MESSAGES[text]) return { key: text };
  for (const { key, re } of TEMPLATES) {
    const m = re.exec(text);
    if (m) return { key, vars: m.groups };
  }
  return undefined;
}

const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m) : s);

/** Translates Uzbek (Latin) source text. Unknown text is returned as-is (transliterated for `uz-Cyrl`). */
export function translate(lang: Lang, text: string): string {
  if (lang === "uz") return text;
  const hit = lookup(text);
  if (lang === "uz-Cyrl") {
    const cy = hit && MESSAGES[hit.key].cy;
    return cy ? fill(cy, hit.vars) : toCyrillic(text);
  }
  if (!hit) return text;
  return fill(MESSAGES[hit.key][lang], hit.vars);
}
