import type { Metadata } from "next";
import { BadgeCheck, Bot, ShieldCheck } from "lucide-react";
import { LoginBackdrop } from "@/features/auth/LoginBackdrop";
import { LoginForm } from "@/features/auth/LoginForm";
import { HeroIllustration } from "@/features/landing/HeroIllustration";
import { I18nProvider } from "@/shared/i18n/I18nProvider";
import { getI18n } from "@/shared/i18n/server";
import { LangSwitch } from "@/shared/ui/LangSwitch";
import { Logo, LogoMark } from "@/shared/ui/Logo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t("Tizimga kirish"),
    description: t("TradeFlow CRM hisobingizga kiring: buyurtmalar, ombor, audit, yetkazib berish va moliya bitta panelda."),
    alternates: { canonical: "/login" },
  };
}

/** "login/password" shown under the form; production shows nothing unless DEMO_LOGIN is set. */
const DEMO = process.env.DEMO_LOGIN ?? (process.env.NODE_ENV === "production" ? "" : "admin/admin123");

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const { lang, t } = await getI18n();
  const [demoUser, demoPass] = DEMO.split("/");
  const [welcomeBefore, welcomeAfter] = t("{brand}'ga xush kelibsiz").split("{brand}");
  return (
    <I18nProvider lang={lang}>
      <main className="grid min-h-dvh lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 p-12 text-white lg:flex lg:flex-col">
          <LoginBackdrop />
          <div className="relative">
            <Logo light label={t("TradeFlow bosh sahifa")} />
          </div>
          <div className="relative my-auto">
            <div className="mx-auto max-w-md rounded-2xl bg-white/95 p-4 shadow-2xl">
              <HeroIllustration label={t("Ombor, yuk mashinalari va yetkazib berish marshruti")} />
            </div>
            <h2 className="mt-10 text-3xl font-extrabold tracking-tight">{t("Ombordan savdo nuqtasigacha — to'liq nazorat")}</h2>
            <ul className="mt-6 space-y-3 text-brand-100/90">
              <li className="flex items-center gap-3">
                <BadgeCheck className="size-5 text-brand-300" /> {t("Buyurtma, ombor, audit va yetkazish bitta tizimda")}
              </li>
              <li className="flex items-center gap-3">
                <Bot className="size-5 text-brand-300" /> {t("5 ta aqlli agent muammolarni oldindan sezadi")}
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-brand-300" /> {t("Rollar bo'yicha ruxsatlar va shifrlangan sessiya")}
              </li>
            </ul>
          </div>
        </section>

        <section className="relative flex items-center justify-center p-6">
          <LangSwitch className="absolute top-4 right-4" />
          <div className="w-full max-w-md">
            <div className="card p-8 sm:p-10">
              <div className="mb-8 flex flex-col items-center text-center">
                <LogoMark className="size-20" />
                <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900">
                  {welcomeBefore}
                  <span className="text-[#32536b]">
                    Trade<span className="text-[#4d8a3a]">Flow</span>
                  </span>
                  {welcomeAfter}
                </h1>
                <p className="mt-1 text-sm text-ink-500">{t("Davom etish uchun hisobingizga kiring")}</p>
              </div>
              <LoginForm next={next} />
            </div>
            {demoUser && demoPass && (
              <p className="mt-6 text-center text-xs text-ink-500">
                Demo: <b className="text-ink-700">{demoUser}</b> / <b className="text-ink-700">{demoPass}</b>
              </p>
            )}
          </div>
        </section>
      </main>
    </I18nProvider>
  );
}
