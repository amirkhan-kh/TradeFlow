"use client";

import { useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { m } from "./motion";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const BLOBS = [
  { cls: "left-[-10%] top-[-20%] size-[46rem] bg-[#8bc474]/35", x: [0, 80, -40, 0], y: [0, 60, 20, 0], d: 22 },
  { cls: "right-[-15%] top-[-10%] size-[42rem] bg-[#32536b]/25", x: [0, -60, 30, 0], y: [0, 40, -30, 0], d: 26 },
  { cls: "left-[30%] bottom-[-35%] size-[38rem] bg-brand-300/35", x: [0, 50, -60, 0], y: [0, -40, 10, 0], d: 30 },
];

/** Ambient background: drifting gradient blobs + film grain + cursor light. */
export function Aurora({ dark = false, interactive = true }: { dark?: boolean; interactive?: boolean }) {
  const mx = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(30), { stiffness: 60, damping: 20 });
  const light = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, ${dark ? "rgba(139,196,116,0.14)" : "rgba(255,255,255,0.75)"}, transparent 60%)`;

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      onPointerMove={
        interactive
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set(((e.clientX - r.left) / r.width) * 100);
              my.set(((e.clientY - r.top) / r.height) * 100);
            }
          : undefined
      }
    >
      {BLOBS.map((b, i) => (
        <m.div
          key={i}
          className={`absolute rounded-full blur-[110px] ${b.cls} ${dark ? "opacity-60 mix-blend-screen" : ""}`}
          animate={{ x: b.x, y: b.y }}
          transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {interactive && <m.div className="absolute inset-0" style={{ background: light }} />}
      <div className={`absolute inset-0 ${dark ? "opacity-[0.07]" : "opacity-[0.045]"} mix-blend-overlay`} style={{ backgroundImage: NOISE }} />
    </div>
  );
}
