"use client";

import { Check, ChevronLeft, Phone, Store, Truck, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import type { MsgKey } from "@/shared/i18n/messages";
import { trData } from "@/shared/i18n/translate";
import { api } from "@/shared/lib/api";
import { fmtDate, fmtMoney, fmtNum } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { StatusBadge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Select } from "@/shared/ui/Field";
import { Modal } from "@/shared/ui/Modal";
import { Table } from "@/shared/ui/Page";
import { Alert, ErrorState, Loading } from "@/shared/ui/States";

interface OrderFull {
  id: number;
  number: string;
  status: string;
  subtotal: number;
  discount_pct: number;
  total: number;
  note: string | null;
  created_at: string;
  updated_at: string;
  client_id: number;
  client_name: string;
  client_phone: string | null;
  client_address: string | null;
  client_balance: number;
  agent_name: string | null;
  warehouse_name: string;
  delivery_status: string | null;
  vehicle: string | null;
  courier_name: string | null;
  items: { id: number; product_name: string; sku: string; unit: string; quantity: number; price: number }[];
}

const FLOW = ["new", "confirmed", "shipped", "delivered"] as const;
const FLOW_LABEL: Record<(typeof FLOW)[number], MsgKey> = { new: "Yangi", confirmed: "Tasdiqlangan", shipped: "Yuklangan", delivered: "Yetkazildi" };

export function OrderDetail({ id }: { id: string }) {
  const t = useT();
  const { data: o, error, loading, reload } = useApi<OrderFull>(`/orders/${id}`);
  const couriers = useApi<{ items: { id: number; full_name: string }[] }>("/users?role=courier&status=active");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string>();
  const [shipOpen, setShipOpen] = useState(false);

  async function setStatus(status: string, extra: Record<string, unknown> = {}) {
    setBusy(true);
    setActionError(undefined);
    try {
      await api(`/orders/${id}/status`, { method: "POST", json: { status, ...extra } });
      setShipOpen(false);
      reload();
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading && !o) return <Loading />;
  if (!o) return null;

  const step = FLOW.indexOf(o.status as (typeof FLOW)[number]);

  return (
    <div className="animate-rise space-y-6">
      <div>
        <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700">
          <ChevronLeft className="size-4" /> {t("Buyurtmalar")}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-ink-900">{o.number}</h1>
          <StatusBadge status={o.status} />
          <span className="text-sm text-ink-500">{fmtDate(o.created_at, true)}</span>
          <div className="ml-auto flex gap-2">
            {o.status === "new" && (
              <Button onClick={() => setStatus("confirmed")} disabled={busy}>
                <Check className="size-4" /> {t("Tasdiqlash")}
              </Button>
            )}
            {o.status === "confirmed" && (
              <Button onClick={() => setShipOpen(true)} disabled={busy}>
                <Truck className="size-4" /> {t("Yuklash")}
              </Button>
            )}
            {o.status === "shipped" && (
              <Button onClick={() => setStatus("delivered")} disabled={busy}>
                <Check className="size-4" /> {t("Yetkazildi")}
              </Button>
            )}
            {(o.status === "new" || o.status === "confirmed") && (
              <Button variant="secondary" onClick={() => confirm(t("Buyurtmani bekor qilasizmi?")) && setStatus("cancelled")} disabled={busy}>
                <X className="size-4" /> {t("Bekor qilish")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {actionError && <Alert>{actionError}</Alert>}

      {o.status !== "cancelled" && (
        <ol className="card grid grid-cols-4 gap-2 p-5">
          {FLOW.map((s, i) => (
            <li key={s} className="flex flex-col items-center gap-2 text-center">
              <div className="flex w-full items-center">
                <span className={`h-0.5 flex-1 ${i === 0 ? "invisible" : i <= step ? "bg-brand-500" : "bg-ink-200"}`} />
                <span
                  className={`grid size-9 place-items-center rounded-full text-sm font-bold ${
                    i <= step ? "bg-brand-600 text-white shadow-md shadow-brand-600/30" : "bg-ink-100 text-ink-400"
                  }`}
                >
                  {i < step ? <Check className="size-4" /> : i + 1}
                </span>
                <span className={`h-0.5 flex-1 ${i === FLOW.length - 1 ? "invisible" : i < step ? "bg-brand-500" : "bg-ink-200"}`} />
              </div>
              <span className={`text-xs font-semibold ${i <= step ? "text-brand-700" : "text-ink-400"}`}>{t(FLOW_LABEL[s])}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card lg:col-span-2">
          <h2 className="border-b border-ink-100 px-5 py-4 font-bold">{t("Tovarlar")}</h2>
          <Table head={[t("Tovar"), "SKU", t("Miqdor"), t("Narx"), t("Summa")]}>
            {o.items.map((i) => (
              <tr key={i.id}>
                <td className="font-medium text-ink-900">{i.product_name}</td>
                <td className="text-ink-500">{i.sku}</td>
                <td className="tabular-nums">
                  {fmtNum(i.quantity)} {trData(i.unit)}
                </td>
                <td className="tabular-nums">{fmtMoney(i.price)}</td>
                <td className="font-semibold tabular-nums">{fmtMoney(i.quantity * i.price)}</td>
              </tr>
            ))}
          </Table>
          <div className="space-y-1 border-t border-ink-100 px-5 py-4 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>{t("Oraliq summa")}</span>
              <span className="tabular-nums">{fmtMoney(o.subtotal)}</span>
            </div>
            {o.discount_pct > 0 && (
              <div className="flex justify-between text-brand-700">
                <span>{t("Chegirma {n}%", { n: o.discount_pct })}</span>
                <span className="tabular-nums">−{fmtMoney(o.subtotal - o.total)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-extrabold">
              <span>{t("Jami")}</span>
              <span className="tabular-nums">{fmtMoney(o.total)}</span>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold">
              <Store className="size-4 text-brand-600" /> {t("Mijoz")}
            </h2>
            <Link href={`/dashboard/clients/${o.client_id}`} className="font-semibold text-brand-700 hover:underline">
              {o.client_name}
            </Link>
            <p className="mt-1 text-sm text-ink-500">{o.client_address}</p>
            {o.client_phone && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
                <Phone className="size-3.5" /> {o.client_phone}
              </p>
            )}
            <p className="mt-3 rounded-xl bg-ink-50 px-3 py-2 text-sm">
              {t("Joriy qarz:")} <b className={o.client_balance > 0 ? "text-red-600" : "text-brand-700"}>{fmtMoney(o.client_balance)}</b>
            </p>
          </section>
          <section className="card space-y-2 p-5 text-sm">
            <h2 className="mb-1 flex items-center gap-2 font-bold">
              <Truck className="size-4 text-brand-600" /> {t("Logistika")}
            </h2>
            <Row k={t("Ombor")} v={o.warehouse_name} />
            <Row k={t("Agent")} v={o.agent_name ?? "—"} />
            <Row k={t("Kuryer")} v={o.courier_name ?? "—"} />
            <Row k={t("Mashina")} v={o.vehicle ?? "—"} />
            <Row k={t("Yetkazish")} v={o.delivery_status ? <StatusBadge status={o.delivery_status} /> : "—"} />
            {o.note && <p className="rounded-xl bg-amber-50 px-3 py-2 text-amber-800">{trData(o.note)}</p>}
          </section>
        </div>
      </div>

      <Modal open={shipOpen} onClose={() => setShipOpen(false)} title={t("Yuklash va kuryer biriktirish")} description={t("Qoldiq ombordan chiqim qilinadi va mijoz qarziga yoziladi")}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            setStatus("shipped", { courier_id: f.get("courier_id") || null, vehicle: f.get("vehicle") || undefined });
          }}
        >
          <Field label={t("Kuryer")}>
            <Select name="courier_id" defaultValue="">
              <option value="">{t("Keyinroq biriktiriladi")}</option>
              {couriers.data?.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("Mashina raqami")}>
            <Input name="vehicle" placeholder="01 A 123 BC" />
          </Field>
          {actionError && <Alert>{actionError}</Alert>}
          <Button type="submit" className="w-full" disabled={busy}>
            {t("Yuklashni tasdiqlash")}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-500">{k}</span>
      <span className="font-medium text-ink-900">{v}</span>
    </div>
  );
}