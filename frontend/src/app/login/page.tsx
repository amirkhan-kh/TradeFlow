import type { Metadata } from "next";
import { BadgeCheck, Bot, ShieldCheck } from "lucide-react";
import { LoginBackdrop } from "@/features/auth/LoginBackdrop";
import { LoginForm } from "@/features/auth/LoginForm";
import { HeroIllustration } from "@/features/landing/HeroIllustration";
import { Logo, LogoMark } from "@/shared/ui/Logo";

export const metadata: Metadata = {
  title: "Tizimga kirish",
  description: "TradeFlow CRM hisobingizga kiring: buyurtmalar, ombor, audit, yetkazib berish va moliya bitta panelda.",
  alternates: { canonical: "/login" },
};

/** "login/password" shown under the form; production shows nothing unless DEMO_LOGIN is set. */
const DEMO = process.env.DEMO_LOGIN ?? (process.env.NODE_ENV === "production" ? "" : "admin/admin123");

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const [demoUser, demoPass] = DEMO.split("/");
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 p-12 text-white lg:flex lg:flex-col">
        <LoginBackdrop />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative my-auto">
          <div className="mx-auto max-w-md rounded-3xl bg-white/95 p-4 shadow-2xl">
            <HeroIllustration />
          </div>
          <h2 className="mt-10 text-3xl font-extrabold tracking-tight">Ombordan savdo nuqtasigacha — to&apos;liq nazorat</h2>
          <ul className="mt-6 space-y-3 text-brand-100/90">
            <li className="flex items-center gap-3">
              <BadgeCheck className="size-5 text-brand-300" /> Buyurtma, ombor, audit va yetkazish bitta tizimda
            </li>
            <li className="flex items-center gap-3">
              <Bot className="size-5 text-brand-300" /> 5 ta aqlli agent muammolarni oldindan sezadi
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-brand-300" /> Rollar bo&apos;yicha ruxsatlar va shifrlangan sessiya
            </li>
          </ul>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card p-8 sm:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <LogoMark className="size-20" />
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#32536b]">
                Trade<span className="text-[#4d8a3a]">Flow</span>
                <span className="text-ink-900">&apos;ga xush kelibsiz</span>
              </h1>
              <p className="mt-1 text-sm text-ink-500">Davom etish uchun hisobingizga kiring</p>
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
  );
}
