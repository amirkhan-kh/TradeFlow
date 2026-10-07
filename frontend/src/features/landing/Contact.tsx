import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Aurora } from "@/shared/ui/Aurora";
import { Reveal } from "@/shared/ui/motion";
import { DemoForm } from "./DemoForm";

export function Contact() {
  return (
    <section id="demo" className="scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal y={40} className="grid overflow-hidden rounded-[2.5rem] bg-white shadow-[0_40px_100px_-30px_rgb(16_40_32/0.3)] ring-1 ring-ink-200/70 lg:grid-cols-2">
          <div className="relative overflow-hidden bg-[#0b1f17] p-8 text-white sm:p-12">
            <Aurora dark />
            <div className="relative">
              <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-brand-200">Bepul demo</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">Onlayn namoyishga yoziling</h2>
              <p className="mt-4 text-white/70">30 daqiqalik bepul namoyishda tizim imkoniyatlarini ko&apos;rsatamiz va biznesingizga mos yechimni taklif qilamiz.</p>
              <ul className="mt-10 space-y-3 text-sm">
                {[
                  [Phone, <a key="p" href="tel:+998555000305">+998 55 500 03 05</a>],
                  [Mail, <a key="m" href="mailto:info@tradeflow.uz">info@tradeflow.uz</a>],
                  [MapPin, "Toshkent sh., Yunusobod tumani"],
                  [Clock, "Du–Sha, 09:00–19:00"],
                ].map(([Icon, content], i) => {
                  const I = Icon as typeof Phone;
                  return (
                    <li key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur transition-colors hover:bg-white/[0.08]">
                      <I className="size-5 text-[#a6d48a]" /> {content as React.ReactNode}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="p-8 sm:p-12">
            <h3 className="mb-6 text-xl font-bold text-ink-900">Formani to&apos;ldiring</h3>
            <DemoForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
