"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { api, type Page } from "@/shared/lib/api";
import { fmtMoney } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Select, Textarea } from "@/shared/ui/Field";
import { Alert } from "@/shared/ui/States";

interface Option {
  id: number;
  name: string;
}
interface ProductOption extends Option {
  price: number;
  stock: number;
  reserved: number;
  unit: string;
}

export function OrderForm({ onDone }: { onDone: () => void }) {
  const clients = useApi<Page<Option & { region: string; balance: number; credit_limit: number }>>("/clients?limit=200");
  const warehouses = useApi<Page<Option>>("/warehouses?limit=200");
  const products = useApi<Page<ProductOption>>("/products?limit=200");

  const [clientId, setClientId] = useState("");
  const [lines, setLines] = useState([{ product_id: "", quantity: 1 }]);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const priceOf = useMemo(() => new Map(products.data?.items.map((p) => [p.id, p])), [products.data]);
  const subtotal = lines.reduce((s, l) => s + (priceOf.get(Number(l.product_id))?.price ?? 0) * l.quantity, 0);
  const total = subtotal * (1 - discount / 100);
  const client = clients.data?.items.find((c) => c.id === Number(clientId));
  const overLimit = client && client.credit_limit > 0 && client.balance + total > client.credit_limit;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    setError(undefined);
    try {
      await api("/orders", {
        method: "POST",
        json: {
          client_id: clientId,
          warehouse_id: f.get("warehouse_id"),
          discount_pct: discount,
          note: f.get("note") || undefined,
          items: lines.filter((l) => l.product_id).map((l) => ({ product_id: l.product_id, quantity: l.quantity })),
        },
      });
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const update = (i: number, patch: Partial<(typeof lines)[number]>) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mijoz (savdo nuqtasi)">
          <Select required value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Tanlang…</option>
            {clients.data?.items.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.region}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Ombor">
          <Select name="warehouse_id" required defaultValue="">
            <option value="">Tanlang…</option>
            {warehouses.data?.items.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div>
        <p className="label">Tovarlar</p>
        <div className="space-y-2">
          {lines.map((l, i) => {
            const p = priceOf.get(Number(l.product_id));
            return (
              <div key={i} className="grid grid-cols-[1fr_90px_36px] gap-2">
                <Select required value={l.product_id} onChange={(e) => update(i, { product_id: e.target.value })} aria-label="Tovar">
                  <option value="">Tovar tanlang…</option>
                  {products.data?.items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {fmtMoney(p.price)} · bo&apos;sh {p.stock - p.reserved}
                    </option>
                  ))}
                </Select>
                <Input type="number" min={1} required value={l.quantity} onChange={(e) => update(i, { quantity: Number(e.target.value) })} aria-label="Miqdor" title={p?.unit} />
                <button
                  type="button"
                  onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((_, j) => j !== i) : ls))}
                  className="grid place-items-center rounded-xl text-ink-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Qatorni o'chirish"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setLines((ls) => [...ls, { product_id: "", quantity: 1 }])}>
          <Plus className="size-4" /> Qator qo&apos;shish
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Chegirma, %">
          <Input type="number" min={0} max={50} step="0.5" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        </Field>
        <Field label="Izoh">
          <Textarea name="note" className="min-h-10" rows={1} />
        </Field>
      </div>

      <div className="rounded-2xl bg-brand-50 p-4 text-sm">
        <div className="flex justify-between text-ink-600">
          <span>Oraliq summa</span>
          <span className="tabular-nums">{fmtMoney(subtotal)}</span>
        </div>
        <div className="mt-1 flex justify-between text-base font-bold text-ink-900">
          <span>Jami</span>
          <span className="tabular-nums">{fmtMoney(total)}</span>
        </div>
        {client && (
          <p className={`mt-2 text-xs ${overLimit ? "font-semibold text-red-600" : "text-ink-500"}`}>
            Mijoz qarzi: {fmtMoney(client.balance)} / limit {client.credit_limit ? fmtMoney(client.credit_limit) : "cheksiz"}
            {overLimit && " — kredit limiti oshadi!"}
          </p>
        )}
      </div>

      {error && <Alert>{error}</Alert>}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saqlanmoqda…" : "Buyurtma yaratish"}
        </Button>
      </div>
    </form>
  );
}
