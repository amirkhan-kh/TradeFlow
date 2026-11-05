"use client";

import { useSpring, useTransform, type MotionValue } from "motion/react";
import { BadgeCheck, Bot, ShieldCheck, TrendingUp, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/shared/ui/Logo";
import { CountUp, m } from "@/shared/ui/motion";

const AREA = "M0 62 C 24 56, 40 60, 62 46 S 104 30, 128 36 S 176 14, 200 10";

const ORDERS = [
  ["TF-001248", "Baraka Market", "Yangi", "bg-[#32536b]/10 text-[#32536b]"],
  ["TF-001247", "Anor Savdo", "Yo'lda", "bg-sky-100 text-sky-800"],
  ["TF-001246", "Oila Market", "Yetkazildi", "bg-brand-50 text-brand-700"],
] as const;

function Chip({ className, y, z, delay, children }: { className: string; y: MotionValue<number>; z: MotionValue<number>; delay: number; children: ReactNode }) {
  return (
    <m.div style={{ y, z }} className={`absolute ${className}`}>
      <div className="glass animate-pop rounded-xl px-3.5 py-3 sm:px-4" style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </m.div>
  );
}

/**
 * Glass "control console": a dashboard pane, an orders pane and live-data cards stacked in depth.
 * Pointer tilts the stack; scrolling turns it towards the viewer and pulls the layers apart.
 * Continuous motion is CSS (compositor only); tilt, depth and parallax are motion values.
 */
export function HeroScene({ progress }: { progress: MotionValue<number> }) {
  const rx = useSpring(0, { stiffness: 80, damping: 18 });
  const ry = useSpring(0, { stiffness: 80, damping: 18 });
  const rotateX = useTransform(() => 10 - progress.get() * 6 + rx.get());
  const rotateY = useTransform(() => -16 + progress.get() * 16 + ry.get());
  const back = useTransform(progress, [0, 1], [-40, -160]);
  const mid = useTransform(progress, [0, 1], [30, 60]);
  const front = useTransform(progress, [0, 1], [90, 240]);
  const near = useTransform(progress, [0, 1], [0, -110]);
  const far = useTransform(progress, [0, 1], [0, -45]);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[34rem] [perspective:1400px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <div aria-hidden className="absolute inset-[6%] bg-[radial-gradient(closest-side,rgb(156_195_220/0.7),rgb(139_196_116/0.25)_60%,transparent)]" />

      <m.div style={{ rotateX, rotateY }} className="absolute inset-0 [transform-style:preserve-3d]">
        <m.div style={{ z: back }} className="glass absolute inset-x-[4%] top-[14%] bottom-[24%] overflow-hidden rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-ink-300" />
            <span className="size-2 rounded-full bg-ink-300" />
            <span className="size-2 rounded-full bg-ink-300" />
            <span className="ml-2 text-[11px] font-medium text-ink-600">Jonli dashboard</span>
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-ink-700">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-brand-500" />
              </span>
              LIVE
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-ink-600">Oylik tushum</p>
              <p className="flex items-baseline gap-1.5 text-xl font-extrabold text-ink-900">
                361 mln
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-brand-700">
                  <TrendingUp className="size-3" /> 18%
                </span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-ink-600">Faol buyurtmalar</p>
              <p className="text-xl font-extrabold text-ink-900">1 248</p>
            </div>
          </div>
          <svg viewBox="0 0 200 72" preserveAspectRatio="none" className="mt-3 h-[38%] w-full" aria-hidden>
            <defs>
              <linearGradient id="hs-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#4f86ab" stopOpacity=".35" />
                <stop offset="1" stopColor="#4f86ab" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hs-line" x1="0" x2="1">
                <stop offset="0" stopColor="#32536b" />
                <stop offset=".7" stopColor="#4f86ab" />
                <stop offset="1" stopColor="#3dae7f" />
              </linearGradient>
            </defs>
            <path d={`${AREA} L200 72 L0 72Z`} fill="url(#hs-fill)" />
            <path d={AREA} fill="none" stroke="url(#hs-line)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 animate-[shine_5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </m.div>

        <m.div style={{ z: mid }} className="glass absolute right-0 bottom-[6%] w-[70%] rounded-xl p-3.5 sm:w-[64%] sm:p-4">
          <p className="flex items-center justify-between text-xs font-bold text-ink-900">
            Buyurtmalar oqimi <span className="text-[10px] font-medium text-ink-600">bugun</span>
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {ORDERS.map(([id, client, status, tone]) => (
              <li key={id} className="flex items-center gap-2 rounded-xl bg-white/70 px-2.5 py-1.5 text-[11px]">
                <span className="font-mono font-semibold whitespace-nowrap text-ink-700">{id}</span>
                <span className="hidden truncate text-ink-600 sm:inline">{client}</span>
                <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${tone}`}>{status}</span>
              </li>
            ))}
          </ul>
        </m.div>

        <m.div style={{ z: front }} className="absolute top-[3%] left-[8%] animate-hover-y">
          <div className="ring-beam grid size-16 place-items-center rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 to-white/50 shadow-[0_24px_50px_-16px_rgb(15_34_54/0.45),inset_0_1px_0_white] backdrop-blur-md sm:size-20">
            <LogoMark className="size-[58%]" />
          </div>
        </m.div>
      </m.div>

      <Chip y={near} z={mid} delay={0.45} className="top-[4%] right-[3%]">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[#32536b] text-white">
            <BadgeCheck className="size-5" />
          </span>
          <div>
            <p className="text-xs text-ink-600">Audit AU-00031</p>
            <p className="text-sm font-bold text-ink-900">Tasdiqlandi</p>
          </div>
        </div>
      </Chip>

      <Chip y={far} z={mid} delay={0.6} className="top-[52%] -left-2 hidden sm:block">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-[#32536b]">
          <Bot className="size-3.5" /> Ombor agenti
        </p>
        <p className="mt-1 max-w-[11rem] text-xs leading-snug text-ink-700">Coca-Cola 1.5L — 3 kunlik zaxira qoldi</p>
      </Chip>

      <Chip y={near} z={mid} delay={0.75} className="bottom-0 left-[2%] hidden sm:block">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white">
            <Truck className="size-5" />
          </span>
          <div>
            <p className="text-xs text-ink-600">O&apos;z vaqtida yetkazish</p>
            <p className="text-sm font-bold text-ink-900">
              <CountUp to={98.4} decimals={1} suffix="%" />
            </p>
          </div>
        </div>
      </Chip>

      <div
        className="glass animate-pop absolute -bottom-10 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-ink-700 lg:flex"
        style={{ animationDelay: "0.85s" }}
      >
        <ShieldCheck className="size-4 text-[#32536b]" /> Ma&apos;lumotlar shifrlangan
      </div>
    </div>
  );
}
