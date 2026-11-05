import { ArrowUpRight } from "lucide-react";
import { Aurora } from "@/shared/ui/Aurora";
import { ButtonLink } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { Reveal } from "@/shared/ui/motion";
import { ZoomIn } from "./ZoomIn";

const COLS = [
  ["Mahsulot", [["#imkoniyatlar", "Imkoniyatlar"], ["#agentlar", "Aqlli agentlar"], ["#telegram", "Telegram bot"], ["/login", "Tizimga kirish"]]],
  ["Resurslar", [["#jarayon", "Ishga tushirish"], ["#demo", "Texnik yordam"], ["#demo", "Video darslar"], ["#demo", "Hujjatlar"]]],
  ["Kompaniya", [["#demo", "Biz haqimizda"], ["#demo", "Rekvizitlar"], ["#demo", "Karyera"], ["#demo", "Kontaktlar"]]],
] as const;

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-[#0c1826] text-white sm:rounded-t-[3.5rem]">
      <Aurora dark interactive={false} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-14 sm:flex-row sm:items-center">
          <p className="max-w-xl text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Ombordan savdo nuqtasigacha — <span className="text-aurora-dark">to&apos;liq nazorat</span> bugundan.
          </p>
          <ButtonLink href="/login" size="lg" variant="secondary" className="ring-beam group rounded-full! border-white">
            Boshlash
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
          </ButtonLink>
        </Reveal>

        <div className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm text-white/65">Distribyutsiya, ombor, audit va yetkazib berish uchun yagona boshqaruv platformasi.</p>
          </div>
          {COLS.map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <p className="text-sm font-bold text-white">{title}</p>
              <ul className="mt-3 space-y-2">
                {links.map(([href, label]) => (
                  <li key={label}>
                    <a href={href} className="inline-block text-sm text-white/65 transition hover:translate-x-0.5 hover:text-[#9cc3dc]">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <ZoomIn from={0.7} y={120} end="end end" className="pointer-events-none relative mx-auto max-w-7xl px-4 select-none sm:px-6">
        <p
          aria-hidden
          className="bg-gradient-to-b from-white/30 via-[#9cc3dc]/15 to-transparent bg-clip-text pb-[0.06em] text-center text-[18vw] leading-[0.8] font-extrabold tracking-[-0.06em] text-transparent lg:text-[13rem]"
        >
          TradeFlow
        </p>
      </ZoomIn>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/60">© {new Date().getFullYear()} TradeFlow. Barcha huquqlar himoyalangan.</div>
    </footer>
  );
}
