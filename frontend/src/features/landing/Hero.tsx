"use client";

import { useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useRef } from "react";
import { ButtonLink } from "@/shared/ui/Button";
import { CountUp, m, Magnetic } from "@/shared/ui/motion";
import type { SiteKey } from "./copy";
import { HeroScene } from "./HeroScene";
import { useCopy } from "./SiteCopy";

const STATS: { to: number; prefix?: string; suffix: string; label: SiteKey }[] = [
  { to: 31, prefix: "−", suffix: "%", label: "ombor xarajatlari" },
  { to: 25, prefix: "+", suffix: "%", label: "tezroq yetkazish" },
  { to: 5, suffix: "ta", label: "aqlli agent 24/7" },
  { to: 100, suffix: "%", label: "audit shaffofligi" },
];

const SHAFTS = [
  ["left-[38%] w-28", "0s"],
  ["left-[58%] w-44", "-2s"],
  ["left-[80%] w-20", "-4s"],
] as const;

/** CSS entrance (runs before hydration, so the headline paints immediately). */
const rise = (delay: number) => ({ animationDelay: `${delay}s` });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const t = useCopy();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const floorY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden pt-28 pb-20 lg:min-h-[100svh] lg:pb-28">
      <div aria-hidden className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        <div className="absolute -top-[10%] right-[-15%] size-[58rem] bg-[radial-gradient(closest-side,rgb(50_83_107/0.32),rgb(79_134_171/0.12)_55%,transparent)] md:animate-drift" />
        <div className="absolute top-[20%] right-[10%] size-[40rem] bg-[radial-gradient(closest-side,rgb(156_195_220/0.55),transparent)] md:animate-drift [animation-delay:-10s]" />
        <div className="absolute bottom-[-25%] left-[-12%] size-[46rem] bg-[radial-gradient(closest-side,rgb(139_196_116/0.28),transparent)] md:animate-drift [animation-delay:-18s]" />

        {SHAFTS.map(([cls, delay]) => (
          <span
            key={cls}
            className={`absolute -top-[15%] h-[110%] rotate-[22deg] animate-breathe bg-gradient-to-b from-white/90 via-white/25 to-transparent ${cls}`}
            style={{ animationDelay: delay }}
          />
        ))}

        <m.div
          style={reduce ? undefined : { y: floorY }}
          className="absolute inset-x-0 bottom-0 h-[55%] [perspective:700px] [mask-image:linear-gradient(to_top,black_10%,transparent)]"
        >
          <div className="absolute inset-x-[-50%] bottom-[-10%] h-[220%] origin-bottom animate-[grid-flow_7s_linear_infinite] bg-[linear-gradient(rgb(50_83_107/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(50_83_107/0.12)_1px,transparent_1px)] bg-[size:64px_64px] [transform:rotateX(72deg)]" />
        </m.div>

        <div className="noise absolute inset-0 opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-10">
        <m.div style={reduce ? undefined : { y: textY, scale: textScale, opacity: fade, transformOrigin: "0% 50%" }}>
          <a
            href="#agentlar"
            style={rise(0)}
            className="glass group relative inline-flex animate-lift items-center gap-2 overflow-hidden rounded-full py-1 pr-3 pl-1 text-xs font-semibold text-ink-700"
          >
            <span className="rounded-full bg-[#32536b] px-2 py-0.5 text-[10px] font-bold text-white">{t("YANGI")}</span>
            <Sparkles className="size-3.5 text-[#4f86ab]" /> {t("5 ta aqlli agent ishga tushdi")}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 animate-[shine_3.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </a>

          <h1 className="mt-7 text-[2.5rem] leading-[1.02] font-extrabold tracking-[-0.04em] text-ink-900 sm:text-6xl lg:text-[3.5rem] xl:text-[3.9rem]">
            <span style={rise(0.05)} className="block animate-lift">
              {t("Yirik savdo va omborxona tizimlarini")}
            </span>
            <span style={rise(0.18)} className="block animate-lift pb-1">
              <span className="text-aurora">{t("samarali boshqaring")}</span>
            </span>
          </h1>

          <p style={rise(0.3)} className="mt-6 max-w-xl animate-lift text-lg leading-relaxed text-ink-600">
            {t(
              "Buyurtma, ombor, audit, yetkazib berish va debitorlik — bitta platformada. Aqlli agentlar zaxira tugashini, qarz oshishini va kamomadlarni sizdan oldin sezadi.",
            )}
          </p>

          <div style={rise(0.42)} className="mt-9 flex animate-lift flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink
                href="/login"
                size="lg"
                className="ring-beam group rounded-full! bg-gradient-to-b from-[#3d6a8a] to-[#1d3a52] shadow-[0_18px_50px_-12px_rgb(50_83_107/0.7)] hover:from-[#32536b] hover:to-[#16304a]"
              >
                {t("Tizimni sinab ko'rish")} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="#demo" size="lg" variant="ghost" className="glass rounded-full! pl-2! text-ink-900! hover:bg-white/80!">
              <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_6px_16px_-4px_rgb(31_147_102/0.6)]">
                <Play className="size-3 fill-current" />
              </span>
              {t("Demoni ko'rish")}
            </ButtonLink>
          </div>

          <dl style={rise(0.54)} className="glass mt-12 grid max-w-xl animate-lift grid-cols-2 gap-y-5 rounded-2xl p-5 sm:grid-cols-4 sm:divide-x sm:divide-ink-900/10">
            {STATS.map((s) => (
              <div key={s.label} className="sm:px-4 sm:first:pl-1">
                <dt className="sr-only">{t(s.label)}</dt>
                <dd className="text-[1.7rem] font-extrabold tracking-tight text-ink-900">
                  <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix === "ta" ? (t("ta") && ` ${t("ta")}`) : s.suffix} />
                </dd>
                <dd className="mt-0.5 text-xs text-ink-600">{t(s.label)}</dd>
              </div>
            ))}
          </dl>
        </m.div>

        <m.div style={reduce ? undefined : { scale: sceneScale, y: sceneY }}>
          <div className="animate-pop [animation-duration:1.1s]">
            <HeroScene progress={scrollYProgress} />
          </div>
        </m.div>
      </div>

      <a
        href="#imkoniyatlar"
        aria-label={t("Imkoniyatlarga o'tish")}
        className="glass absolute bottom-8 left-1/2 hidden h-11 w-7 -translate-x-1/2 justify-center rounded-full pt-2 lg:flex"
      >
        <span className="block h-2 w-1 animate-[cue_1.8s_ease-in-out_infinite] rounded-full bg-[#32536b]" />
      </a>
    </section>
  );
}
