import {
  ChartColumn,
  ClipboardCheck,
  FileSpreadsheet,
  Gift,
  HandCoins,
  PackageCheck,
  Receipt,
  RefreshCw,
  ScanSearch,
  ShoppingCart,
  TrendingUp,
  Truck,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, SpotlightCard, Stagger, StaggerItem } from "@/shared/ui/motion";
import { Section } from "./Section";

const GROUPS: { title: string; tag: string; items: [LucideIcon, string, string][] }[] = [
  {
    title: "Buyurtma va ombor",
    tag: "Operatsiyalar",
    items: [
      [ShoppingCart, "Buyurtmalar", "Agent buyurtma kiritadi — tizim qoldiqni avtomatik band qiladi. Yetkazish 25% gacha tezlashadi."],
      [Warehouse, "Ko'p omborli nazorat", "Har bir ombor bo'yicha qoldiq, rezerv, kirim-chiqim va ko'chirishlar real vaqtda."],
      [ClipboardCheck, "Ombor auditi", "Inventarizatsiya: kutilgan va sanalgan miqdor, kamomad summasi, tasdiqlash bilan qoldiqqa yozish."],
      [Truck, "Yetkazib berish", "Kuryer biriktirish, marshrut holati, o'z vaqtida yetkazish foizi va og'irlik bo'yicha yuk hisobi."],
    ],
  },
  {
    title: "Moliya va to'lovlar",
    tag: "Pul oqimi",
    items: [
      [HandCoins, "Debitorlik nazorati", "Har bir mijoz uchun kredit limiti. Limitdan oshsa — tizim yangi yuklashga ruxsat bermaydi."],
      [Receipt, "Akt sverka", "Mijoz bilan o'zaro hisob-kitob: yuklangan buyurtmalar va to'lovlar bir sahifada."],
      [Gift, "Chegirma va bonuslar", "Buyurtmadagi chegirmalar avtomatik hisoblanadi, hisobotda shaffof ko'rinadi."],
    ],
  },
  {
    title: "Avtomatlashtirish va tahlil",
    tag: "Aql",
    items: [
      [TrendingUp, "Talab prognozi", "Sotuv trendi asosida keyingi oy tushumi va har bir tovarning tugash sanasi."],
      [ChartColumn, "Jonli dashboard", "Tovar oqimi, sotuv hajmi, hududlar, top tovarlar va agentlar reytingi."],
      [ScanSearch, "Avtomatik ogohlantirishlar", "Kam qoldiq, muddati o'tayotgan tovar, faol bo'lmagan mijoz — darhol xabar."],
      [FileSpreadsheet, "Hisobotlar", "Kerakli ko'rsatkichlarni birlashtiring va Excel'ga yuklab oling."],
      [RefreshCw, "Integratsiyalar", "1C, Didox, Payme, Click va Telegram bilan ulanish uchun ochiq API."],
      [PackageCheck, "Idempotent operatsiyalar", "Bir xil kirim ikki marta yozilmaydi — tarmoq uzilsa ham qoldiq to'g'ri qoladi."],
    ],
  },
];

export function Solutions() {
  return (
    <Section
      id="imkoniyatlar"
      eyebrow="Avtomatlashtiring. Nazorat qiling. Rivojlaning."
      title="TradeFlow: biznesingiz uchun kompleks yechim"
      lead="Ombordan savdo nuqtasigacha bo'lgan butun distribyutsiya zanjiri bitta oynada."
    >
      <div className="space-y-14">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <Reveal className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-[#32536b] px-3 py-1 text-xs font-bold text-white">{g.tag}</span>
              <h3 className="text-xl font-bold text-ink-900">{g.title}</h3>
              <span className="h-px flex-1 bg-gradient-to-r from-ink-200 to-transparent" />
            </Reveal>
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {g.items.map(([Icon, title, text]) => (
                <StaggerItem key={title}>
                  <SpotlightCard className="h-full rounded-3xl border border-ink-200/70 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift">
                    <span className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-[#eef6e9] text-brand-600 ring-1 ring-brand-100 transition-all duration-300 group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-600/25">
                      <Icon className="size-5" />
                    </span>
                    <h4 className="relative mt-5 font-bold text-ink-900">{title}</h4>
                    <p className="relative mt-2 text-sm leading-relaxed text-ink-600">{text}</p>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ))}
      </div>
    </Section>
  );
}
