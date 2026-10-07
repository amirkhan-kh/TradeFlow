"use client";

import {
  animate,
  domMax,
  LazyMotion,
  m,
  MotionConfig,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Signature easing: fast start, long soft landing. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: EASE }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article" | "section";
}) {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

const group = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const child = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

export function Stagger({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" | "dl" }) {
  const Tag = m[as];
  return (
    <Tag className={className} variants={group} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const Tag = m[as];
  return (
    <Tag className={className} variants={child}>
      {children}
    </Tag>
  );
}

/** Card with cursor-following glow and gentle 3D tilt. */
export function SpotlightCard({ children, className = "", tilt = true, glow = "rgba(139,196,116,0.22)" }: { children: ReactNode; className?: string; tilt?: boolean; glow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const bg = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, ${glow}, transparent 70%)`;

  return (
    <m.div
      ref={ref}
      className={`group relative ${className}`}
      style={tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        x.set(px);
        y.set(py);
        if (tilt) {
          ry.set((px / r.width - 0.5) * 6);
          rx.set(-(py / r.height - 0.5) * 6);
        }
      }}
      onPointerLeave={() => {
        x.set(-200);
        y.set(-200);
        rx.set(0);
        ry.set(0);
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <m.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: bg }} />
      {children}
    </m.div>
  );
}

/** Pulls toward the cursor a few pixels — for primary CTAs. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  return (
    <m.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </m.div>
  );
}

export function CountUp({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: setValue });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Headline that rises word by word. */
export function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <m.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}
            {"\u00a0"}
          </m.span>
        </span>
      ))}
    </span>
  );
}

export function Marquee({ children, speed = 40 }: { children: ReactNode; speed?: number }) {
  return (
    <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      {[0, 1].map((k) => (
        <m.div
          key={k}
          aria-hidden={k === 1}
          className="flex shrink-0 items-center gap-3 pr-3"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        >
          {children}
        </m.div>
      ))}
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <m.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[#32536b] via-brand-500 to-[#8bc474]" style={{ scaleX }} />;
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [0, distance]);
}

export { m };
