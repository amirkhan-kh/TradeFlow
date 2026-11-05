import { ArrowUpRight } from "lucide-react";
import { LANG_NAMES, LANGS, LOCALE_TAGS, sitePath, siteSwitchPath, type Lang } from "@/shared/i18n/config";
import { Aurora } from "@/shared/ui/Aurora";
import { ButtonLink } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { Reveal } from "@/shared/ui/motion";
import { Accent } from "./Accent";
import { siteT, type SiteKey } from "./copy";
import { ZoomIn } from "./ZoomIn";

const COLS: [SiteKey, [string, SiteKey][]][] = [
  ["Mahsulot", [["#imkoniyatlar", "Imkoniyatlar"], ["#agentlar", "Aqlli agentlar"], ["#telegram", "Telegram bot"], ["/login", "Tizimga kirish"]]],
  ["Resurslar", [["#jarayon", "Ishga tushirish"], ["#demo", "Texnik yordam"], ["#demo", "Video darslar"], ["#demo", "Hujjatlar"]]],
  ["Kompaniya", [["#demo", "Biz haqimizda"], ["#demo", "Rekvizitlar"], ["#demo", "Karyera"], ["#demo", "Kontaktlar"]]],
];

export function Footer({ lang }: { lang: Lang }) {
  const t = siteT(lang);
  return (
    <footer className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-[#0c1826] text-white sm:rounded-t-[3.5rem]">
      <Aurora dark interactive={false} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-14 sm:flex-row sm:items-center">
          <p className="max-w-xl text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            <Accent text={t("Ombordan savdo nuqtasigacha — {accent} bugundan.")} accent={t("to'liq nazorat")} className="text-aurora-dark" />
          </p>
          <ButtonLink href="/login" size="lg" variant="secondary" className="ring-beam group rounded-full! border-white">
            {t("Boshlash")}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
          </ButtonLink>
        </Reveal>

        <div className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo href={sitePath(lang)} label={t("TradeFlow bosh sahifa")} light />
            <p className="mt-4 max-w-xs text-sm text-white/65">{t("Distribyutsiya, ombor, audit va yetkazib berish uchun yagona boshqaruv platformasi.")}</p>
          </div>
          {COLS.map(([title, links]) => (
            <nav key={title} aria-label={t(title)}>
              <p className="text-sm font-bold text-white">{t(title)}</p>
              <ul className="mt-3 space-y-2">
                {links.map(([href, label]) => (
                  <li key={label}>
                    <a href={href} className="inline-block text-sm text-white/65 transition hover:translate-x-0.5 hover:text-[#9cc3dc]">
                      {t(label)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <ZoomIn from={0.7} y={120} end="end end" className="pointer-events-none relative mx-auto max-w-7xl px-4 select-none sm:px-6">
        <p
          aria-hidden
          className="bg-gradient-to-b from-white/30 via-[#9cc3dc]/15 to-transparent bg-clip-text pb-[0.06em] text-center text-[18vw] leading-[0.8] font-extrabold tracking-[-0.06em] text-transparent lg:text-[13rem]"
        >
          TradeFlow
        </p>
      </ZoomIn>
      <div className="relative flex flex-col items-center gap-3 border-t border-white/10 py-5 text-xs text-white/60 sm:flex-row sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} TradeFlow. {t("Barcha huquqlar himoyalangan.")}
        </p>
        <nav aria-label={t("Til")}>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {LANGS.map((l) => (
              <li key={l}>
                <a
                  href={siteSwitchPath(l)}
                  hrefLang={LOCALE_TAGS[l]}
                  lang={LOCALE_TAGS[l]}
                  aria-current={l === lang ? "page" : undefined}
                  className="inline-block py-1 transition-colors hover:text-[#9cc3dc] aria-[current=page]:font-bold aria-[current=page]:text-white"
                >
                  {LANG_NAMES[l]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
