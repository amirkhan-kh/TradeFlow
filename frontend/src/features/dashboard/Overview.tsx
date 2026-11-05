"use client";

import {
  ArrowRight,
  Bot,
  Boxes,
  ClipboardCheck,
  HandCoins,
  ShoppingCart,
  TriangleAlert,
  Truck,
  Wallet,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { useT } from "@/shared/i18n/I18nProvider";
import { fmtCompact, fmtCompactMoney, fmtDate, fmtMoney, fmtNum, pctChange } from "@/shared/lib/format";
import { statusOf } from "@/shared/lib/status";
import { useApi } from "@/shared/lib/useApi";
import { StatusBadge } from "@/shared/ui/Badge";
import { KpiCard, PageHeader } from "@/shared/ui/Page";
import { Empty, ErrorState, Skeleton } from "@/shared/ui/States";
import type { InsightsData } from "../insights/types";
import { DailyChart, Donut, FlowChart, PALETTE, SalesChart } from "./Charts";

interface DashboardData {
  kpi: Record<string, number>;
  flow: { month: string; inbound: number; outbound: number }[];
  sales: { month: string; revenue: number; collected: number }[];
  daily: { day: string; revenue: number; orders: number }[];
  topProducts: { id: number; name: string; category: string; units: number; revenue: number }[];
  regions: { region: string; revenue: number; orders: number }[];
  statuses: { status: string; count: number }[];
  categories: { category: string; revenue: number }[];
  audits: { id: number; number: string; status: string; created_at: string; warehouse_name: string; city: string; auditor_name: string; mismatch_count: number }[];
  lowStock: { name: string; sku: string; warehouse_name: string; available: number; min_stock: number }[];
  recentOrders: { id: number; number: string; status: string; total: number; created_at: string; client_name: string }[];
}

function Panel({ title, action, children, className = "" }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-bold text-ink-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function More({ href }: { href: string }) {
  const t = useT();
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
      {t("Barchasi")} <ArrowRight className="size-3.5" />
    </Link>
  );
}

export function Overview() {
  const t = useT();
  const { data, error, loading, reload } = useApi<DashboardData>("/dashboard");
  const insights = useApi<InsightsData>("/insights");

  if (error) return <ErrorState message={error} onRetry={reload} />;

  const k = data?.kpi;
  const urgent = insights.data?.agents.flatMap((a) => a.findings.map((f) => ({ ...f, agent: a.name }))).filter((f) => f.severity === "high").slice(0, 4);
  const maxProduct = Math.max(...(data?.topProducts.map((p) => p.revenue) ?? [1]));

  return (
    <div className="animate-rise space-y-6">
      <PageHeader title={t("Dashboard")} description={t("Boshqaruv paneli — biznesingizning bugungi holati")} />

      {loading || !k ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label={t("Oylik tushum")} value={fmtCompact(k.revenue_month)} icon={Wallet} trend={pctChange(k.revenue_month, k.revenue_prev_same_period)} hint={t("o'tgan oyga nisbatan")} />
          <KpiCard label={t("Buyurtmalar (oy)")} value={fmtNum(k.orders_month)} icon={ShoppingCart} tone="navy" hint={t("bugun: {n}", { n: k.orders_today })} />
          <KpiCard label={t("Faol omborlar")} value={fmtNum(k.active_warehouses)} icon={Warehouse} hint={t("zaxira: {sum}", { sum: fmtCompactMoney(k.stock_value) })} />
          <KpiCard label={t("Kuzatilgan yuklar")} value={t("{n} t", { n: k.shipped_tons_month.toFixed(1) })} icon={Truck} tone="navy" hint={t("yo'lda: {n}", { n: k.active_deliveries })} />
          <KpiCard label={t("Debitorlik")} value={fmtCompact(k.receivables)} icon={HandCoins} tone="amber" hint={t("{n} mijoz limitdan oshgan", { n: k.overlimit_clients })} />
          <KpiCard label={t("Undirilgan (oy)")} value={fmtCompact(k.collected_month)} icon={Wallet} hint={t("{n} ta mijoz", { n: k.clients })} />
          <KpiCard label={t("Faol auditlar")} value={fmtNum(k.active_audits)} icon={ClipboardCheck} tone="navy" hint={t("tekshiruv / tasdiq")} />
          <KpiCard label={t("Kam qoldiq")} value={fmtNum(k.low_stock)} icon={TriangleAlert} tone={k.low_stock > 0 ? "red" : "brand"} hint={t("pozitsiya minimumdan past")} />
        </div>
      )}

      {urgent && urgent.length > 0 && (
        <section className="card overflow-hidden border-amber-200 bg-gradient-to-r from-amber-50 to-white p-0">
          <div className="flex items-center justify-between gap-3 border-b border-amber-100 px-5 py-3">
            <p className="flex items-center gap-2 font-bold text-ink-900">
              <Bot className="size-5 text-brand-600" /> {t("Aqlli agentlar diqqat talab qiladi")}
            </p>
            <More href="/dashboard/insights" />
          </div>
          <ul className="grid divide-y divide-amber-100 md:grid-cols-2 md:divide-y-0">
            {urgent.map((f, i) => (
              <li key={i} className="px-5 py-3">
                <Link href={f.href} className="group block">
                  <p className="text-xs font-semibold text-amber-700">{f.agent}</p>
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">{f.title}</p>
                  <p className="line-clamp-1 text-xs text-ink-500">{f.detail}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={t("Tovar oqimi")} action={<span className="text-xs text-ink-500">{t("so'nggi 7 oy, dona")}</span>}>
          {data ? <FlowChart data={data.flow} /> : <Skeleton className="h-64" />}
        </Panel>
        <Panel title={t("Sotuv hajmi")} action={<span className="text-xs text-ink-500">{t("sotuv va undirilgan to'lov")}</span>}>
          {data ? <SalesChart data={data.sales} /> : <Skeleton className="h-64" />}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title={t("Kunlik tushum — 30 kun")} className="xl:col-span-2">
          {data ? <DailyChart data={data.daily} /> : <Skeleton className="h-56" />}
        </Panel>
        <Panel title={t("Buyurtma holatlari — 30 kun")}>
          {data && (
            <>
              <Donut data={data.statuses.map((s) => ({ ...s, label: t(statusOf(s.status).label) }))} nameKey="label" valueKey="count" />
              <ul className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {data.statuses.map((s, i) => (
                  <li key={s.status} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                    <span className="text-ink-600">{t(statusOf(s.status).label)}</span>
                    <b className="ml-auto text-ink-900">{s.count}</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title={t("Top tovarlar — 90 kun")} action={<More href="/dashboard/products" />}>
          <ul className="space-y-3.5">
            {data?.topProducts.map((p, i) => (
              <li key={p.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium text-ink-800">
                    <span className="mr-2 text-ink-400">{i + 1}.</span>
                    {p.name}
                  </span>
                  <span className="ml-2 shrink-0 font-semibold text-ink-900 tabular-nums">{fmtCompact(p.revenue)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300" style={{ width: `${(p.revenue / maxProduct) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={t("Hududlar bo'yicha sotuv")}>
          {data && (
            <>
              <Donut data={data.regions} nameKey="region" valueKey="revenue" money />
              <ul className="mt-2 space-y-1.5 text-sm">
                {data.regions.map((r, i) => (
                  <li key={r.region} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                    <span className="text-ink-600">{r.region}</span>
                    <b className="ml-auto text-ink-900 tabular-nums">{fmtCompact(r.revenue)}</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
        <Panel title={t("Kam qoldiq ogohlantirishi")} action={<More href="/dashboard/stock" />}>
          {data && data.lowStock.length === 0 && <Empty title={t("Hammasi joyida")} hint={t("Minimumdan past qoldiq yo'q")} />}
          <ul className="divide-y divide-ink-100">
            {data?.lowStock.map((s) => (
              <li key={s.sku + s.warehouse_name} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{s.name}</p>
                  <p className="text-xs text-ink-500">{s.warehouse_name}</p>
                </div>
                <span className={`shrink-0 rounded-lg px-2 py-1 text-xs font-bold ${s.available <= 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                  {fmtNum(s.available)} / {s.min_stock}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel title={t("Audit oqimi")} className="xl:col-span-3" action={<More href="/dashboard/audits" />}>
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-ink-100 bg-ink-50/60 text-left text-xs text-ink-500 uppercase">
                  <th className="px-5 py-2.5 font-semibold">{t("Ombor nomi")}</th>
                  <th className="px-5 py-2.5 font-semibold">{t("Joylashuv")}</th>
                  <th className="px-5 py-2.5 font-semibold">{t("Sana")}</th>
                  <th className="px-5 py-2.5 font-semibold">{t("Farq")}</th>
                  <th className="px-5 py-2.5 font-semibold">{t("Audit holati")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data?.audits.map((a) => (
                  <tr key={a.id} className="hover:bg-brand-50/40">
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/audits/${a.id}`} className="font-semibold text-ink-900 hover:text-brand-700">
                        {a.warehouse_name}
                      </Link>
                      <p className="text-xs text-ink-400">{a.number}</p>
                    </td>
                    <td className="px-5 py-3 text-ink-600">{a.city}</td>
                    <td className="px-5 py-3 text-ink-600">{fmtDate(a.created_at)}</td>
                    <td className="px-5 py-3">{a.mismatch_count > 0 ? <span className="font-semibold text-amber-700">{t("{n} poz.", { n: a.mismatch_count })}</span> : <span className="text-ink-400">—</span>}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title={t("So'nggi buyurtmalar")} className="xl:col-span-2" action={<More href="/dashboard/orders" />}>
          <ul className="divide-y divide-ink-100">
            {data?.recentOrders.map((o) => (
              <li key={o.id}>
                <Link href={`/dashboard/orders/${o.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-brand-700">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{o.client_name}</p>
                    <p className="text-xs text-ink-500">
                      {o.number} · {fmtDate(o.created_at, true)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-ink-900 tabular-nums">{fmtMoney(o.total)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <p className="flex items-center justify-center gap-2 pb-2 text-xs text-ink-400">
        <Boxes className="size-3.5" /> {t("Ma'lumotlar real vaqtda yangilanadi")}
      </p>
    </div>
  );
}
