"use client";

import { useScroll, useSpring } from "motion/react";
import { GraduationCap, Headset, Rocket, ScanSearch } from "lucide-react";
import { useRef } from "react";
import { m, Stagger, StaggerItem } from "@/shared/ui/motion";
import { Section } from "./Section";

const STEPS = [
  [ScanSearch, "Audit", "Mahsulot, biznes va distribyutsiya tuzilmasini o'rganamiz, yaxshilash bo'yicha tavsiyalar beramiz va tizimni sozlaymiz."],
  [Rocket, "Ishga tushirish", "Ishonchli serverda joylashtiramiz — ma'lumotlaringiz xavfsiz va doimo uzluksiz ishlaydi."],
  [GraduationCap, "O'qitish", "Operator, agent, kuryer va auditorlar uchun rolga mos qisqa o'quv dasturi."],
  [Headset, "Qo'llab-quvvatlash", "Har kuni call-markaz va Telegram orqali barcha savollaringizga javob beramiz."],
] as const;

export function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 24 });

  return (
    <Section id="jarayon" eyebrow="Biz bilan ishlash bosqichlari" title="Hamkorlik qanday o'tadi?" fx={{ variant: "beams" }} backdrop={{ src: "/landing/steps-surreal.webp", className: "opacity-90" }}>
      <div ref={ref} className="relative">
        <div aria-hidden className="absolute top-14 right-[12.5%] left-[12.5%] hidden h-1 rounded-full bg-white/80 lg:block">
          <m.div
            className="h-full origin-left rounded-full bg-gradient-to-r from-[#32536b] via-[#4f86ab] to-brand-400 shadow-[0_0_16px_2px_rgb(79_134_171/0.5)]"
            style={{ scaleX: progress }}
          />
        </div>
        <Stagger as="ol" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([Icon, title, text], i) => (
            <StaggerItem as="li" key={title} className="group glass relative rounded-2xl px-5 pt-6 pb-7 text-center">
              <m.span whileHover={{ y: -4, rotate: -4 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="relative mx-auto grid size-16 place-items-center rounded-xl bg-gradient-to-br from-[#4f86ab] to-[#16283a] text-white shadow-[0_18px_36px_-12px_rgb(22_40_58/0.6),inset_0_1px_0_rgb(255_255_255/0.3)]">
                <Icon className="size-7" />
                <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-white text-xs font-extrabold text-[#32536b] shadow-soft ring-2 ring-brand-200">{i + 1}</span>
              </m.span>
              <h3 className="mt-6 text-lg font-bold text-ink-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
