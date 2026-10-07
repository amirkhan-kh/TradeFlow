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
    <Section id="jarayon" eyebrow="Biz bilan ishlash bosqichlari" title="Hamkorlik qanday o'tadi?" className="bg-white">
      <div ref={ref} className="relative">
        <div aria-hidden className="absolute top-8 right-[12.5%] left-[12.5%] hidden h-0.5 rounded-full bg-ink-100 md:block">
          <m.div className="h-full origin-left rounded-full bg-gradient-to-r from-[#32536b] via-brand-500 to-[#8bc474]" style={{ scaleX: progress }} />
        </div>
        <Stagger as="ol" className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {STEPS.map(([Icon, title, text], i) => (
            <StaggerItem as="li" key={title} className="group text-center">
              <m.span whileHover={{ y: -4, rotate: -4 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-[#32536b] text-white shadow-xl shadow-brand-700/25">
                <Icon className="size-7" />
                <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-white text-xs font-extrabold text-[#32536b] shadow-soft ring-2 ring-brand-100">{i + 1}</span>
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
