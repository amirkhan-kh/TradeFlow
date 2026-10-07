import { Award, Layers, MessageCircle, MousePointerClick, Smartphone, Target } from "lucide-react";
import { SpotlightCard, Stagger, StaggerItem } from "@/shared/ui/motion";
import { Section } from "./Section";

const ITEMS = [
  [MousePointerClick, "Qulay interfeys", "Oddiy, o'rganish va ishlatish oson. Yangi xodim bir kunda o'zlashtiradi."],
  [Award, "Tajribaga asoslangan", "Turli hajmdagi distribyutorlarning real jarayonlari asosida qurilgan."],
  [Target, "Aniq hisobot", "Kerakli ma'lumot bitta hisobotda. Asosiy ko'rsatkichlarni solishtirish uchun tayyor shablonlar."],
  [Layers, "Eng yaxshi amaliyotlar", "Yirik kompaniyalar tajribasi va real biznes vazifalaridan olingan tizimli yechimlar."],
  [MessageCircle, "Mijozga raqamli yaqinlik", "Telegram-bot, mobil ilova va SMS — mijozlaringiz bilan doimiy aloqa."],
] as const;

export function Advantages() {
  return (
    <Section eyebrow="Afzalliklar" title="Nega mijozlar TradeFlow'ni tanlaydi" className="bg-white">
      <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(([Icon, title, text]) => (
          <StaggerItem key={title}>
            <SpotlightCard tilt={false} className="flex h-full gap-4 rounded-3xl border border-transparent p-6 transition-colors hover:border-ink-200/70 hover:bg-ink-50/50">
              <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-[#32536b] text-white shadow-lg shadow-brand-700/20 transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-5" />
              </span>
              <div className="relative">
                <h3 className="font-bold text-ink-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{text}</p>
              </div>
            </SpotlightCard>
          </StaggerItem>
        ))}
        <StaggerItem>
          <SpotlightCard glow="rgba(255,255,255,0.18)" className="flex h-full flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#32536b] via-brand-700 to-brand-800 p-7 text-white shadow-lift">
            <div aria-hidden className="absolute -top-10 -right-10 size-40 rounded-full bg-[#8bc474]/30 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <Smartphone className="size-6" />
              <h3 className="font-bold">iOS va Android uchun mobil ilova</h3>
            </div>
            <p className="relative text-sm text-white/75">Agentlar uchun oflayn buyurtma, marshrut va foto-hisobot.</p>
            <div className="relative flex gap-2 text-xs font-semibold">
              <span className="rounded-xl bg-white/15 px-3 py-1.5 backdrop-blur">App Store</span>
              <span className="rounded-xl bg-white/15 px-3 py-1.5 backdrop-blur">Google Play</span>
            </div>
          </SpotlightCard>
        </StaggerItem>
      </Stagger>
    </Section>
  );
}
