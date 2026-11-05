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
  Wallet,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SpotlightCard } from "@/shared/ui/motion";
import { GroupBlock } from "./GroupBlock";
import { Section } from "./Section";
import { Drift, ZoomIn } from "./ZoomIn";

const GROUPS: { title: string; tag: string; icon: LucideIcon; image: string; items: [LucideIcon, string, string][] }[] = [
  {
    title: "Buyurtma va ombor",
    tag: "Operatsiyalar",
    image: "/landing/photo-warehouse.webp",
    icon: Warehouse,
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
    image: "/landing/photo-payments.webp",
    icon: HandCoins,
    items: [
      [HandCoins, "Debitorlik nazorati", "Har bir mijoz uchun kredit limiti. Limitdan oshsa — tizim yangi yuklashga ruxsat bermaydi."],
      [Receipt, "Akt sverka", "Mijoz bilan o'zaro hisob-kitob: yuklangan buyurtmalar va to'lovlar bir sahifada."],
      [Gift, "Chegirma va bonuslar", "Buyurtmadagi chegirmalar avtomatik hisoblanadi, hisobotda shaffof ko'rinadi."],
      [Wallet, "Onlayn to'lov havolalari", "Mijoz qarzi uchun Payme yoki Click havolasini bir bosishda yuboring — to'lov tez va qog'ozsiz."],
    ],
  },
  {
    title: "Avtomatlashtirish va tahlil",
    tag: "Aql",
    image: "/landing/photo-analytics.webp",
    icon: TrendingUp,
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
      fx={{ variant: "mesh", side: "left" }}
    >
      <div className="space-y-16 lg:space-y-28">
        {GROUPS.map((g, gi) => (
          <GroupBlock
            key={g.title}
            flip={gi % 2 === 1}
            image={g.image}
            panel={
              <>
                <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                  <span className="ring-beam grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#3d6a8a] to-[#16283a] text-white shadow-[0_18px_36px_-14px_rgb(22_40_58/0.7),inset_0_1px_0_rgb(255_255_255/0.25)]">
                    <g.icon className="size-6" />
                  </span>
                  <div>
                    <span className="rounded-full bg-[#32536b] px-3 py-1 text-xs font-bold text-white shadow-[0_8px_20px_-8px_rgb(50_83_107/0.7)]">{g.tag}</span>
                    <h3 className="mt-3 text-xl font-bold text-ink-900 lg:text-[1.75rem] lg:leading-tight lg:tracking-tight">{g.title}</h3>
                  </div>
                </div>
                <p className="mt-4 hidden text-sm text-ink-600 lg:block">
                  {gi + 1}-yo&apos;nalish, {g.items.length} ta modul
                </p>
              </>
            }
          >
            <div className={`grid gap-4 sm:grid-cols-2 ${g.items.length % 3 === 0 ? "xl:grid-cols-3" : ""}`}>
              {g.items.map(([Icon, title, text], i) => (
                <Drift key={title} distance={g.items.length % 3 === 0 ? [0, 36, 14][i % 3] : i % 2 ? 32 : 0}>
                  <ZoomIn from={0.86} y={50} tilt={16} end="start 70%" className="h-full">
                    <SpotlightCard className="glass h-full overflow-hidden rounded-[1.75rem] p-6 transition-shadow hover:shadow-lift">
                      <span aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#4f86ab]/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span aria-hidden className="absolute -right-10 -bottom-10 size-32 bg-[radial-gradient(closest-side,rgb(139_196_116/0.3),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-white to-[#eaf2f7] text-[#32536b] shadow-[inset_0_1px_0_white] ring-1 ring-[#32536b]/10 transition-all duration-300 group-hover:from-[#4f86ab] group-hover:to-[#1d3a52] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#32536b]/30">
                        <Icon className="size-5" />
                      </span>
                      <h4 className="relative mt-5 font-bold text-ink-900">{title}</h4>
                      <p className="relative mt-2 text-sm leading-relaxed text-ink-600">{text}</p>
                    </SpotlightCard>
                  </ZoomIn>
                </Drift>
              ))}
            </div>
          </GroupBlock>
        ))}
      </div>
    </Section>
  );
}
