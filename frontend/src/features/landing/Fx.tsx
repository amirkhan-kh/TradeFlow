"use client";

import { useEffect, useRef } from "react";

type Variant = "mesh" | "grid" | "beams" | "lattice";

const BEAMS = [
  ["left-[8%]", "0s", "6s"],
  ["left-[23%]", "-2.5s", "8s"],
  ["left-[41%]", "-5s", "7s"],
  ["left-[58%]", "-1s", "9s"],
  ["left-[74%]", "-3.5s", "6.5s"],
  ["left-[90%]", "-6s", "8.5s"],
] as const;

const SHARDS = [
  ["top-[12%] left-[6%] size-20 rotate-12", "0s"],
  ["top-[30%] right-[8%] size-28 -rotate-6", "-2s"],
  ["bottom-[18%] left-[14%] size-14 rotate-45", "-4s"],
  ["bottom-[10%] right-[20%] size-16 -rotate-12", "-1s"],
] as const;

/**
 * Decorative, futuristic section backgrounds on the light page: soft colour glows that the glass
 * cards refract, plus one motif per variant. CSS transform/opacity only, paused while off-screen.
 */
export function Fx({ variant, side = "right" }: { variant: Variant; side?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = side === "left" ? "-left-[18%]" : "-right-[18%]";
  const far = side === "left" ? "-right-[22%]" : "-left-[22%]";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-on", e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="fx pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
      <div className={`absolute top-[8%] ${near} size-[44rem] bg-[radial-gradient(closest-side,rgb(139_196_116/0.22),transparent)] md:animate-drift`} />
      <div className={`absolute bottom-[4%] ${far} size-[40rem] bg-[radial-gradient(closest-side,rgb(79_134_171/0.2),transparent)] md:animate-drift [animation-delay:-14s]`} />

      {variant === "mesh" && (
        <>
          <div className="absolute top-1/3 left-1/2 size-[36rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(156_195_220/0.35),transparent)] md:animate-drift [animation-delay:-7s]" />
          {[
            ["left-[18%]", "0s"],
            ["left-[52%]", "-2s"],
            ["left-[80%]", "-4s"],
          ].map(([left, delay]) => (
            <span
              key={left}
              className={`absolute -top-[10%] h-[120%] w-24 rotate-[20deg] animate-breathe bg-gradient-to-b from-white/80 via-white/20 to-transparent ${left}`}
              style={{ animationDelay: delay }}
            />
          ))}
        </>
      )}

      {variant === "grid" && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-[60%] [perspective:600px] [mask-image:linear-gradient(to_top,black,transparent)]">
            <div className="absolute inset-x-[-50%] bottom-[-10%] h-[220%] origin-bottom animate-[grid-flow_6s_linear_infinite] bg-[linear-gradient(rgb(50_83_107/0.1)_1px,transparent_1px),linear-gradient(90deg,rgb(50_83_107/0.1)_1px,transparent_1px)] bg-[size:64px_64px] [transform:rotateX(72deg)]" />
          </div>
          <div className="absolute inset-0 animate-scan">
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#9cc3dc]/25 to-transparent" />
          </div>
          {SHARDS.map(([cls, delay]) => (
            <div key={cls} className={`absolute ${cls}`}>
              <div className="glass size-full animate-hover-y rounded-xl" style={{ animationDelay: delay }} />
            </div>
          ))}
        </>
      )}

      {variant === "beams" &&
        BEAMS.map(([left, delay, dur], i) => (
          <span
            key={left}
            className={`absolute -top-[20%] h-[20%] w-px animate-fall bg-gradient-to-b from-transparent to-transparent ${i % 2 ? "via-[#4f86ab]/45" : "via-brand-400/40"} ${left}`}
            style={{ animationDelay: delay, animationDuration: dur }}
          />
        ))}

      {variant === "lattice" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(rgb(50_83_107/0.2)_1px,transparent_1.5px)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]" />
          <div className="absolute inset-0 animate-scan [animation-duration:9s]">
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-white/70 to-transparent" />
          </div>
        </>
      )}
    </div>
  );
}
