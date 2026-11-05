"use client";

import { Languages } from "lucide-react";
import { isLang, LANG_NAMES, LANGS, LOCALE_TAGS, siteSwitchPath } from "@/shared/i18n/config";
import { useCopy, useSiteLang } from "./SiteCopy";

/** Language picker of the public site: each language is its own URL, so choosing one navigates there. */
export function SiteLangSwitch({ className = "" }: { className?: string }) {
  const lang = useSiteLang();
  const t = useCopy();
  return (
    <label className={`inline-flex ${className}`}>
      <span className="sr-only">{t("Til")}</span>
      <span className="relative inline-flex items-center">
        <Languages className="pointer-events-none absolute left-3 size-4 text-ink-500" aria-hidden />
        <select
          value={lang}
          onChange={(e) => isLang(e.target.value) && window.location.assign(siteSwitchPath(e.target.value))}
          className="h-10 appearance-none rounded-full border border-white/70 bg-white/60 pr-4 pl-9 text-sm font-medium text-ink-700 backdrop-blur transition hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-[#32536b]"
        >
          {LANGS.map((l) => (
            <option key={l} value={l} lang={LOCALE_TAGS[l]}>
              {LANG_NAMES[l]}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
