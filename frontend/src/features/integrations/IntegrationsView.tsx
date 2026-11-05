"use client";

import {
  ChartColumn,
  CheckCircle2,
  CreditCard,
  Factory,
  FileCheck,
  Handshake,
  MessageCircle,
  MessageSquareText,
  Network,
  Phone,
  Plug,
  SearchX,
  Send,
  Store,
  TriangleAlert,
  UtensilsCrossed,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { api } from "@/shared/lib/api";
import { useApi } from "@/shared/lib/useApi";
import { Modal } from "@/shared/ui/Modal";
import { Chips, SearchInput } from "@/shared/ui/Page";
import { Empty, ErrorState, Skeleton } from "@/shared/ui/States";
import { CatalogCard } from "./CatalogCard";
import { ConnectedCard, type ActionResult } from "./ConnectedCard";
import { IntegrationForm } from "./IntegrationForm";
import { IntegrationPanel } from "./IntegrationPanel";
import { ProviderLogo } from "./ProviderLogo";
import { CATEGORIES, type Catalog, type Category, type Integration, type ProviderInfo } from "./types";

const ICONS: Record<Category, LucideIcon> = {
  payments: CreditCard,
  einvoice: FileCheck,
  marketplace: Store,
  erp: Factory,
  bi: ChartColumn,
  crm: Handshake,
  distribution: Network,
  pos: UtensilsCrossed,
  telephony: Phone,
  messenger: MessageCircle,
  sms: MessageSquareText,
  automation: Webhook,
};

const HERO_LOGOS = [
  ["payme", "Payme"],
  ["onec", "1C"],
  ["click", "Click"],
  ["didox", "Didox"],
  ["uzum_market", "Uzum Market"],
  ["bitrix24", "Bitrix24"],
] as const;

type Filter = "all" | "connected" | Category;

function HeroStat({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
      <p className="flex items-center gap-1.5 text-xs font-medium text-white/70">
        <Icon className={`size-3.5 ${tone}`} aria-hidden /> {label}
      </p>
      <p className="mt-0.5 text-2xl font-extrabold text-white tabular-nums">{value}</p>
    </div>
  );
}

export function IntegrationsView() {
  const catalog = useApi<Catalog>("/integrations/providers");
  const list = useApi<{ items: Integration[] }>("/integrations");
  const [connecting, setConnecting] = useState<ProviderInfo | null>(null);
  const [editing, setEditing] = useState<Integration | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const events = catalog.data?.events ?? {};
  const items = useMemo(() => list.data?.items ?? [], [list.data]);
  const providers = useMemo(() => catalog.data?.providers ?? [], [catalog.data]);
  const opened = items.find((i) => i.id === openId) ?? null;

  const needle = q.trim().toLowerCase();
  const matches = (p: ProviderInfo) => !needle || [p.name, p.vendors, p.description, CATEGORIES[p.category]].some((s) => s?.toLowerCase().includes(needle));
  const shownConnected = items.filter((i) => (filter === "all" || filter === "connected" || i.provider_info.category === filter) && matches(i.provider_info));
  const grouped = (Object.keys(CATEGORIES) as Category[])
    .filter((c) => filter === "all" || filter === c)
    .map((c) => ({ category: c, providers: providers.filter((p) => p.category === c && matches(p)) }))
    .filter((g) => g.providers.length);

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: providers.length, connected: items.length };
    for (const p of providers) out[p.category] = (out[p.category] ?? 0) + 1;
    return out;
  }, [providers, items]);
  const chipOptions: { value: Filter; label: string }[] = [
    { value: "all", label: "Barchasi" },
    { value: "connected", label: "Ulangan" },
    ...(Object.keys(CATEGORIES) as Category[]).filter((c) => counts[c]).map((c) => ({ value: c, label: CATEGORIES[c] })),
  ];

  async function action(i: Integration, kind: "test" | "sync") {
    setBusy(i.id);
    setResult(null);
    try {
      const r = await api<{ ok: boolean; message: string }>(`/integrations/${i.id}/${kind}`, { method: "POST" });
      setResult({ id: i.id, ...r });
    } catch (err) {
      setResult({ id: i.id, ok: false, message: (err as Error).message });
    } finally {
      setBusy(null);
      list.reload();
    }
  }

  async function remove(i: Integration) {
    if (!confirm(`“${i.name}” integratsiyasi va uning jurnali o'chirilsinmi?`)) return;
    await api(`/integrations/${i.id}`, { method: "DELETE" });
    list.reload();
  }

  const error = catalog.error ?? list.error;
  const nothingFound = needle && !shownConnected.length && !grouped.length;

  return (
    <div className="animate-rise">
      <header className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-navy-900 p-6 sm:p-8">
        <span className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-brand-400/25 blur-3xl" aria-hidden />
        <span className="pointer-events-none absolute -right-10 -bottom-28 size-80 rounded-full bg-sky-400/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/15">
              <Plug className="size-3.5" aria-hidden /> {providers.length || "…"} ta platforma
            </p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Integratsiyalar markazi</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
              To&apos;lovlar, e-faktura, marketpleys, 1C/ERP, CRM va telefoniyani bir joydan ulang — ma&apos;lumot avtomatik almashinadi.
            </p>
            <div className="mt-5 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
              <HeroStat icon={Plug} label="Ulangan" value={items.length} tone="text-brand-200" />
              <HeroStat icon={CheckCircle2} label="Faol" value={items.filter((i) => i.active && !i.last_error).length} tone="text-brand-300" />
              <HeroStat icon={TriangleAlert} label="Xato" value={items.filter((i) => i.last_error || i.failed_jobs).length} tone="text-red-300" />
              <HeroStat icon={Send} label="Bugun" value={items.reduce((s, i) => s + i.sent_today, 0)} tone="text-sky-300" />
            </div>
          </div>
          <div className="hidden grid-cols-3 gap-3 lg:grid" aria-hidden>
            {HERO_LOGOS.map(([key, name], n) => (
              <div key={key} className="animate-float rounded-2xl bg-white/95 p-1 shadow-lift" style={{ animationDelay: `${n * 0.6}s` }}>
                <ProviderLogo provider={key} name={name} size="lg" />
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <Chips options={chipOptions} value={filter} onChange={setFilter} counts={counts} />
        <SearchInput value={q} onChange={setQ} placeholder="Platforma qidirish…" />
      </div>

      {error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            catalog.reload();
            list.reload();
          }}
        />
      ) : !catalog.data || !list.data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : nothingFound ? (
        <div className="card">
          <Empty title="Hech narsa topilmadi" hint={`“${q}” bo'yicha platforma yo'q — boshqa so'z bilan qidiring`} />
        </div>
      ) : (
        <>
          {(filter === "connected" || shownConnected.length > 0) && (
            <section aria-labelledby="connected" className="mb-10">
              <h2 id="connected" className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-800">
                <span className="grid size-7 place-items-center rounded-lg bg-brand-100 text-brand-700">
                  <CheckCircle2 className="size-4" aria-hidden />
                </span>
                Ulangan <span className="font-semibold text-ink-500">{shownConnected.length}</span>
              </h2>
              {!shownConnected.length ? (
                <div className="card flex flex-col items-center gap-2 p-10 text-center">
                  <SearchX className="size-8 text-ink-300" aria-hidden />
                  <p className="font-semibold text-ink-800">Hali integratsiya ulanmagan</p>
                  <p className="text-sm text-ink-500">“Barchasi” bo&apos;limidan platformani tanlab, “Ulash” tugmasini bosing.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {shownConnected.map((i) => (
                    <ConnectedCard
                      key={i.id}
                      integration={i}
                      busy={busy === i.id}
                      result={result?.id === i.id ? result : null}
                      onAction={(kind) => action(i, kind)}
                      onOpen={() => setOpenId(i.id)}
                      onEdit={() => setEditing(i)}
                      onRemove={() => remove(i)}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {filter !== "connected" &&
            grouped.map((g) => {
              const Icon = ICONS[g.category];
              return (
                <section key={g.category} aria-labelledby={`cat-${g.category}`} className="mb-10">
                  <h2 id={`cat-${g.category}`} className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-800">
                    <span className="grid size-7 place-items-center rounded-lg bg-white text-ink-600 shadow-soft ring-1 ring-ink-200/70">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    {CATEGORIES[g.category]} <span className="font-semibold text-ink-500">{g.providers.length}</span>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {g.providers.map((p, n) => (
                      <CatalogCard key={p.key} provider={p} index={n} connected={items.filter((i) => i.provider === p.key).length} onConnect={() => setConnecting(p)} />
                    ))}
                  </div>
                </section>
              );
            })}
        </>
      )}

      <Modal open={connecting !== null} onClose={() => setConnecting(null)} title={`${connecting?.name ?? ""} — ulash`} wide>
        {connecting && (
          <IntegrationForm
            provider={connecting}
            eventLabels={events}
            onDone={() => {
              setConnecting(null);
              setFilter("connected");
              list.reload();
            }}
          />
        )}
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={`${editing?.name ?? ""} — sozlash`} wide>
        {editing && (
          <IntegrationForm
            provider={editing.provider_info}
            eventLabels={events}
            initial={editing}
            onDone={() => {
              setEditing(null);
              list.reload();
            }}
          />
        )}
      </Modal>

      <Modal open={opened !== null} onClose={() => setOpenId(null)} title={opened?.name ?? ""} description={opened?.provider_info.name} wide>
        {opened && <IntegrationPanel integration={opened} eventLabels={events} onChanged={list.reload} />}
      </Modal>
    </div>
  );
}
