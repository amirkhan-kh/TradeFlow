import { Bot, ClipboardCheck, HandCoins, Route, TrendingUp, Warehouse } from "lucide-react";
import { Aurora } from "@/shared/ui/Aurora";
import { Reveal, SpotlightCard, Stagger, StaggerItem } from "@/shared/ui/motion";

const AGENTS = [
  [Warehouse, "Ombor agenti", "Har bir tovarning kunlik sotuvini hisoblab, necha kunda tugashini aytadi va qancha buyurtma berishni tavsiya qiladi.", "Coca-Cola 1.5L — 3 kunlik zaxira. 101 dona buyurtma bering."],
  [HandCoins, "Moliya agenti", "Kredit limitidan oshgan mijozlarni topadi, undirish darajasini kuzatadi.", "Baraka Market limitdan 13.9 mln so'mga oshdi."],
  [ClipboardCheck, "Audit agenti", "Uzoq vaqt tekshirilmagan omborlarni va katta kamomadli auditlarni ko'rsatadi.", "Buxoro Ombori: hali audit o'tkazilmagan."],
  [TrendingUp, "Sotuv agenti", "Rejadan ortda qolgan agentlar va buyurtma bermay qo'ygan mijozlarni aniqlaydi, prognoz beradi.", "Keyingi oy prognozi: 458 mln so'm."],
  [Route, "Logistika agenti", "Kechikayotgan va muvaffaqiyatsiz yetkazishlarni darhol ko'rsatadi.", "3 ta yetkazish rejadan kechikmoqda."],
] as const;

export function SmartAgents() {
  return (
    <section id="agentlar" className="relative scroll-mt-24 overflow-hidden bg-[#0b1f17] py-24 text-white sm:py-28">
      <Aurora dark />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold tracking-wide text-brand-200 backdrop-blur">
            <Bot className="size-3.5" /> SalesDoctor&apos;dan bir qadam oldinda
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] sm:text-[2.75rem] sm:leading-[1.1]">
            5 ta aqlli agent biznesingizni{" "}
            <span className="bg-gradient-to-r from-[#a6d48a] to-brand-300 bg-clip-text text-transparent">24/7 kuzatadi</span>
          </h2>
          <p className="mt-4 text-lg text-white/65">Hisobot kutish shart emas. Agentlar har safar ma&apos;lumotlarni tahlil qilib, aniq harakatni taklif qiladi.</p>
        </Reveal>
        <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map(([Icon, name, text, sample], i) => (
            <StaggerItem key={name} className={i === 0 ? "lg:row-span-2" : ""}>
              <SpotlightCard
                glow="rgba(139,196,116,0.18)"
                className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-colors hover:border-[#8bc474]/40"
              >
                <div className="relative flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#8bc474]/30 to-brand-500/10 text-[#b9e3a3] ring-1 ring-white/10">
                    <Icon className="size-5" />
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-brand-200/80">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#8bc474] opacity-60" />
                      <span className="relative inline-flex size-2 rounded-full bg-[#8bc474]" />
                    </span>
                    faol
                  </span>
                </div>
                <h3 className="relative mt-5 text-lg font-bold">{name}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/60">{text}</p>
                <p className="relative mt-auto pt-5">
                  <span className="block rounded-2xl border border-[#8bc474]/20 bg-[#8bc474]/10 px-3.5 py-2.5 font-mono text-xs leading-relaxed text-[#cdeabd]">
                    <span className="text-[#8bc474]">›</span> {sample}
                  </span>
                </p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
