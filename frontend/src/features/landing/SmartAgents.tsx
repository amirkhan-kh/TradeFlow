"use client";

import { useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, Bot, ClipboardCheck, HandCoins, Route, TrendingUp, Warehouse } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Aurora } from "@/shared/ui/Aurora";
import { m, SpotlightCard } from "@/shared/ui/motion";

const AGENTS = [
  [Warehouse, "Ombor agenti", "Har bir tovarning kunlik sotuvini hisoblab, necha kunda tugashini aytadi va qancha buyurtma berishni tavsiya qiladi.", "Coca-Cola 1.5L — 3 kunlik zaxira. 101 dona buyurtma bering."],
  [HandCoins, "Moliya agenti", "Kredit limitidan oshgan mijozlarni topadi, undirish darajasini kuzatadi.", "Baraka Market limitdan 13.9 mln so'mga oshdi."],
  [ClipboardCheck, "Audit agenti", "Uzoq vaqt tekshirilmagan omborlarni va katta kamomadli auditlarni ko'rsatadi.", "Buxoro Ombori: hali audit o'tkazilmagan."],
  [TrendingUp, "Sotuv agenti", "Rejadan ortda qolgan agentlar va buyurtma bermay qo'ygan mijozlarni aniqlaydi, prognoz beradi.", "Keyingi oy prognozi: 458 mln so'm."],
  [Route, "Logistika agenti", "Kechikayotgan va muvaffaqiyatsiz yetkazishlarni darhol ko'rsatadi.", "3 ta yetkazish rejadan kechikmoqda."],
] as const;

/** Backdrop artwork per agent (same order as AGENTS): file, art style, glow colour (r g b). */
const ART = [
  ["agent-ombor", "futuristic", "79 134 171"],
  ["agent-moliya", "glassmorphism", "139 196 116"],
  ["agent-audit", "clay", "156 195 220"],
  ["agent-sotuv", "cyberpunk", "111 200 161"],
  ["agent-logistika", "surreal aurora", "139 196 116"],
] as const;

/** Track children in track coordinates. `zone` is where the artwork rests on wide screens (the intro's centre). */
type Layout = { centers: number[]; widths: number[]; zone: number; vw: number; wide: boolean };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * 1 = fully shown, 0 = dissolved. Wide: the intro yields while the first card travels in, then each
 * card dissolves into the artwork as its centre reaches the zone. Narrow: items fade as they leave
 * the centre to the left.
 */
function presence(l: Layout, i: number, shift: number) {
  if (!l.centers.length) return 1;
  if (!l.wide) return clamp01((l.centers[i] + shift - l.vw / 2 + 0.9 * l.widths[i]) / (0.9 * l.widths[i]));
  if (i === 0) {
    const end = l.zone + 0.9 * l.widths[1];
    return clamp01((l.centers[1] + shift - end) / (l.centers[1] - end));
  }
  return clamp01((l.centers[i] + shift - l.zone) / (0.9 * l.widths[i]));
}

/**
 * Pinned horizontal rail: the dark panel expands from an inset card to full screen as it enters,
 * then vertical scroll drives the cards sideways. On wide screens the artwork slides into the spot
 * the intro leaves and each card hands its place over to its own artwork. Scroll-linked work is
 * opacity/transform only. Reduced motion gets a plain grid without the artwork stage.
 */
export function SmartAgents() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const layout = useRef<Layout>({ centers: [], widths: [], zone: 0, vw: 0, wide: false });
  const reduce = useReducedMotion();
  const [height, setHeight] = useState<number>();
  const [active, setActive] = useState(0);
  const distance = useMotionValue(0);

  const { scrollYProgress: enter } = useScroll({ target: section, offset: ["start end", "start start"] });
  const { scrollYProgress: rail } = useScroll({ target: section, offset: ["start start", "end end"] });
  const inset = useTransform(enter, [0, 1], [5, 0]);
  const radius = useTransform(enter, [0, 1], [28, 0]);
  const clipPath = useMotionTemplate`inset(0% ${inset}% round ${radius}px)`;
  const x = useTransform(() => -rail.get() * distance.get());

  const intro = useTransform(x, (v) => smooth(presence(layout.current, 0, v)));
  const introX = useTransform(intro, [0, 1], [-48, 0]);
  const stageX = useTransform(intro, (p) => (layout.current.wide ? (1 - p) * (layout.current.zone - layout.current.vw / 2) : 0));
  const stageOpacity = useTransform(intro, [0, 1], [1, 0.55]);
  const frame = useTransform(intro, [0, 0.6], [1, 0]);

  const pick = (shift: number) => {
    const l = layout.current;
    if (!l.centers.length) return;
    let next = 0;
    let best = Infinity;
    for (let i = 1; i <= AGENTS.length; i++) {
      const c = l.centers[i] + shift;
      if (l.wide) {
        if (c < l.zone + 0.45 * l.widths[i]) next = i - 1;
      } else if (Math.abs(c - l.vw / 2) < best) {
        best = Math.abs(c - l.vw / 2);
        next = i - 1;
      }
    }
    setActive(next);
  };
  useMotionValueEvent(x, "change", pick);

  useEffect(() => {
    const el = track.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const measure = () => {
      const kids = Array.from(el.children as HTMLCollectionOf<HTMLElement>);
      const vw = window.innerWidth;
      const wide = vw >= 1024;
      const centers = kids.map((c) => c.offsetLeft + c.offsetWidth / 2);
      const last = centers[AGENTS.length];
      const d = Math.max(0, wide ? last - centers[0] : last - vw / 2);
      layout.current = { centers, widths: kids.map((c) => c.offsetWidth), zone: centers[0], vw, wide };
      distance.set(d);
      setHeight(window.innerHeight + d);
      pick(-rail.get() * d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
    };
  }, [distance, rail]);

  return (
    <section id="agentlar" ref={section} className="relative scroll-mt-0" style={height ? { height } : undefined}>
      <div className="relative overflow-hidden py-24 motion-safe:sticky motion-safe:top-0 motion-safe:flex motion-safe:h-svh motion-safe:flex-col motion-safe:justify-center motion-safe:py-0">
        <m.div aria-hidden style={reduce ? undefined : { clipPath }} className="absolute inset-0 bg-[#0f2031]">
          <Aurora dark />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(156_195_220/0.16),transparent_60%)]" />

          <div className="pointer-events-none absolute inset-0 motion-reduce:hidden">
            <m.div style={{ x: stageX, opacity: stageOpacity }} className="absolute top-1/2 left-1/2 aspect-video w-[150vw] -translate-x-1/2 -translate-y-1/2 sm:w-[110vw] lg:w-[min(62vw,58rem)]">
              {ART.map(([, , rgb], i) => (
                <div
                  key={rgb + i}
                  data-state={i === active ? "on" : i < active ? "past" : "next"}
                  className="stage-glow absolute -inset-[30%] rounded-full"
                  style={{ background: `radial-gradient(closest-side, rgb(${rgb} / 0.3), rgb(31 51 71 / 0.45) 45%, transparent 100%)` }}
                />
              ))}
              <div className="absolute inset-[6%] animate-[spin_90s_linear_infinite] rounded-full border border-dashed border-[#9cc3dc]/15" />
              <div className="absolute inset-[16%] animate-[spin_60s_linear_infinite_reverse] rounded-full border border-[#8bc474]/10" />
              {ART.map(([file], i) => (
                <div key={file} data-state={i === active ? "on" : i < active ? "past" : "next"} className="stage-art absolute inset-0">
                  <Image src={`/landing/${file}.webp`} alt="" fill sizes="(min-width: 1024px) 58rem, (min-width: 640px) 110vw, 150vw" className="object-cover" />
                </div>
              ))}
              <div className="absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_30%,transparent_80%)]">
                <div key={active} className="stage-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#cfe3ef]/25 to-transparent" />
              </div>
              <m.div style={{ opacity: frame }} className="absolute inset-[13%_18%] hidden lg:block">
                <span className="absolute top-0 left-0 size-6 rounded-tl-md border-t border-l border-[#9cc3dc]/50" />
                <span className="absolute top-0 right-0 size-6 rounded-tr-md border-t border-r border-[#9cc3dc]/50" />
                <span className="absolute bottom-0 left-0 size-6 rounded-bl-md border-b border-l border-[#9cc3dc]/50" />
                <span className="absolute right-0 bottom-0 size-6 rounded-br-md border-r border-b border-[#9cc3dc]/50" />
              </m.div>
            </m.div>

            <m.div style={{ x: stageX }} className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2.5">
              <p className="font-mono text-[11px] tracking-[0.3em] text-[#9cc3dc]/80 uppercase">
                <span key={active} className="inline-block animate-rise">
                  0{active + 1} / 05 · {ART[active][1]}
                </span>
              </p>
              <span className="flex gap-1.5">
                {ART.map(([file], i) => (
                  <span key={file} className={`h-0.5 rounded-full transition-[width,background-color] duration-700 ${i === active ? "w-6 bg-[#9cc3dc]" : "w-2 bg-white/20"}`} />
                ))}
              </span>
            </m.div>
          </div>
        </m.div>

        <m.div
          ref={track}
          style={{ x }}
          className="relative mx-auto grid max-w-7xl gap-5 px-4 text-white sm:grid-cols-2 sm:px-6 lg:grid-cols-3 motion-safe:mx-0 motion-safe:flex motion-safe:w-max motion-safe:max-w-none motion-safe:items-stretch sm:motion-safe:px-[6vw]"
        >
          <m.div style={reduce ? undefined : { opacity: intro, x: introX }} className="flex flex-col justify-center motion-safe:w-[86vw] motion-safe:shrink-0 sm:motion-safe:w-[30rem] lg:motion-safe:mr-10">
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
          </m.div>

          {AGENTS.map((agent, i) => (
            <AgentCard key={agent[1]} agent={agent} index={i + 1} shift={x} layout={layout} />
          ))}

          <div className="hidden flex-col justify-center lg:motion-safe:ml-[max(2rem,calc(49vw-28.25rem))] lg:motion-safe:flex lg:motion-safe:w-[22rem] lg:motion-safe:shrink-0">
            <p className="font-mono text-[11px] tracking-[0.3em] text-[#9cc3dc] uppercase">05 / 05 · barchasi faol</p>
            <p className="mt-4 text-3xl font-bold tracking-tight text-balance">Agentlar tayyor. Navbat sizning ma&apos;lumotlaringizda.</p>
            <a
              href="#demo"
              className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0f2031] transition-colors hover:bg-[#e3f0f8]"
            >
              Demo so&apos;rash <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </m.div>
      </div>
    </section>
  );
}

function AgentCard({
  agent: [Icon, name, text, sample],
  index,
  shift,
  layout,
}: {
  agent: (typeof AGENTS)[number];
  index: number;
  shift: MotionValue<number>;
  layout: RefObject<Layout>;
}) {
  const shown = useTransform(shift, (v) => smooth(presence(layout.current, index, v)));
  const scale = useTransform(shown, [0, 1], [0.9, 1]);

  return (
    <SpotlightCard
      glow="rgba(139,196,116,0.2)"
      style={{ opacity: shown, scale }}
      className="glass-dark flex flex-col rounded-[1.25rem] p-7 backdrop-blur-[6px] transition-colors hover:border-[#9cc3dc]/40 sm:p-8 motion-safe:min-h-[min(30rem,72svh)] motion-safe:w-[80vw] motion-safe:shrink-0 sm:motion-safe:w-[24rem]"
    >
      <div className="relative flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[#9cc3dc]/30 to-[#4f86ab]/10 text-[#d6e8f3] shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] ring-1 ring-white/10">
          <Icon className="size-5" />
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
      <p className="relative mt-3 text-sm leading-relaxed text-white/75">{text}</p>
      <p className="relative mt-auto pt-8">
        <span className="block rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 font-mono text-xs leading-relaxed text-[#d6e8f3]">
          <span className="text-[#a6d48a]">›</span> {sample}
        </span>
      </p>
    </SpotlightCard>
  );
}
