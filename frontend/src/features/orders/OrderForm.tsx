"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/shared/lib/api";
import { fmtMoney } from "@/shared/lib/format";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Textarea } from "@/shared/ui/Field";
import { SearchSelect, WarehouseSelect, type WarehouseOption } from "@/shared/ui/SearchSelect";
import { Alert } from "@/shared/ui/States";

interface Option {
  id: number;
  name: string;
}
interface ClientOption extends Option {
  region: string;
  balance: number;
  credit_limit: number;
}
interface ProductOption extends Option {
  sku: string;
  price: number;
  stock: number;
  reserved: number;
  unit: string;
}

export function OrderForm({ onDone }: { onDone: () => void }) {
  const [warehouse, setWarehouse] = useState<WarehouseOption | null>(null);
  const [client, setClient] = useState<ClientOption | null>(null);
  const [lines, setLines] = useState<{ product: ProductOption | null; quantity: number }[]>([{ product: null, quantity: 1 }]);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const subtotal = lines.reduce((s, l) => s + (l.product?.price ?? 0) * l.quantity, 0);
  const total = subtotal * (1 - discount / 100);
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
          client_id: client?.id,
          warehouse_id: f.get("warehouse_id"),
          discount_pct: discount,
          note: f.get("note") || undefined,
          items: lines.filter((l) => l.product).map((l) => ({ product_id: l.product!.id, quantity: l.quantity })),
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
          <SearchSelect<ClientOption>
            path="/clients"
            required
            value={client}
            onChange={setClient}
            display={(c) => `${c.name} — ${c.region}`}
            hint={(c) => `Qarz ${fmtMoney(c.balance)} · limit ${c.credit_limit ? fmtMoney(c.credit_limit) : "cheksiz"}`}
          />
        </Field>
        <Field label="Ombor">
          <WarehouseSelect params={{ active: "true" }} name="warehouse_id" required value={warehouse} onChange={setWarehouse} />
        </Field>
      </div>

      <div>
        <p className="label">Tovarlar</p>
        <div className="space-y-2">
          {lines.map((l, i) => {
            const p = l.product;
            return (
              <div key={i} className="grid grid-cols-[1fr_90px_36px] gap-2">
                <SearchSelect<ProductOption>
                  path="/products"
                  params={{ active: "true" }}
                  required
                  aria-label="Tovar"
                  placeholder="Tovar qidiring…"
                  value={p}
                  onChange={(product) => update(i, { product })}
                  display={(o) => o.name}
                  hint={(o) => `${o.sku} · ${fmtMoney(o.price)} · bo'sh ${o.stock - o.reserved} ${o.unit}`}
                />
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
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setLines((ls) => [...ls, { product: null, quantity: 1 }])}>
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
