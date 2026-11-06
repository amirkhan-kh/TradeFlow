"use client";

import { MapPin, Pencil, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { api } from "@/shared/lib/api";
import { fmtCompact, fmtDate, fmtNum } from "@/shared/lib/format";
import { usePaged } from "@/shared/lib/usePaged";
import { StatusBadge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Field, Input } from "@/shared/ui/Field";
import { Modal } from "@/shared/ui/Modal";
import { PageHeader, SearchInput } from "@/shared/ui/Page";
import { Alert, Empty, ErrorState, Skeleton } from "@/shared/ui/States";

interface Warehouse {
  id: number;
  code: string;
  name: string;
  city: string;
  address: string | null;
  capacity: number;
  manager_name: string | null;
  active: boolean;
  units: number;
  stock_value: number;
  skus: number;
  last_audit_status: string | null;
  last_audit_at: string | null;
}

export function WarehousesView() {
  const t = useT();
  const list = usePaged<Warehouse>("/warehouses");
  const [editing, setEditing] = useState<Partial<Warehouse> | null>(null);

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("Omborlar")}
        description={t("Har bir ombor bo'yicha qoldiq, sig'im va audit holati")}
        actions={
          <>
            <SearchInput value={list.q} onChange={list.setQ} placeholder={t("Nomi, shahar yoki kod…")} />
            <Button onClick={() => setEditing({ active: true })}>
              <Plus className="size-4" /> {t("Ombor qo'shish")}
            </Button>
          </>
        }
      />
      {list.error ? (
        <ErrorState message={list.error} onRetry={list.reload} />
      ) : list.loading && !list.data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : !list.data?.items.length ? (
        <Empty title={t("Ombor topilmadi")} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.data.items.map((w) => {
            const fill = w.capacity ? Math.min(100, (w.units / w.capacity) * 100) : 0;
            return (
              <article key={w.id} className="card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 to-brand-700" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-md bg-ink-100 px-2 py-0.5 text-[11px] font-bold text-ink-600">{w.code}</span>
                    <h2 className="mt-2 text-lg font-bold text-ink-900">{w.name}</h2>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500">
                      <MapPin className="size-3.5" /> {w.city}
                      {w.address && `, ${w.address}`}
                    </p>
                  </div>
                  <button onClick={() => setEditing(w)} className="rounded-lg p-2 text-ink-400 opacity-0 transition group-hover:opacity-100 hover:bg-ink-100 hover:text-ink-700 focus:opacity-100" aria-label={t("Tahrirlash")}>
                    <Pencil className="size-4" />
                  </button>
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    [t("Qoldiq"), fmtNum(w.units)],
                    ["SKU", fmtNum(w.skus)],
                    [t("Qiymat"), fmtCompact(w.stock_value)],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-ink-50 py-2.5">
                      <dt className="text-[11px] text-ink-500">{k}</dt>
                      <dd className="text-sm font-bold text-ink-900 tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-ink-500">
                    <span>{t("Bandlik")}</span>
                    <span className="font-semibold text-ink-700">{fill.toFixed(0)}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
                    <div className={`h-full rounded-full ${fill > 85 ? "bg-amber-500" : "bg-brand-500"}`} style={{ width: `${fill}%` }} />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4 text-sm">
                  <span className="flex items-center gap-1.5 text-ink-600">
                    <UserRound className="size-4 text-ink-400" /> {w.manager_name ?? "—"}
                  </span>
                  {w.last_audit_status ? (
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-ink-400">{fmtDate(w.last_audit_at)}</span>
                      <StatusBadge status={w.last_audit_status} />
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-600">{t("Audit o'tkazilmagan")}</span>
                  )}
                </div>
                <Link href={`/dashboard/stock?warehouse_id=${w.id}`} className="mt-3 block text-center text-xs font-semibold text-brand-700 hover:underline">
                  {t("Qoldiqlarni ko'rish →")}
                </Link>
              </article>
            );
          })}
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? t("Omborni tahrirlash") : t("Yangi ombor")}>
        {editing && (
          <WarehouseForm
            initial={editing}
            onDone={() => {
              setEditing(null);
              list.reload();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function WarehouseForm({ initial, onDone }: { initial: Partial<Warehouse>; onDone: () => void }) {
  const t = useT();
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setSaving(true);
    try {
      await api(initial.id ? `/warehouses/${initial.id}` : "/warehouses", {
        method: initial.id ? "PUT" : "POST",
        json: { ...f, active: f.active === "on" },
      });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label={t("Kod")}>
        <Input name="code" required defaultValue={initial.code} placeholder="TSH-03" />
      </Field>
      <Field label={t("Nomi")}>
        <Input name="name" required defaultValue={initial.name} />
      </Field>
      <Field label={t("Shahar")}>
        <Input name="city" required defaultValue={initial.city} />
      </Field>
      <Field label={t("Sig'im (dona)")}>
        <Input name="capacity" type="number" min={0} defaultValue={initial.capacity ?? 0} />
      </Field>
      <Field label={t("Manzil")} className="sm:col-span-2">
        <Input name="address" defaultValue={initial.address ?? ""} />
      </Field>
      <Field label={t("Mas'ul shaxs")}>
        <Input name="manager_name" defaultValue={initial.manager_name ?? ""} />
      </Field>
      <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-ink-700">
        <input type="checkbox" name="active" defaultChecked={initial.active ?? true} className="size-4 accent-brand-600" /> {t("Faol")}
      </label>
      {error && (
        <div className="sm:col-span-2">
          <Alert>{error}</Alert>
        </div>
      )}
      <Button type="submit" className="sm:col-span-2" disabled={saving}>
        {t("Saqlash")}
      </Button>
    </form>
  );
}
