"use client";

import { Bell, CircleCheck, FileText, Gift, Send, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { buttonClass } from "@/shared/ui/Button";
import { LogoMark } from "@/shared/ui/Logo";
import { EASE, m, Marquee, Reveal, Stagger, StaggerItem } from "@/shared/ui/motion";
import { Fx } from "./Fx";
import { useCopy } from "./SiteCopy";
import { ZoomIn } from "./ZoomIn";

/** Brand names stay as they are; only the 1C product name is translated (first in the rail). */
const INTEGRATIONS = [
  ["didox.png", "Didox"],
  ["payme.png", "Payme"],
  ["click.png", "Click"],
  ["uzum_market.png", "Uzum Market"],
  ["telegram.png", "Telegram"],
  ["google_sheets.svg", "Google Sheets"],
  ["sap_b1.svg", "SAP Business One"],
  ["bitrix24.png", "Bitrix24"],
  ["amocrm.png", "amoCRM"],
  ["iiko.png", "iiko"],
  ["moysklad.png", "MoySklad"],
  ["powerbi.png", "Power BI"],
  ["eskiz.png", "Eskiz SMS"],
] as const;

const BOT = [
  [FileText, "Akt sverka", "Distribyutor va savdo nuqtasi o'rtasidagi moliyaviy hisobot"],
  [ShoppingCart, "Buyurtma berish", "Savdo nuqtasi to'g'ridan-to'g'ri bot orqali buyurtma beradi"],
  [Gift, "Bonuslar", "To'plangan bonuslar va aksiyalar haqida ma'lumot"],
  [Bell, "Rejali hisobot", "Har kuni ertalab rahbarga savdo yakunlari"],
] as const;

const bubble = (i: number, mine: boolean) => ({
  initial: { opacity: 0, y: 14, scale: 0.92, x: mine ? 12 : -12 },
  whileInView: { opacity: 1, y: 0, scale: 1, x: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { delay: 0.3 + i * 0.55, type: "spring" as const, stiffness: 260, damping: 22 },
});

export function Telegram() {
  const t = useCopy();
  return (
    <section id="telegram" className="relative isolate scroll-mt-24 py-20 sm:py-28">
      <Fx variant="mesh" side="right" />
      <ZoomIn className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-20">
          <p className="mb-6 text-center text-sm font-semibold text-ink-500">{t("Tizimlaringiz bilan oson integratsiya")}</p>
          <Marquee>
            {[["onec.png", t("1C: Buxgalteriya")], ...INTEGRATIONS].map(([file, name]) => (
              <span key={name} className="glass flex items-center gap-2.5 rounded-xl py-2 pr-5 pl-2 text-sm font-semibold whitespace-nowrap text-ink-700">
                <span className="grid size-8 place-items-center overflow-hidden rounded-lg bg-white shadow-soft ring-1 ring-ink-100">
                  <Image src={`/logos/${file}`} alt="" width={22} height={22} className="size-[22px] object-contain" />
                </span>
                {name}
              </span>
            ))}
          </Marquee>
        </Reveal>

        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                <Send className="size-3.5" /> {t("Telegram bot")}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-[2.6rem] sm:leading-[1.1]">
                {t("Buyurtma va hisobotlarni to'g'ridan-to'g'ri Telegramda boshqaring")}
              </h2>
              <p className="mt-4 text-lg text-ink-600">{t("Savdo nuqtalari bilan aloqa, push-bildirishnomalar va real vaqt nazorati.")}</p>
            </Reveal>
            <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2">
              {BOT.map(([Icon, title, text]) => (
                <StaggerItem as="li" key={title} className="group glass flex gap-3 rounded-xl p-3 transition-colors hover:bg-white/80">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600 transition-transform group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-bold text-ink-900">{t(title)}</p>
                    <p className="text-sm text-ink-600">{t(text)}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2}>
              <a href="#demo" className={buttonClass("primary", "lg", "mt-8 rounded-full! bg-sky-600 shadow-[0_18px_40px_-12px_rgb(2_132_199/0.55)] hover:bg-sky-700")}>
                <Send className="size-4" /> {t("Botni sinab ko'rish")}
              </a>
            </Reveal>
          </div>

          <Reveal className="relative mx-auto w-full max-w-sm" y={40}>
            <div className="absolute -inset-8 -z-10 rounded-[4rem] bg-gradient-to-br from-[#8bc474]/35 via-sky-200/60 to-[#32536b]/30 blur-3xl" />
            <div aria-hidden className="absolute -top-10 -right-6 -z-10 size-28 rounded-full bg-sky-300/50 blur-2xl md:animate-drift" />
            <m.div
              whileHover={{ rotate: -1.5, y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="glass rounded-[2.25rem] p-2.5 shadow-[0_50px_100px_-30px_rgb(16_40_32/0.45)]"
            >
              <div className="rounded-[1.75rem] bg-gradient-to-b from-[#eaf3ee] to-[#dce9e2] p-4 ring-1 ring-ink-900/10">
                <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-ink-900/15" />
                <div className="glass mb-4 flex items-center gap-3 rounded-2xl px-3 py-2">
                  <span className="grid size-9 place-items-center rounded-full bg-ink-50 ring-1 ring-ink-200">
                    <LogoMark className="size-6" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">TradeFlow Bot</p>
                    <p className="text-xs text-brand-600">{t("online")}</p>
                  </div>
                </div>
                <div className="min-h-80 space-y-2.5 text-sm">
                  <m.p {...bubble(0, true)} className="ml-auto w-fit rounded-2xl rounded-br-sm bg-[#32536b] px-3 py-2 text-white">
                    /akt_sverka
                  </m.p>
                  <m.div {...bubble(1, false)} className="w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 shadow-sm">
                    <p className="font-bold">{t("📄 Baraka Market — Oktabr")}</p>
                    <p className="mt-1 text-ink-600">{t("Yuklandi: 48 250 000 so'm")}</p>
                    <p className="text-ink-600">{t("To'landi: 36 000 000 so'm")}</p>
                    <p className="mt-1 font-bold text-red-600">{t("Qoldiq: 12 250 000 so'm")}</p>
                  </m.div>
                  <m.p {...bubble(2, true)} className="ml-auto w-fit rounded-2xl rounded-br-sm bg-[#32536b] px-3 py-2 text-white">
                    {t("Yangi buyurtma 🛒")}
                  </m.p>
                  <m.div {...bubble(3, false)} className="w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 shadow-sm">
                    <p className="flex items-center gap-1.5 font-bold">
                      <CircleCheck className="size-4 text-brand-600" /> {t("TF-001248 qabul qilindi")}
                    </p>
                    <p className="mt-1 text-ink-600">{t("Yetkazish: ertaga 10:00–14:00")}</p>
                  </m.div>
                  <m.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: [0, 1, 1, 0] }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.6, duration: 2.4, times: [0, 0.1, 0.85, 1], ease: EASE }}
                    className="flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-3 shadow-sm"
                  >
                    {[0, 1, 2].map((d) => (
                      <m.span key={d} className="size-1.5 rounded-full bg-ink-400" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />
                    ))}
                  </m.div>
                </div>
              </div>
            </m.div>
          </Reveal>
        </div>
      </ZoomIn>
    </section>
  );
}
