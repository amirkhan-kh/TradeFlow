"use client";

import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { EASE, m, Magnetic, ScrollProgress } from "@/shared/ui/motion";

const NAV = [
  ["#imkoniyatlar", "Imkoniyatlar"],
  ["#agentlar", "Aqlli agentlar"],
  ["#jarayon", "Qanday ishlaymiz"],
  ["#telegram", "Telegram bot"],
  ["#demo", "Bog'lanish"],
];

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(v > 12);
    setHidden(!open && v > 480 && v > prev + 2);
    if (v < prev - 2) setHidden(false);
  });

  return (
    <>
      <ScrollProgress />
      <m.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? -96 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-[1.4rem] px-3 pl-4 transition-[height,background-color,box-shadow,border-color] duration-500 sm:pl-5 ${
            scrolled ? "glass h-14" : "h-16 border border-white/50 bg-white/30 backdrop-blur-md"
          }`}
        >
          <Logo />
          <nav aria-label="Asosiy" className="hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
            {NAV.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onMouseEnter={() => setHovered(href)}
                onFocus={() => setHovered(href)}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
              >
                {hovered === href && (
                  <m.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/80 shadow-[inset_0_1px_0_white,0_6px_16px_-8px_rgb(15_34_54/0.25)] ring-1 ring-ink-900/5"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ButtonLink href="#demo" variant="ghost" className="rounded-full! hover:bg-white/70 max-sm:hidden!">
              Demo so&apos;rash
            </ButtonLink>
            <Magnetic strength={0.15}>
              <ButtonLink href="/login" className="ring-beam group rounded-full! bg-[#16283a]! pr-3! hover:bg-[#1d3a52]!">
                Kirish
                <span className="grid size-6 place-items-center rounded-full bg-white/10 transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </ButtonLink>
            </Magnetic>
            <button
              className="grid size-10 place-items-center rounded-full border border-white/70 bg-white/70 backdrop-blur lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menyu"
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <m.nav
              aria-label="Mobil menyu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18 } }}
              transition={{ duration: 0.3, ease: EASE }}
              className="glass mx-auto mt-2 flex max-w-7xl flex-col rounded-[1.4rem] p-2 lg:hidden"
            >
              {NAV.map(([href, label], i) => (
                <m.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3, ease: EASE }}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-ink-700 hover:bg-white/80"
                >
                  {label}
                </m.a>
              ))}
            </m.nav>
          )}
        </AnimatePresence>
      </m.header>
    </>
  );
}
