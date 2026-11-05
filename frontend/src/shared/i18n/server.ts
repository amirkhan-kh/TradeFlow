import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "./config";
import { translate, type T } from "./translate";

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(v) ? v : DEFAULT_LANG;
}

export async function getI18n(): Promise<{ lang: Lang; t: T }> {
  const lang = await getLang();
  return { lang, t: (key, vars) => translate(lang, key, vars) };
}
