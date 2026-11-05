"use client";

import { Languages } from "lucide-react";
import { LANG_NAMES, LANGS, isLang } from "@/shared/i18n/config";
import { changeLang, useI18n } from "@/shared/i18n/I18nProvider";

/** `className` positions the control (e.g. `absolute top-4 right-4`); the icon is placed inside its own box. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, t } = useI18n();
  return (
    <label className={`inline-flex ${className}`}>
      <span className="sr-only">{t("Til")}</span>
      <span className="relative inline-flex items-center">
        <Languages className="pointer-events-none absolute left-2.5 size-4 text-ink-400" aria-hidden />
        <select
          value={lang}
          onChange={(e) => isLang(e.target.value) && changeLang(e.target.value)}
          className="h-9 appearance-none rounded-xl border border-ink-200 bg-white/80 pr-3 pl-8 text-sm font-medium text-ink-700 transition hover:border-ink-300 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          {LANGS.map((l) => (
            <option key={l} value={l} lang={l}>
              {LANG_NAMES[l]}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
