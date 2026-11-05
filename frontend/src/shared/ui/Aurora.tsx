"use client";

import { useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { m } from "./motion";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Soft blobs are radial gradients (no blur filter) drifting on CSS animations, so they cost no main-thread time. */
const BLOBS = [
  "left-[-18%] top-[-30%] size-[60rem] bg-[radial-gradient(closest-side,rgb(79_134_171/0.4),transparent)] [animation-duration:22s]",
  "right-[-22%] top-[-20%] size-[56rem] bg-[radial-gradient(closest-side,rgb(156_195_220/0.28),transparent)] [animation-duration:26s] [animation-delay:-8s]",
  "left-[22%] bottom-[-45%] size-[52rem] bg-[radial-gradient(closest-side,rgb(139_196_116/0.26),transparent)] [animation-duration:30s] [animation-delay:-16s]",
];

/** Ambient background: drifting gradient blobs + film grain + cursor light. */
export function Aurora({ dark = false, interactive = true }: { dark?: boolean; interactive?: boolean }) {
  const mx = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(30), { stiffness: 60, damping: 20 });
  const light = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, ${dark ? "rgba(156,195,220,0.14)" : "rgba(255,255,255,0.75)"}, transparent 60%)`;

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
      {BLOBS.map((cls, i) => (
        <div key={i} className={`animate-drift absolute ${cls} ${dark ? "opacity-60 mix-blend-screen" : ""}`} />
      ))}
      {interactive && <m.div className="absolute inset-0" style={{ background: light }} />}
      <div className={`absolute inset-0 ${dark ? "opacity-[0.07]" : "opacity-[0.045]"} mix-blend-overlay`} style={{ backgroundImage: NOISE }} />
    </div>
  );
}
