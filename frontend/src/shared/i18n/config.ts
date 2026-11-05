export const LANGS = ["uz", "uz-Cyrl", "ru", "en", "ky"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "ru";
/** Read by the backend too: API messages follow the same language. */
export const LANG_COOKIE = "tf_lang";

export const LANG_NAMES: Record<Lang, string> = {
  uz: "O'zbekcha",
  "uz-Cyrl": "Ўзбекча",
  ru: "Русский",
  en: "English",
  ky: "Кыргызча",
};

/** BCP 47 tags for `<html lang>` and `Intl`. */
export const LOCALE_TAGS: Record<Lang, string> = {
  uz: "uz-Latn-UZ",
  "uz-Cyrl": "uz-Cyrl-UZ",
  ru: "ru-RU",
  en: "en-US",
  ky: "ky-KG",
};

/** Open Graph `og:locale`. */
export const OG_LOCALES: Record<Lang, string> = {
  uz: "uz_UZ",
  "uz-Cyrl": "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
  ky: "ky_KG",
};

export const isLang = (v: unknown): v is Lang => typeof v === "string" && (LANGS as readonly string[]).includes(v);

/** URL segment of the public site per language. The default language is served at `/`; `/ru` redirects there. */
export const SITE_SLUGS: Record<Lang, string> = { uz: "uz", "uz-Cyrl": "uz-cyrl", ru: "ru", en: "en", ky: "ky" };

export const sitePath = (lang: Lang) => (lang === DEFAULT_LANG ? "/" : `/${SITE_SLUGS[lang]}`);

/** Link that switches the public site and stores the choice (`/ru` sets the cookie, then redirects to `/`). */
export const siteSwitchPath = (lang: Lang) => `/${SITE_SLUGS[lang]}`;

export const langOfSlug = (slug: string): Lang | undefined => LANGS.find((l) => SITE_SLUGS[l] === slug);
