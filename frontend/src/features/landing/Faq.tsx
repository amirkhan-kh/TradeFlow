"use client";

import { AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { EASE, m, Stagger, StaggerItem } from "@/shared/ui/motion";
import { Section } from "./Section";

const FAQ = [
  ["TradeFlow kimlar uchun?", "Distribyutorlar, ulgurji savdo kompaniyalari, ishlab chiqaruvchilar va bir nechta omborga ega savdo tarmoqlari uchun."],
  ["Ma'lumotlarimiz qayerda saqlanadi?", "O'zingiz tanlagan serverda (O'zbekiston yoki Yevropa). Ma'lumotlar shifrlangan kanal orqali uzatiladi va har kuni zaxiralanadi."],
  ["Ishga tushirish qancha vaqt oladi?", "Odatda 1–2 hafta: audit, sozlash, ma'lumotlarni ko'chirish va xodimlarni o'qitish."],
  ["1C yoki boshqa dastur bilan ulanadimi?", "Ha. TradeFlow ochiq REST API'ga ega — 1C, Didox, to'lov tizimlari va boshqa ERP'lar bilan integratsiya qilinadi."],
  ["Aqlli agentlar qanday ishlaydi?", "Ular sotuv, qoldiq, to'lov va audit ma'lumotlarini doimiy tahlil qiladi va aniq tavsiyalar beradi: nima buyurtma qilish, kimdan qarz undirish, qaysi omborni tekshirish."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section eyebrow="Savol-javob" title="Ko'p beriladigan savollar">
      <Stagger className="mx-auto max-w-3xl space-y-3">
        {FAQ.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <StaggerItem key={q}>
              <div className={`rounded-3xl border bg-white transition-all duration-300 ${isOpen ? "border-brand-200 shadow-lift" : "border-ink-200/70 shadow-soft"}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-ink-900"
                >
                  {q}
                  <m.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600"}`}
                  >
                    <Plus className="size-4" />
                  </m.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink-600">{a}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
