"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { trData } from "@/shared/i18n/translate";
import { api } from "@/shared/lib/api";
import { fmtDate, fmtMoney, fmtNum } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { usePaged } from "@/shared/lib/usePaged";
import { Button } from "@/shared/ui/Button";
import { Field, Input } from "@/shared/ui/Field";
import { Modal } from "@/shared/ui/Modal";
import { Chips, PageHeader, Pagination, SearchInput, Table } from "@/shared/ui/Page";
import { Alert, Empty, ErrorState, Loading } from "@/shared/ui/States";

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  unit: string;
  weight_kg: number;
  price: number;
  cost: number;
  min_stock: number;
  expires_at: string | null;
  active: boolean;
  ikpu: string | null;
  package_code: string | null;
  vat_rate: number;
  stock: number;
  reserved: number;
}

export function ProductsView() {
  const t = useT();
  const list = usePaged<Product>("/products");
  const cats = useApi<{ items: string[] }>("/products/categories");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const soon = (d: string | null) => d && new Date(d).getTime() - Date.now() < 45 * 86_400_000;

  return (
    <div className="animate-rise">
      <PageHeader
        title={t("Tovarlar")}
        description={t("Katalog, narxlar, marja va umumiy qoldiq")}
        actions={
          <Button onClick={() => setEditing({ unit: "dona", active: true })}>
            <Plus className="size-4" /> {t("Tovar qo'shish")}
          </Button>
        }
      />
      <div className="card">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Chips options={[{ value: "", label: t("Barchasi") }, ...(cats.data?.items.map((c) => ({ value: c, label: trData(c) })) ?? [])]} value={list.status} onChange={list.setStatus} />
          <SearchInput value={list.q} onChange={list.setQ} placeholder={t("Nomi yoki SKU…")} />
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : list.loading && !list.data ? (
          <Loading />
        ) : !list.data?.items.length ? (
          <Empty title={t("Tovar topilmadi")} />
        ) : (
          <>
            <Table head={[t("Tovar"), t("Kategoriya"), t("Narx"), t("Tannarx / marja"), t("Qoldiq"), t("Band"), t("Yaroqlilik"), ""]}>
              {list.data.items.map((p) => {
                const margin = p.price ? ((p.price - p.cost) / p.price) * 100 : 0;
                return (
                  <tr key={p.id}>
                    <td>
                      <p className="font-semibold text-ink-900">{p.name}</p>
                      <p className="text-xs text-ink-400">{p.sku}</p>
                    </td>
                    <td>
                      <span className="rounded-lg bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-700">{trData(p.category)}</span>
                    </td>
                    <td className="font-semibold whitespace-nowrap tabular-nums">{fmtMoney(p.price)}</td>
                    <td className="whitespace-nowrap text-ink-600 tabular-nums">
                      {fmtMoney(p.cost)} <span className="ml-1 text-xs font-bold text-brand-600">{margin.toFixed(0)}%</span>
                    </td>
                    <td className={`font-semibold tabular-nums ${p.stock - p.reserved <= p.min_stock ? "text-red-600" : "text-ink-900"}`}>
                      {fmtNum(p.stock)} {trData(p.unit)}
                    </td>
                    <td className="text-ink-500 tabular-nums">{fmtNum(p.reserved)}</td>
                    <td className={soon(p.expires_at) ? "font-semibold text-amber-700" : "text-ink-500"}>{p.expires_at ? fmtDate(p.expires_at) : "—"}</td>
                    <td>
                      <button onClick={() => setEditing(p)} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label={t("Tahrirlash")}>
                        <Pencil className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </Table>
            <Pagination page={list.page} limit={list.data.limit} total={list.data.total} onChange={list.setPage} />
          </>
        )}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? t("Tovarni tahrirlash") : t("Yangi tovar")} wide>
        {editing && (
          <ProductForm
            initial={editing}
            onDone={() => {
              setEditing(null);
              list.reload();
              cats.reload();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function ProductForm({ initial, onDone }: { initial: Partial<Product>; onDone: () => void }) {
  const t = useT();
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setSaving(true);
    try {
      await api(initial.id ? `/products/${initial.id}` : "/products", {
        method: initial.id ? "PUT" : "POST",
        json: { ...f, expires_at: f.expires_at || null, active: f.active === "on", package_code: f.package_code || undefined },
      });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-3">
      <Field label={t("Nomi")} className="sm:col-span-2">
        <Input name="name" required defaultValue={initial.name} />
      </Field>
      <Field label="SKU">
        <Input name="sku" required defaultValue={initial.sku} />
      </Field>
      <Field label={t("Kategoriya")}>
        <Input name="category" required defaultValue={initial.category} />
      </Field>
      <Field label={t("O'lchov birligi")}>
        <Input name="unit" required defaultValue={initial.unit} />
      </Field>
      <Field label={t("Og'irlik, kg")}>
        <Input name="weight_kg" type="number" step="0.001" min={0} defaultValue={initial.weight_kg ?? 0} />
      </Field>
      <Field label={t("Sotuv narxi")}>
        <Input name="price" type="number" min={0} required defaultValue={initial.price} />
      </Field>
      <Field label={t("Tannarx")}>
        <Input name="cost" type="number" min={0} defaultValue={initial.cost ?? 0} />
      </Field>
      <Field label={t("Minimal qoldiq")}>
        <Input name="min_stock" type="number" min={0} defaultValue={initial.min_stock ?? 0} />
      </Field>
      <Field label={t("Yaroqlilik muddati")}>
        <Input name="expires_at" type="date" defaultValue={initial.expires_at?.slice(0, 10) ?? ""} />
      </Field>
      <Field label={t("IKPU (MXIK) kodi")}>
        <Input name="ikpu" inputMode="numeric" pattern="\d{17}" placeholder={t("17 ta raqam")} defaultValue={initial.ikpu ?? ""} />
      </Field>
      <Field label={t("O'ram kodi")}>
        <Input name="package_code" defaultValue={initial.package_code ?? ""} />
      </Field>
      <Field label={t("QQS, %")}>
        <Input name="vat_rate" type="number" min={0} max={100} step="0.01" defaultValue={initial.vat_rate ?? 12} />
      </Field>
      <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-ink-700">
        <input type="checkbox" name="active" defaultChecked={initial.active ?? true} className="size-4 accent-brand-600" /> {t("Sotuvda")}
      </label>
      {error && (
        <div className="sm:col-span-3">
          <Alert>{error}</Alert>
        </div>
      )}
      <Button type="submit" className="sm:col-span-3" disabled={saving}>
        {t("Saqlash")}
      </Button>
    </form>
  );
}
