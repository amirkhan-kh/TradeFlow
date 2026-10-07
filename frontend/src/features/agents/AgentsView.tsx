"use client";

import { MapPin, Phone, Store, TrendingDown, TrendingUp } from "lucide-react";
import { fmtCompact, fmtMoney, pctChange } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { PageHeader, Table } from "@/shared/ui/Page";
import { ErrorState, Skeleton } from "@/shared/ui/States";

interface Agent {
  id: number;
  full_name: string;
  phone: string | null;
  region: string | null;
  monthly_plan: number;
  revenue_month: number;
  revenue_prev_month: number;
  orders_month: number;
  clients: number;
  active_clients: number;
  clients_debt: number;
  plan_pct: number | null;
}
interface Courier {
  id: number;
  full_name: string;
  phone: string | null;
  delivered_month: number;
  active: number;
  failed: number;
}

export function AgentsView() {
  const { data, error, loading, reload } = useApi<{ agents: Agent[]; couriers: Courier[] }>("/agents");
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const now = new Date();
  const expected = (now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) * 100;

  return (
    <div className="animate-rise space-y-6">
      <PageHeader title="Savdo jamoasi" description={`Oylik reja bajarilishi. Bugungi kutilgan sur'at: ${expected.toFixed(0)}%`} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && !data
          ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-60" />)
          : data?.agents.map((a, i) => {
              const pct = a.plan_pct ?? 0;
              const trend = pctChange(a.revenue_month, a.revenue_prev_month);
              const behind = pct < expected * 0.85;
              return (
                <article key={a.id} className="card p-5">
                  <div className="flex items-center gap-3">
                    <span className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-lg font-extrabold text-white">
                      {a.full_name.slice(0, 1)}
                      {i < 3 && <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-amber-400 text-[10px] font-extrabold text-amber-950">{i + 1}</span>}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate font-bold text-ink-900">{a.full_name}</h2>
                      <p className="flex items-center gap-3 text-xs text-ink-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" /> {a.region}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" /> {a.phone}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-ink-500">Shu oy sotuv</p>
                      <p className="text-xl font-extrabold text-ink-900 tabular-nums">{fmtCompact(a.revenue_month)}</p>
                    </div>
                    {trend !== null && (
                      <span className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? "text-brand-700" : "text-red-600"}`}>
                        {trend >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                        {Math.abs(trend).toFixed(0)}% o&apos;tgan oyga
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-500">Reja: {fmtCompact(a.monthly_plan)}</span>
                      <span className={`font-bold ${behind ? "text-amber-700" : "text-brand-700"}`}>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="relative mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink-100">
                      <div className={`h-full rounded-full ${behind ? "bg-amber-400" : "bg-gradient-to-r from-brand-500 to-brand-400"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      <span className="absolute inset-y-0 w-0.5 bg-ink-700/50" style={{ left: `${expected}%` }} title="Kutilgan sur'at" />
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-100 pt-4 text-center">
                    <div>
                      <dt className="text-[11px] text-ink-500">Buyurtma</dt>
                      <dd className="font-bold text-ink-900">{a.orders_month}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center justify-center gap-1 text-[11px] text-ink-500">
                        <Store className="size-3" /> Faol
                      </dt>
                      <dd className="font-bold text-ink-900">
                        {a.active_clients}/{a.clients}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-ink-500">Mijoz qarzi</dt>
                      <dd className="font-bold text-amber-700">{fmtCompact(a.clients_debt)}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
      </div>

      <section className="card">
        <h2 className="border-b border-ink-100 px-5 py-4 font-bold">Kuryerlar</h2>
        <Table head={["Kuryer", "Telefon", "Shu oy yetkazdi", "Faol", "Muvaffaqiyatsiz", "Samaradorlik"]}>
          {data?.couriers.map((c) => {
            const rate = c.delivered_month + c.failed ? (c.delivered_month / (c.delivered_month + c.failed)) * 100 : 100;
            return (
              <tr key={c.id}>
                <td className="font-semibold text-ink-900">{c.full_name}</td>
                <td className="text-ink-500">{c.phone}</td>
                <td className="font-bold tabular-nums">{c.delivered_month}</td>
                <td className="tabular-nums">{c.active}</td>
                <td className={c.failed ? "font-semibold text-red-600" : "text-ink-400"}>{c.failed}</td>
                <td className="w-48">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-xs font-semibold">{rate.toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
        <p className="px-5 py-3 text-xs text-ink-400">Rejalar summasi so&apos;mda: {data && fmtMoney(data.agents.reduce((s, a) => s + a.monthly_plan, 0))}</p>
      </section>
    </div>
  );
}
