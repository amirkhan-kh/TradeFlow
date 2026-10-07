"use client";

import { Bell, CircleCheck, FileText, Gift, Send, ShoppingCart } from "lucide-react";
import { buttonClass } from "@/shared/ui/Button";
import { LogoMark } from "@/shared/ui/Logo";
import { EASE, m, Marquee, Reveal, Stagger, StaggerItem } from "@/shared/ui/motion";

const INTEGRATIONS = ["1C: Buxgalteriya", "Didox", "my.soliq.uz", "Payme", "Click", "Uzum Bank", "Telegram", "Excel", "REST API", "Google Sheets", "SMS gateway"];

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
  return (
    <section id="telegram" className="scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-20">
          <p className="mb-6 text-center text-sm font-semibold text-ink-500">Tizimlaringiz bilan oson integratsiya</p>
          <Marquee>
            {INTEGRATIONS.map((i) => (
              <span key={i} className="rounded-2xl border border-ink-200/80 bg-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-ink-700 shadow-soft">
                {i}
              </span>
            ))}
          </Marquee>
        </Reveal>

        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                <Send className="size-3.5" /> Telegram bot
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-[2.6rem] sm:leading-[1.1]">
                Buyurtma va hisobotlarni to&apos;g&apos;ridan-to&apos;g&apos;ri Telegramda boshqaring
              </h2>
              <p className="mt-4 text-lg text-ink-600">Savdo nuqtalari bilan aloqa, push-bildirishnomalar va real vaqt nazorati.</p>
            </Reveal>
            <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2">
              {BOT.map(([Icon, title, text]) => (
                <StaggerItem as="li" key={title} className="group flex gap-3 rounded-2xl p-2 transition-colors hover:bg-white">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 transition-transform group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-bold text-ink-900">{title}</p>
                    <p className="text-sm text-ink-600">{text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2}>
              <a href="#demo" className={buttonClass("primary", "lg", "mt-8 rounded-2xl bg-sky-600 shadow-lg shadow-sky-600/25 hover:bg-sky-700")}>
                <Send className="size-4" /> Botni sinab ko&apos;rish
              </a>
            </Reveal>
          </div>

          <Reveal className="relative mx-auto w-full max-w-sm" y={40}>
            <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-[#8bc474]/40 to-sky-200 blur-3xl" />
            <m.div whileHover={{ rotate: -1.5, y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} className="rounded-[2.75rem] border-[10px] border-ink-900 bg-[#e6efe9] p-4 shadow-2xl">
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white px-3 py-2">
                <span className="grid size-9 place-items-center rounded-full bg-ink-50 ring-1 ring-ink-200">
                  <LogoMark className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-bold">TradeFlow Bot</p>
                  <p className="text-xs text-brand-600">online</p>
                </div>
              </div>
              <div className="min-h-80 space-y-2.5 text-sm">
                <m.p {...bubble(0, true)} className="ml-auto w-fit rounded-2xl rounded-br-sm bg-[#32536b] px-3 py-2 text-white">
                  /akt_sverka
                </m.p>
                <m.div {...bubble(1, false)} className="w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 shadow-sm">
                  <p className="font-bold">📄 Baraka Market — Oktabr</p>
                  <p className="mt-1 text-ink-600">Yuklandi: 48 250 000 so&apos;m</p>
                  <p className="text-ink-600">To&apos;landi: 36 000 000 so&apos;m</p>
                  <p className="mt-1 font-bold text-red-600">Qoldiq: 12 250 000 so&apos;m</p>
                </m.div>
                <m.p {...bubble(2, true)} className="ml-auto w-fit rounded-2xl rounded-br-sm bg-[#32536b] px-3 py-2 text-white">
                  Yangi buyurtma 🛒
                </m.p>
                <m.div {...bubble(3, false)} className="w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 shadow-sm">
                  <p className="flex items-center gap-1.5 font-bold">
                    <CircleCheck className="size-4 text-brand-600" /> TF-001248 qabul qilindi
                  </p>
                  <p className="mt-1 text-ink-600">Yetkazish: ertaga 10:00–14:00</p>
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
            </m.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
