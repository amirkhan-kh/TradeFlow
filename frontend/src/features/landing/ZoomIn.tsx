"use client";

import { useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { m } from "@/shared/ui/motion";

/**
 * Grows its content from `from` to full size while its top edge travels from the bottom
 * of the viewport to 40% height (or `end`) — the "section zooms in as you scroll" effect.
 * Transform only, so it never triggers layout and contrast audits see full-opacity text.
 */
export function ZoomIn({
  children,
  className = "",
  from = 0.88,
  y = 60,
  end = "start 40%",
  tilt = 0,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  y?: number;
  /** Where the zoom completes: "start 70%" for cards, "end end" for content at the very bottom of the page. */
  end?: "start 40%" | "start 70%" | "end end";
  /** Degrees the box leans back (rotateX) before standing up, for cards rising out of the page. */
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", end] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const ty = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [tilt, 0]);

  return (
    <m.div
      ref={ref}
      className={className}
      style={reduce ? undefined : { scale, y: ty, transformOrigin: "50% 0%", ...(tilt ? { rotateX, transformPerspective: 1200 } : {}) }}
    >
      {children}
    </m.div>
  );
}

/** Scroll parallax: content travels `distance`px against the scroll while its box crosses the viewport. */
export function Drift({ children, className = "", distance = 40 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <m.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </m.div>
  );
}
