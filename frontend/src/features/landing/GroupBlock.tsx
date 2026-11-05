"use client";

import { useScroll } from "motion/react";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { m } from "@/shared/ui/motion";
import { ZoomIn } from "./ZoomIn";

/**
 * Solutions group: sticky glass control panel whose meter fills while the group's cards scroll past.
 * `flip` puts the panel on the right, so consecutive groups zig-zag down the page.
 */
export function GroupBlock({ panel, image, flip = false, children }: { panel: ReactNode; image: string; flip?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });

  return (
    <div ref={ref} className={`grid gap-6 lg:gap-12 ${flip ? "lg:grid-cols-[1fr_18rem]" : "lg:grid-cols-[18rem_1fr]"}`}>
      <ZoomIn from={0.9} y={40} className={`lg:sticky lg:top-28 lg:self-start ${flip ? "lg:order-2" : ""}`}>
        <div className="glass group relative overflow-hidden rounded-2xl p-5 lg:p-6">
          <div aria-hidden className="absolute -top-20 -right-20 size-56 bg-[radial-gradient(closest-side,rgb(156_195_220/0.55),transparent)]" />
          <div aria-hidden className="absolute -bottom-24 -left-16 size-48 bg-[radial-gradient(closest-side,rgb(139_196_116/0.3),transparent)]" />
          <div aria-hidden className="relative mb-5 aspect-[21/9] overflow-hidden rounded-xl ring-1 ring-[#32536b]/15 lg:aspect-[4/3]">
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 18rem, 100vw" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2236]/55 via-[#32536b]/10 to-transparent" />
            <div className="absolute inset-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]" />
          </div>
          <div className="relative">{panel}</div>
          <div aria-hidden className="relative mt-6 hidden h-1 overflow-hidden rounded-full bg-ink-200/60 lg:block">
            <m.div className="h-full origin-left rounded-full bg-gradient-to-r from-[#32536b] via-[#4f86ab] to-brand-400" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </ZoomIn>
      {children}
    </div>
  );
}
