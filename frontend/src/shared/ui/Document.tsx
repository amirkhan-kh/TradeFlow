import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { LOCALE_TAGS, type Lang } from "@/shared/i18n/config";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

/** Plus Jakarta has no Cyrillic; `globals.css` switches Cyrillic languages to Manrope via `html:lang()`. */
const manrope = Manrope({
  subsets: ["cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

/** `<html>` + `<body>` for every root layout (public site, login, dashboard). */
export function Document({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={LOCALE_TAGS[lang]} className={`${jakarta.variable} ${manrope.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
