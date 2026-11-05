"use client";

import { useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Bot, ClipboardCheck, HandCoins, Route, TrendingUp, Warehouse } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Aurora } from "@/shared/ui/Aurora";
import { m, SpotlightCard } from "@/shared/ui/motion";

const AGENTS = [
  [Warehouse, "Ombor agenti", "Har bir tovarning kunlik sotuvini hisoblab, necha kunda tugashini aytadi va qancha buyurtma berishni tavsiya qiladi.", "Coca-Cola 1.5L — 3 kunlik zaxira. 101 dona buyurtma bering."],
  [HandCoins, "Moliya agenti", "Kredit limitidan oshgan mijozlarni topadi, undirish darajasini kuzatadi.", "Baraka Market limitdan 13.9 mln so'mga oshdi."],
  [ClipboardCheck, "Audit agenti", "Uzoq vaqt tekshirilmagan omborlarni va katta kamomadli auditlarni ko'rsatadi.", "Buxoro Ombori: hali audit o'tkazilmagan."],
  [TrendingUp, "Sotuv agenti", "Rejadan ortda qolgan agentlar va buyurtma bermay qo'ygan mijozlarni aniqlaydi, prognoz beradi.", "Keyingi oy prognozi: 458 mln so'm."],
  [Route, "Logistika agenti", "Kechikayotgan va muvaffaqiyatsiz yetkazishlarni darhol ko'rsatadi.", "3 ta yetkazish rejadan kechikmoqda."],
] as const;

/**
 * Pinned horizontal rail: the dark panel expands from an inset card to full screen as it enters,
 * then vertical scroll drives the agent cards sideways. Reduced motion gets a plain grid.
 */
export function SmartAgents() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [height, setHeight] = useState<number>();
  const distance = useMotionValue(0);

  const { scrollYProgress: enter } = useScroll({ target: section, offset: ["start end", "start start"] });
  const { scrollYProgress: rail } = useScroll({ target: section, offset: ["start start", "end end"] });
  const inset = useTransform(enter, [0, 1], [5, 0]);
  const radius = useTransform(enter, [0, 1], [48, 0]);
  const clipPath = useMotionTemplate`inset(0% ${inset}% round ${radius}px)`;
  const x = useTransform(() => -rail.get() * distance.get());

  useEffect(() => {
    const el = track.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const measure = () => {
      const d = Math.max(0, el.scrollWidth - window.innerWidth);
      distance.set(d);
      setHeight(window.innerHeight + d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
    };
  }, [distance]);

  return (
    <section id="agentlar" ref={section} className="relative scroll-mt-0" style={height ? { height } : undefined}>
      <div className="relative overflow-hidden py-24 motion-safe:sticky motion-safe:top-0 motion-safe:flex motion-safe:h-svh motion-safe:flex-col motion-safe:justify-center motion-safe:py-0">
        <m.div aria-hidden style={reduce ? undefined : { clipPath }} className="absolute inset-0 bg-[#0c1826]">
          <Aurora dark />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(156_195_220/0.14),transparent_60%)]" />
        </m.div>

        <m.div
          ref={track}
          style={{ x }}
          className="relative mx-auto grid max-w-7xl gap-5 px-4 text-white sm:grid-cols-2 sm:px-6 lg:grid-cols-3 motion-safe:mx-0 motion-safe:flex motion-safe:w-max motion-safe:max-w-none motion-safe:items-stretch sm:motion-safe:px-[6vw]"
        >
          <div className="flex flex-col justify-center motion-safe:w-[86vw] motion-safe:shrink-0 sm:motion-safe:w-[30rem] lg:motion-safe:mr-10">
            <p className="glass-dark inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide text-[#cfe3ef]">
              <Bot className="size-3.5" /> SalesDoctor&apos;dan bir qadam oldinda
            </p>
            <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.035em] text-balance sm:text-5xl sm:leading-[1.05]">
              5 ta aqlli agent biznesingizni <span className="text-aurora-dark">24/7 kuzatadi</span>
            </h2>
            <p className="mt-5 text-lg text-white/70">Hisobot kutish shart emas. Agentlar har safar ma&apos;lumotlarni tahlil qilib, aniq harakatni taklif qiladi.</p>
            <div aria-hidden className="mt-10 h-1 w-48 overflow-hidden rounded-full bg-white/10 motion-reduce:hidden">
              <m.div className="h-full origin-left rounded-full bg-gradient-to-r from-[#9cc3dc] to-[#8bc474]" style={{ scaleX: rail }} />
            </div>
          </div>

          {AGENTS.map(([Icon, name, text, sample]) => (
            <SpotlightCard
              key={name}
              glow="rgba(139,196,116,0.2)"
              className={`glass-dark flex flex-col rounded-[2rem] p-7 transition-colors hover:border-[#9cc3dc]/40 sm:p-8 motion-safe:min-h-[min(30rem,72svh)] motion-safe:w-[80vw] motion-safe:shrink-0 sm:motion-safe:w-[24rem]`}
            >
              <div className="relative flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#9cc3dc]/30 to-[#4f86ab]/10 text-[#d6e8f3] shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] ring-1 ring-white/10">
                  <Icon className="size-6" />
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-brand-200">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#8bc474] opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-[#8bc474]" />
                  </span>
                  faol
                </span>
              </div>
              <h3 className="relative mt-8 text-2xl font-bold tracking-tight">{name}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-white/70">{text}</p>
              <p className="relative mt-auto pt-8">
                <span className="block rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 font-mono text-xs leading-relaxed text-[#d6e8f3]">
                  <span className="text-[#a6d48a]">›</span> {sample}
                </span>
              </p>
            </SpotlightCard>
          ))}
        </m.div>
      </div>
    </section>
  );
}
