"use client";

import { useScroll, useTransform } from "motion/react";
import { BellRing, Boxes, CircleCheck, ClipboardCheck, LayoutDashboard, ShoppingCart, Truck, Wallet, Warehouse } from "lucide-react";
import { useRef } from "react";
import { LogoMark } from "@/shared/ui/Logo";
import { EASE, m } from "@/shared/ui/motion";
import { Section } from "./Section";

const NAV = [
  [LayoutDashboard, "Dashboard"],
  [Warehouse, "Omborlar"],
  [ShoppingCart, "Buyurtmalar"],
  [Truck, "Yetkazish"],
  [ClipboardCheck, "Audit"],
  [Wallet, "Moliya"],
] as const;

const KPIS = [
  ["Faol omborlar", "5", Warehouse],
  ["Oylik tushum", "361 mln", Wallet],
  ["Yuklangan", "12.8 t", Boxes],
  ["Faol auditlar", "2", ClipboardCheck],
] as const;

const BARS = [42, 55, 48, 70, 64, 82, 90];
const LINE = "M0 70 C 30 60, 50 66, 80 48 S 140 30, 170 38 S 230 12, 260 8";

export function ProductPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.78, 1.04]);
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const chipA = useTransform(pass, [0, 1], [120, -160]);
  const chipB = useTransform(pass, [0, 1], [60, -240]);

  return (
    <Section eyebrow="Ichkaridan ko'rinishi" title="Murakkab ma'lumot — sodda va tushunarli ekran" lead="Ko'zni charchatmaydigan ranglar, aniq raqamlar va bir qarashda tushuniladigan grafiklar.">
      <div ref={ref} className="relative [perspective:1400px]">
        <div aria-hidden className="absolute inset-x-10 -bottom-16 top-16 rounded-3xl bg-gradient-to-r from-[#8bc474]/30 via-[#9cc3dc]/50 to-[#32536b]/35 blur-3xl" />
        <m.div style={{ y: chipA }} className="glass absolute -top-6 left-0 z-10 hidden rounded-xl px-4 py-3 md:block lg:-left-6">
          <p className="flex items-center gap-2 text-xs font-semibold text-red-600">
            <BellRing className="size-3.5" /> Kam qoldiq
          </p>
          <p className="mt-0.5 text-sm font-bold text-ink-900">12 ta tovar 3 kunda tugaydi</p>
        </m.div>
        <m.div style={{ y: chipB }} className="glass absolute right-0 bottom-10 z-10 hidden rounded-xl px-4 py-3 md:block lg:-right-6">
          <p className="flex items-center gap-2 text-xs font-semibold text-[#32536b]">
            <CircleCheck className="size-3.5" /> Yangi buyurtma
          </p>
          <p className="mt-0.5 text-sm font-bold text-ink-900">TF-001248 band qilindi</p>
        </m.div>
        <m.div style={{ rotateX, scale, y, transformOrigin: "center top" }} className="glass relative mx-auto max-w-5xl rounded-3xl p-2 sm:p-3">
          <div className="overflow-hidden rounded-2xl border border-white bg-white shadow-[0_40px_100px_-30px_rgb(16_40_32/0.35)] ring-1 ring-ink-200/60">
            <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-red-300" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-brand-300" />
              <span className="ml-3 rounded-md bg-white px-3 py-0.5 text-xs text-ink-600 ring-1 ring-ink-200">app.tradeflow.uz/dashboard</span>
            </div>
            <div className="grid md:grid-cols-[180px_1fr]">
              <aside className="hidden border-r border-ink-100 p-3 md:block">
                <div className="mb-4 flex items-center gap-2 px-2">
                  <LogoMark className="size-6" />
                  <span className="text-sm font-extrabold text-[#32536b]">TradeFlow</span>
                </div>
                {NAV.map(([Icon, label], i) => (
                  <m.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: EASE }}
                    className={`mb-0.5 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium ${i === 0 ? "bg-brand-50 text-brand-700" : "text-ink-500"}`}
                  >
                    <Icon className="size-3.5" /> {label}
                  </m.div>
                ))}
              </aside>
              <div className="space-y-3 bg-ink-50/50 p-4">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {KPIS.map(([l, v, Icon], i) => (
                    <m.div
                      key={l}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: EASE }}
                      className="rounded-xl bg-white p-3 ring-1 ring-ink-100"
                    >
                      <div className="flex items-center justify-between text-[11px] text-ink-500">
                        {l} <Icon className="size-3.5 text-brand-500" />
                      </div>
                      <p className="mt-1 text-lg font-extrabold">{v}</p>
                    </m.div>
                  ))}
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-xl bg-white p-3 ring-1 ring-ink-100">
                    <p className="text-xs font-bold text-ink-700">Tovar oqimi</p>
                    <svg viewBox="0 0 260 80" className="mt-2 h-28 w-full" aria-hidden>
                      <defs>
                        <linearGradient id="pv" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0" stopColor="#8bc474" stopOpacity=".4" />
                          <stop offset="1" stopColor="#8bc474" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <m.path d={`${LINE} L260 80 L0 80Z`} fill="url(#pv)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1, duration: 0.8 }} />
                      <m.path d={LINE} fill="none" stroke="#137852" strokeWidth="2.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 1.4, ease: EASE }} />
                      <m.path
                        d="M0 74 C 40 70, 70 60, 110 62 S 190 40, 260 30"
                        fill="none"
                        stroke="#32536b"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                      />
                    </svg>
                  </div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-ink-100">
                    <p className="text-xs font-bold text-ink-700">Sotuv hajmi</p>
                    <div className="mt-2 flex h-28 items-end gap-2">
                      {BARS.map((h, i) => (
                        <div key={i} className="flex h-full flex-1 items-end gap-0.5">
                          {[
                            [h, "bg-[#32536b]"],
                            [h * 0.8, "bg-[#8bc474]"],
                          ].map(([height, cls], k) => (
                            <m.span
                              key={k}
                              className={`flex-1 origin-bottom rounded-t ${cls}`}
                              style={{ height: `${height}%` }}
                              initial={{ scaleY: 0 }}
                              whileInView={{ scaleY: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 + i * 0.05 + k * 0.03, duration: 0.7, ease: EASE }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </Section>
  );
}
