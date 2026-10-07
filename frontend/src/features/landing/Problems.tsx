import { Boxes, FileText, HandCoins, Server, Truck, UserCheck } from "lucide-react";
import { SpotlightCard, Stagger, StaggerItem } from "@/shared/ui/motion";
import { Section } from "./Section";

const ITEMS = [
  [FileText, "Qog'ozbozlik va chalkash hisobotlar", "Excel jadvallar, qo'lda yozilgan nakladnoylar va har kuni bir xil hisobotni qayta yig'ish."],
  [HandCoins, "Debitorlik qarzi o'sib bormoqda", "Qaysi savdo nuqtasi qancha qarz ekanini va qachon to'lashini hech kim aniq bilmaydi."],
  [Truck, "Logistika xarajatlari yuqori", "Bo'sh qatnovlar, kechikkan yetkazishlar va kuryerlar ustidan nazorat yo'qligi."],
  [Boxes, "Qoldiq va muddati o'tayotgan tovarlar", "Bir omborda ortiqcha, boshqasida tanqis. Muddati o'tgan tovar zarari keyin bilinadi."],
  [UserCheck, "Savdo agentlarini kuzatish qiyin", "Kim qayerga borgan, reja qanchaga bajarilgan — faqat oy oxirida ma'lum bo'ladi."],
  [Server, "Bir nechta tizim, yagona manzara yo'q", "Ombor, buxgalteriya va savdo alohida dasturlarda — ma'lumotlar bir-biriga mos kelmaydi."],
] as const;

export function Problems() {
  return (
    <Section
      eyebrow="O'sishga to'sqinlik qiluvchi muammolar"
      title="Biznesingiz shu muammolarga duch kelyaptimi?"
      lead="Bu muammolar nafaqat vaqt va pulni oladi, balki biznesingiz o'sishini sekinlashtiradi."
      className="bg-white"
    >
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(([Icon, title, text], i) => (
          <StaggerItem key={title}>
            <SpotlightCard glow="rgba(239,68,68,0.10)" className="h-full rounded-3xl border border-ink-200/70 bg-ink-50/40 p-7 transition-colors hover:border-red-200/80 hover:bg-white">
              <div className="relative flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-red-500 shadow-soft ring-1 ring-red-100 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon className="size-5" />
                </span>
                <span className="text-5xl font-extrabold text-ink-100 transition-colors group-hover:text-red-100">0{i + 1}</span>
              </div>
              <h3 className="relative mt-5 text-lg font-bold text-ink-900">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-600">{text}</p>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
