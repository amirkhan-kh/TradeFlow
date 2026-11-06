import { ArrowDownToLine, ArrowUpFromLine, CheckCircle2, Plus, RefreshCw } from "lucide-react";
import { useT } from "@/shared/i18n/I18nProvider";
import type { MsgKey } from "@/shared/i18n/messages";
import { brandOf, ProviderLogo } from "./ProviderLogo";
import type { ProviderInfo } from "./types";

function capabilities(p: ProviderInfo) {
  return [
    p.endpoints.length > 0 && { icon: ArrowDownToLine, label: "Qabul qiladi" },
    p.events.length > 0 && { icon: ArrowUpFromLine, label: "Yuboradi" },
    p.can_sync && { icon: RefreshCw, label: "Sinxron" },
  ].filter(Boolean) as { icon: typeof Plus; label: MsgKey }[];
}

export function CatalogCard({ provider: p, connected, onConnect, index }: { provider: ProviderInfo; connected: number; onConnect: () => void; index: number }) {
  const t = useT();
  const color = brandOf(p.key).color;
  return (
    <article
      className="group card relative flex animate-rise flex-col overflow-hidden p-5 transition duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-1 hover:shadow-[0_22px_44px_-20px_var(--accent)]"
      style={{ "--accent": color, animationDelay: `${Math.min(index, 8) * 35}ms` } as React.CSSProperties}
    >
      <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: color }} aria-hidden />
      <span className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" style={{ background: color }} aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div className="transition-transform duration-200 group-hover:scale-105">
          <ProviderLogo provider={p.key} name={p.name} />
        </div>
        {connected > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-200">
            <CheckCircle2 className="size-3.5" /> {t("Ulangan")}
            {connected > 1 ? ` × ${connected}` : ""}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-bold text-ink-900">{p.name}</h3>
      {p.vendors && <p className="mt-0.5 truncate text-xs text-ink-500">{p.vendors}</p>}
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-600">{p.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {capabilities(p).map((c) => (
          <span key={c.label} className="inline-flex items-center gap-1 rounded-lg bg-ink-50 px-2 py-1 text-[11px] font-semibold text-ink-600 ring-1 ring-ink-200/70">
            <c.icon className="size-3" aria-hidden /> {t(c.label)}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onConnect}
        className={`mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition active:scale-[0.98] ${
          connected ? "border border-ink-200 bg-white text-ink-800 hover:border-brand-300 hover:bg-brand-50" : "bg-ink-900 text-white hover:bg-brand-700"
        }`}
        aria-label={connected ? t("{name} — yana ulash", { name: p.name }) : t("{name} — ulash", { name: p.name })}
      >
        <Plus className="size-4 transition-transform duration-200 group-hover:rotate-90" /> {connected ? t("Yana ulash") : t("Ulash")}
      </button>
    </article>
  );
}
