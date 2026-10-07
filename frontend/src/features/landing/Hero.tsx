"use client";

import { useScroll, useTransform } from "motion/react";
import { ArrowRight, BadgeCheck, Play, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useRef } from "react";
import { Aurora } from "@/shared/ui/Aurora";
import { ButtonLink } from "@/shared/ui/Button";
import { CountUp, EASE, m, Magnetic, WordReveal } from "@/shared/ui/motion";
import { HeroIllustration } from "./HeroIllustration";

const STATS = [
  { to: 31, prefix: "−", suffix: "%", label: "ombor xarajatlari" },
  { to: 25, prefix: "+", suffix: "%", label: "tezroq yetkazish" },
  { to: 5, suffix: " ta", label: "aqlli agent 24/7" },
  { to: 100, suffix: "%", label: "audit shaffofligi" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const chipFast = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const chipSlow = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-[#f3f8f1] via-ink-50 to-ink-50 pt-28">
      <Aurora />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-8">
        <m.div style={{ y: textY, opacity: fade }}>
          <m.a
            href="#agentlar"
            {...fadeUp(0)}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/70 bg-white/60 py-1 pr-3 pl-1 text-xs font-semibold text-ink-700 shadow-soft backdrop-blur"
          >
            <span className="rounded-full bg-[#32536b] px-2 py-0.5 text-[10px] font-bold text-white">YANGI</span>
            <Sparkles className="size-3.5 text-brand-600" /> 5 ta aqlli agent ishga tushdi
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 animate-[shine_3.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </m.a>

          <h1 className="mt-6 text-[2.6rem] leading-[1.04] font-extrabold tracking-[-0.035em] text-ink-900 sm:text-6xl lg:text-[4.1rem]">
            <WordReveal text="Yirik savdo va omborxona tizimlarini" delay={0.1} />
            <m.span
              className="block bg-gradient-to-r from-[#32536b] via-brand-600 to-[#6aa952] bg-[length:200%_auto] bg-clip-text pb-1 text-transparent"
              initial={{ opacity: 0, y: 20, backgroundPosition: "0% 50%" }}
              animate={{ opacity: 1, y: 0, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ opacity: { delay: 0.45, duration: 0.8, ease: EASE }, y: { delay: 0.45, duration: 0.8, ease: EASE }, backgroundPosition: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
            >
              samarali boshqaring
            </m.span>
          </h1>

          <m.p {...fadeUp(0.6)} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            Buyurtma, ombor, audit, yetkazib berish va debitorlik — bitta platformada. Aqlli agentlar zaxira tugashini, qarz oshishini va kamomadlarni sizdan
            oldin sezadi.
          </m.p>

          <m.div {...fadeUp(0.72)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href="/login" size="lg" className="group rounded-2xl bg-gradient-to-b from-brand-500 to-brand-700 shadow-lg shadow-brand-700/30 hover:from-brand-600 hover:to-brand-800">
                Tizimni sinab ko&apos;rish <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="#demo" size="lg" variant="secondary" className="rounded-2xl border-white/80 bg-white/70 backdrop-blur">
              <span className="grid size-6 place-items-center rounded-full bg-[#32536b] text-white">
                <Play className="size-3 fill-current" />
              </span>
              Demoni ko&apos;rish
            </ButtonLink>
          </m.div>

          <m.dl {...fadeUp(0.85)} className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-ink-200/70 pt-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-extrabold tracking-tight text-ink-900">
                  <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
                </dd>
                <dd className="mt-0.5 text-xs text-ink-500">{s.label}</dd>
              </div>
            ))}
          </m.dl>
        </m.div>

        <div className="relative">
          <m.div
            style={{ y: artY, scale: artScale }}
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          >
            <m.div animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <HeroIllustration />
            </m.div>
          </m.div>

          <m.div style={{ y: chipFast }} className="absolute top-6 left-0 sm:left-2">
            <m.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.9 }}
              className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-lift backdrop-blur-xl"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <BadgeCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs text-ink-500">Audit AU-00031</p>
                <p className="text-sm font-bold text-ink-900">Tasdiqlandi</p>
              </div>
            </m.div>
          </m.div>

          <m.div style={{ y: chipSlow }} className="absolute right-0 bottom-14 sm:right-4">
            <m.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.1 }}
              className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-lift backdrop-blur-xl"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Truck className="size-5" />
              </span>
              <div>
                <p className="text-xs text-ink-500">O&apos;z vaqtida yetkazish</p>
                <p className="text-sm font-bold text-ink-900">
                  <CountUp to={98.4} decimals={1} suffix="%" />
                </p>
              </div>
            </m.div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6, ease: EASE }}
            className="absolute bottom-0 left-6 hidden items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-soft backdrop-blur sm:flex"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
            </span>
            <ShieldCheck className="size-4 text-brand-600" /> Ma&apos;lumotlar shifrlangan
          </m.div>
        </div>
      </div>
    </section>
  );
}
