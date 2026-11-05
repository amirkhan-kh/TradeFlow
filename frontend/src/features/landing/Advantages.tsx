import { Award, Layers, MessageCircle, MousePointerClick, Smartphone, Target } from "lucide-react";
import { SpotlightCard, Stagger, StaggerItem } from "@/shared/ui/motion";
import { Section } from "./Section";
import { ZoomIn } from "./ZoomIn";

const ITEMS = [
  [MousePointerClick, "Qulay interfeys", "Oddiy, o'rganish va ishlatish oson. Yangi xodim bir kunda o'zlashtiradi."],
  [Award, "Tajribaga asoslangan", "Turli hajmdagi distribyutorlarning real jarayonlari asosida qurilgan."],
  [Target, "Aniq hisobot", "Kerakli ma'lumot bitta hisobotda. Asosiy ko'rsatkichlarni solishtirish uchun tayyor shablonlar."],
  [Layers, "Eng yaxshi amaliyotlar", "Yirik kompaniyalar tajribasi va real biznes vazifalaridan olingan tizimli yechimlar."],
  [MessageCircle, "Mijozga raqamli yaqinlik", "Telegram-bot, mobil ilova va SMS — mijozlaringiz bilan doimiy aloqa."],
] as const;

export function Advantages() {
  return (
    <Section eyebrow="Afzalliklar" title="Nega mijozlar TradeFlow'ni tanlaydi" fx={{ variant: "grid" }}>
      <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(([Icon, title, text]) => (
          <StaggerItem key={title}>
            <ZoomIn from={0.86} y={50} tilt={16} end="start 70%" className="h-full">
              <SpotlightCard className="glass flex h-full gap-4 rounded-[1.75rem] p-6 transition-colors hover:bg-white/75">
                <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#4f86ab] to-[#1d3a52] text-white shadow-lg shadow-[#32536b]/25 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" />
                </span>
                <div className="relative">
                  <h3 className="font-bold text-ink-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{text}</p>
                </div>
              </SpotlightCard>
            </ZoomIn>
          </StaggerItem>
        ))}
        <StaggerItem>
          <ZoomIn from={0.86} y={50} tilt={16} end="start 70%" className="h-full">
            <SpotlightCard glow="rgba(255,255,255,0.18)" className="flex h-full flex-col justify-between gap-4 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#2b4a63] via-[#1d3a52] to-[#13263a] p-7 text-white shadow-lift">
              <div aria-hidden className="absolute -top-16 -right-16 size-56 bg-[radial-gradient(closest-side,rgb(139_196_116/0.45),transparent)]" />
              <div aria-hidden className="absolute -bottom-20 -left-12 size-56 bg-[radial-gradient(closest-side,rgb(156_195_220/0.3),transparent)]" />
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
          </ZoomIn>
        </StaggerItem>
      </Stagger>
    </Section>
  );
}
