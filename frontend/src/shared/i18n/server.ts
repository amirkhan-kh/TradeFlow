import { cookies, headers } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "./config";
import { translate, type T } from "./translate";

/** Cookie (the user's choice) → `x-lang` header (API clients, tests) → default. Same order as the backend. */
export async function getLang(): Promise<Lang> {
  const cookie = (await cookies()).get(LANG_COOKIE)?.value;
  if (isLang(cookie)) return cookie;
  const header = (await headers()).get("x-lang");
  return isLang(header) ? header : DEFAULT_LANG;
}

export async function getI18n(): Promise<{ lang: Lang; t: T }> {
  const lang = await getLang();
  return { lang, t: (key, vars) => translate(lang, key, vars) };
}
