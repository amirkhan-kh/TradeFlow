"use client";

import { CircleCheck, Clock, Route, Timer, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/shared/lib/api";
import { fmtDate, fmtMoney } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { usePaged } from "@/shared/lib/usePaged";
import { StatusBadge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Chips, KpiCard, PageHeader, Pagination, SearchInput, Table } from "@/shared/ui/Page";
import { Alert, Empty, ErrorState, Loading } from "@/shared/ui/States";

interface Delivery {
  id: number;
  order_id: number;
  order_number: string;
  status: string;
  total: number;
  client_name: string;
  region: string;
  address: string | null;
  phone: string | null;
  courier_id: number | null;
  courier_name: string | null;
  vehicle: string | null;
  warehouse_name: string;
  weight_kg: number;
  scheduled_at: string;
  delivered_at: string | null;
  note: string | null;
}
interface Summary {
  summary: { pending: number; on_route: number; delivered_today: number; failed: number; on_time_pct: number | null };
}

export function DeliveriesView({ initialStatus = "" }: { initialStatus?: string }) {
  const list = usePaged<Delivery, Summary>("/deliveries", initialStatus);
  const couriers = useApi<{ items: { id: number; full_name: string }[] }>("/users?role=courier");
  const [error, setError] = useState<string>();
  const s = list.data?.summary;

  async function patch(id: number, body: Record<string, unknown>) {
    setError(undefined);
    try {
      await api(`/deliveries/${id}`, { method: "PATCH", json: body });
      list.reload();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="animate-rise">
      <PageHeader title="Yetkazib berish" description="Kuryerlar, marshrut holati va o'z vaqtida yetkazish ko'rsatkichi" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="Kutilmoqda" value={s?.pending ?? "…"} icon={Clock} tone="navy" />
        <KpiCard label="Yo'lda" value={s?.on_route ?? "…"} icon={Route} tone="amber" />
        <KpiCard label="Bugun yetkazildi" value={s?.delivered_today ?? "…"} icon={CircleCheck} />
        <KpiCard label="Muvaffaqiyatsiz" value={s?.failed ?? "…"} icon={TriangleAlert} tone="red" />
        <KpiCard label="O'z vaqtida" value={s?.on_time_pct != null ? `${s.on_time_pct}%` : "…"} icon={Timer} />
      </div>
      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}
      <div className="card">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Chips
            options={[
              { value: "", label: "Barchasi" },
              { value: "pending", label: "Kutilmoqda" },
              { value: "on_route", label: "Yo'lda" },
              { value: "delivered", label: "Yetkazildi" },
              { value: "failed", label: "Muvaffaqiyatsiz" },
            ]}
            value={list.status}
            onChange={list.setStatus}
          />
          <SearchInput value={list.q} onChange={list.setQ} placeholder="Buyurtma, mijoz, hudud…" />
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : list.loading && !list.data ? (
          <Loading />
        ) : !list.data?.items.length ? (
          <Empty title="Yetkazish topilmadi" />
        ) : (
          <>
            <Table head={["Buyurtma", "Mijoz / manzil", "Yuk", "Kuryer", "Reja", "Holat", "Amal"]}>
              {list.data.items.map((d) => (
                <tr key={d.id}>
                  <td>
                    <Link href={`/dashboard/orders/${d.order_id}`} className="font-semibold text-brand-700 hover:underline">
                      {d.order_number}
                    </Link>
                    <p className="text-xs text-ink-500">{d.warehouse_name}</p>
                  </td>
                  <td>
                    <p className="font-medium text-ink-900">{d.client_name}</p>
                    <p className="text-xs text-ink-500">{d.address ?? d.region}</p>
                  </td>
                  <td className="whitespace-nowrap text-ink-600">
                    <p className="tabular-nums">{Number(d.weight_kg).toFixed(0)} kg</p>
                    <p className="text-xs text-ink-400">{fmtMoney(d.total)}</p>
                  </td>
                  <td>
                    {d.status === "delivered" ? (
                      <span className="text-ink-600">{d.courier_name ?? "—"}</span>
                    ) : (
                      <select
                        value={d.courier_id ?? ""}
                        onChange={(e) => patch(d.id, { courier_id: e.target.value ? Number(e.target.value) : null })}
                        className="input h-8 w-40 py-0 text-xs"
                        aria-label="Kuryer"
                      >
                        <option value="">Biriktirilmagan</option>
                        {couriers.data?.items.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.full_name}
                          </option>
                        ))}
                      </select>
                    )}
                    {d.vehicle && <p className="mt-0.5 text-xs text-ink-400">{d.vehicle}</p>}
                  </td>
                  <td className="whitespace-nowrap text-ink-500">
                    {fmtDate(d.scheduled_at)}
                    {d.delivered_at && <p className="text-xs text-brand-700">✓ {fmtDate(d.delivered_at, true)}</p>}
                  </td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      {d.status === "pending" && (
                        <Button size="sm" variant="secondary" onClick={() => patch(d.id, { status: "on_route" })}>
                          Yo&apos;lga chiqdi
                        </Button>
                      )}
                      {(d.status === "pending" || d.status === "on_route" || d.status === "failed") && (
                        <Button size="sm" onClick={() => patch(d.id, { status: "delivered" })}>
                          Yetkazildi
                        </Button>
                      )}
                      {d.status === "on_route" && (
                        <Button size="sm" variant="ghost" onClick={() => patch(d.id, { status: "failed", note: "Mijoz qabul qilmadi" })}>
                          Muvaffaqiyatsiz
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination page={list.page} limit={list.data.limit} total={list.data.total} onChange={list.setPage} />
          </>
        )}
      </div>
    </div>
  );
}
