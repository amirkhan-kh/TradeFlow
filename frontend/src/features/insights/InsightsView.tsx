"use client";

import { ArrowUpRight, ClipboardCheck, HandCoins, RefreshCw, Route, TrendingUp, Warehouse } from "lucide-react";
import Link from "next/link";
import { fmtDate, fmtMoney } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { Button } from "@/shared/ui/Button";
import { PageHeader } from "@/shared/ui/Page";
import { ErrorState, Skeleton } from "@/shared/ui/States";
import type { InsightAgent, InsightsData, Severity } from "./types";

const ICONS: Record<InsightAgent["key"], typeof Warehouse> = {
  stock: Warehouse,
  finance: HandCoins,
  audit: ClipboardCheck,
  sales: TrendingUp,
  logistics: Route,
};

const SEV: Record<Severity, { label: string; cls: string; bar: string }> = {
  high: { label: "Muhim", cls: "bg-red-50 text-red-700 ring-red-200", bar: "bg-red-500" },
  medium: { label: "O'rta", cls: "bg-amber-50 text-amber-700 ring-amber-200", bar: "bg-amber-400" },
  low: { label: "Ma'lumot", cls: "bg-sky-50 text-sky-700 ring-sky-200", bar: "bg-sky-400" },
};

export function InsightsView() {
  const { data, error, loading, reload } = useApi<InsightsData>("/insights");
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const all = data?.agents.flatMap((a) => a.findings) ?? [];
  const count = (s: Severity) => all.filter((f) => f.severity === s).length;

  return (
    <div className="animate-rise">
      <PageHeader
        title="Aqlli agentlar"
        description="Avtomatik tahlilchilar ombor, moliya, audit, sotuv va logistika ma'lumotlarini doimiy kuzatadi"
        actions={
          <Button variant="secondary" onClick={reload} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Qayta tahlil
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white sm:col-span-2 lg:col-span-1">
          <p className="text-sm text-brand-100">Keyingi oy tushum prognozi</p>
          <p className="mt-2 text-2xl font-extrabold">{data ? fmtMoney(data.forecast_next_month) : "…"}</p>
          <p className="mt-1 text-xs text-brand-200">{data && `Tahlil: ${fmtDate(data.generated_at, true)}`}</p>
        </div>
        {(["high", "medium", "low"] as Severity[]).map((s) => (
          <div key={s} className="card p-5">
            <p className="text-sm text-ink-500">{SEV[s].label} signallar</p>
            <p className="mt-2 text-2xl font-extrabold text-ink-900">{data ? count(s) : "…"}</p>
            <div className={`mt-3 h-1.5 w-12 rounded-full ${SEV[s].bar}`} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {loading && !data
          ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-72" />)
          : data?.agents.map((a) => {
              const Icon = ICONS[a.key];
              return (
                <section key={a.key} className="card overflow-hidden">
                  <header className="flex items-center gap-3 border-b border-ink-100 bg-gradient-to-r from-brand-50/80 to-white px-5 py-4">
                    <span className="relative grid size-11 place-items-center rounded-xl bg-brand-600 text-white">
                      <Icon className="size-5" />
                      <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-brand-400" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-bold text-ink-900">{a.name}</h2>
                      <p className="truncate text-xs text-ink-500">{a.role}</p>
                    </div>
                    <span className="ml-auto rounded-full bg-white px-2.5 py-1 text-xs font-bold text-ink-700 ring-1 ring-ink-200">{a.findings.length}</span>
                  </header>
                  {a.findings.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-ink-500">✓ Hammasi joyida — muammo topilmadi</p>
                  ) : (
                    <ul className="divide-y divide-ink-100">
                      {a.findings.map((f, i) => (
                        <li key={i}>
                          <Link href={f.href} className="group flex gap-3 px-5 py-3.5 transition hover:bg-ink-50/70">
                            <span className={`mt-1.5 h-8 w-1 shrink-0 rounded-full ${SEV[f.severity].bar}`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start gap-2">
                                <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{f.title}</p>
                                <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${SEV[f.severity].cls}`}>
                                  {SEV[f.severity].label}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{f.detail}</p>
                            </div>
                            <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink-300 group-hover:text-brand-600" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
      </div>
    </div>
  );
}
