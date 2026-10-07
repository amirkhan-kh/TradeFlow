"use client";

import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
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
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  return (
    <>
      <ScrollProgress />
      <m.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 transition-all duration-500 sm:px-5 ${
            scrolled ? "h-14 border border-white/60 bg-white/70 shadow-lift backdrop-blur-xl" : "h-16 border border-transparent bg-transparent"
          }`}
        >
          <Logo />
          <nav aria-label="Asosiy" className="hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
            {NAV.map(([href, label]) => (
              <a key={href} href={href} onMouseEnter={() => setHovered(href)} className="relative rounded-xl px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900">
                {hovered === href && (
                  <m.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-xl bg-ink-900/[0.05]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ButtonLink href="#demo" variant="ghost" className="hidden sm:inline-flex">
              Demo so&apos;rash
            </ButtonLink>
            <Magnetic strength={0.15}>
              <ButtonLink href="/login" className="rounded-xl bg-ink-900 hover:bg-ink-800">
                Kirish
              </ButtonLink>
            </Magnetic>
            <button className="grid size-10 place-items-center rounded-xl border border-ink-200 bg-white/70 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menyu" aria-expanded={open}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <m.nav
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18 } }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mx-auto mt-2 flex max-w-7xl flex-col rounded-2xl border border-white/60 bg-white/90 p-2 shadow-lift backdrop-blur-xl lg:hidden"
            >
              {NAV.map(([href, label], i) => (
                <m.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3, ease: EASE }}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50"
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
