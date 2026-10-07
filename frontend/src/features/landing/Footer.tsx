import { Logo } from "@/shared/ui/Logo";
import { Reveal } from "@/shared/ui/motion";

const COLS = [
  ["Mahsulot", [["#imkoniyatlar", "Imkoniyatlar"], ["#agentlar", "Aqlli agentlar"], ["#telegram", "Telegram bot"], ["/login", "Tizimga kirish"]]],
  ["Resurslar", [["#jarayon", "Ishga tushirish"], ["#demo", "Texnik yordam"], ["#demo", "Video darslar"], ["#demo", "Hujjatlar"]]],
  ["Kompaniya", [["#demo", "Biz haqimizda"], ["#demo", "Rekvizitlar"], ["#demo", "Karyera"], ["#demo", "Kontaktlar"]]],
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-500">Distribyutsiya, ombor, audit va yetkazib berish uchun yagona boshqaruv platformasi.</p>
        </div>
        {COLS.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <p className="text-sm font-bold text-ink-900">{title}</p>
            <ul className="mt-3 space-y-2">
              {links.map(([href, label]) => (
                <li key={label}>
                  <a href={href} className="inline-block text-sm text-ink-500 transition hover:translate-x-0.5 hover:text-brand-700">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <Reveal y={60} className="pointer-events-none mx-auto max-w-7xl px-4 select-none sm:px-6">
        <p aria-hidden className="bg-gradient-to-b from-ink-200/80 to-transparent bg-clip-text text-center text-[18vw] leading-[0.8] font-extrabold tracking-[-0.06em] text-transparent lg:text-[13rem]">
          TradeFlow
        </p>
      </Reveal>
      <div className="relative border-t border-ink-100 py-5 text-center text-xs text-ink-500">© {new Date().getFullYear()} TradeFlow. Barcha huquqlar himoyalangan.</div>
    </footer>
  );
}
