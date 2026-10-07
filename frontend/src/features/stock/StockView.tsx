"use client";

import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { api, type Page } from "@/shared/lib/api";
import { fmtDate, fmtNum } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { usePaged } from "@/shared/lib/usePaged";
import { StatusBadge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Select, Textarea } from "@/shared/ui/Field";
import { Modal } from "@/shared/ui/Modal";
import { Chips, PageHeader, Pagination, SearchInput, Table } from "@/shared/ui/Page";
import { Alert, Empty, ErrorState, Loading } from "@/shared/ui/States";

interface StockRow {
  warehouse_id: number;
  product_id: number;
  quantity: number;
  reserved: number;
  available: number;
  sku: string;
  product_name: string;
  category: string;
  unit: string;
  min_stock: number;
  warehouse_name: string;
}
interface Movement {
  id: number;
  type: string;
  quantity: number;
  reference: string | null;
  note: string | null;
  created_at: string;
  product_name: string;
  sku: string;
  warehouse_name: string;
  to_warehouse_name: string | null;
  user_name: string | null;
}
type MoveType = "in" | "out" | "transfer";

export function StockView({ initialWarehouse, initialLow }: { initialWarehouse?: string; initialLow?: boolean }) {
  const [tab, setTab] = useState<"stock" | "moves">("stock");
  const [warehouse, setWarehouse] = useState(initialWarehouse ?? "");
  const [low, setLow] = useState(Boolean(initialLow));
  const [move, setMove] = useState<MoveType | null>(null);
  const warehouses = useApi<Page<{ id: number; name: string }>>("/warehouses?limit=200");

  const stock = usePaged<StockRow>("/stock", "", { warehouse_id: warehouse || undefined, low: low ? "true" : undefined });
  const moves = usePaged<Movement>("/stock/movements", "", { warehouse_id: warehouse || undefined });

  return (
    <div className="animate-rise">
      <PageHeader
        title="Qoldiq va harakat"
        description="Bo'sh qoldiq = jami − buyurtmalar uchun band qilingan"
        actions={
          <>
            <Button variant="secondary" onClick={() => setMove("in")}>
              <ArrowDownLeft className="size-4 text-brand-600" /> Kirim
            </Button>
            <Button variant="secondary" onClick={() => setMove("out")}>
              <ArrowUpRight className="size-4 text-amber-600" /> Chiqim
            </Button>
            <Button onClick={() => setMove("transfer")}>
              <ArrowLeftRight className="size-4" /> Ko&apos;chirish
            </Button>
          </>
        }
      />
      <div className="card">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center">
          <Chips
            options={[
              { value: "stock", label: "Qoldiqlar" },
              { value: "moves", label: "Harakatlar tarixi" },
            ]}
            value={tab}
            onChange={setTab}
          />
          <Select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="lg:w-56" aria-label="Ombor">
            <option value="">Barcha omborlar</option>
            {warehouses.data?.items.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </Select>
          {tab === "stock" && (
            <>
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
                <input type="checkbox" checked={low} onChange={(e) => setLow(e.target.checked)} className="size-4 accent-brand-600" /> Faqat kam qoldiq
              </label>
              <div className="lg:ml-auto">
                <SearchInput value={stock.q} onChange={stock.setQ} placeholder="Tovar yoki SKU…" />
              </div>
            </>
          )}
          {tab === "moves" && (
            <div className="lg:ml-auto">
              <Chips
                options={[
                  { value: "", label: "Barchasi" },
                  { value: "in", label: "Kirim" },
                  { value: "out", label: "Chiqim" },
                  { value: "transfer", label: "Ko'chirish" },
                  { value: "adjust", label: "Tuzatish" },
                ]}
                value={moves.status}
                onChange={moves.setStatus}
              />
            </div>
          )}
        </div>

        {tab === "stock" ? (
          stock.error ? (
            <ErrorState message={stock.error} onRetry={stock.reload} />
          ) : stock.loading && !stock.data ? (
            <Loading />
          ) : !stock.data?.items.length ? (
            <Empty title="Qoldiq topilmadi" />
          ) : (
            <>
              <Table head={["Tovar", "Ombor", "Jami", "Band", "Bo'sh", "Minimum", "Holat"]}>
                {stock.data.items.map((s) => {
                  const ratio = s.min_stock ? s.available / (s.min_stock * 3) : 1;
                  return (
                    <tr key={`${s.warehouse_id}-${s.product_id}`}>
                      <td>
                        <p className="font-semibold text-ink-900">{s.product_name}</p>
                        <p className="text-xs text-ink-400">
                          {s.sku} · {s.category}
                        </p>
                      </td>
                      <td className="text-ink-600">{s.warehouse_name}</td>
                      <td className="tabular-nums">{fmtNum(s.quantity)}</td>
                      <td className="text-violet-700 tabular-nums">{fmtNum(s.reserved)}</td>
                      <td className="font-bold tabular-nums">{fmtNum(s.available)}</td>
                      <td className="text-ink-500 tabular-nums">{s.min_stock}</td>
                      <td className="w-40">
                        <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                          <div
                            className={`h-full rounded-full ${s.available <= s.min_stock ? "bg-red-500" : ratio < 1 ? "bg-amber-400" : "bg-brand-500"}`}
                            style={{ width: `${Math.min(100, Math.max(4, ratio * 100))}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </Table>
              <Pagination page={stock.page} limit={stock.data.limit} total={stock.data.total} onChange={stock.setPage} />
            </>
          )
        ) : moves.error ? (
          <ErrorState message={moves.error} onRetry={moves.reload} />
        ) : moves.loading && !moves.data ? (
          <Loading />
        ) : !moves.data?.items.length ? (
          <Empty title="Harakat yo'q" />
        ) : (
          <>
            <Table head={["Sana", "Turi", "Tovar", "Ombor", "Miqdor", "Hujjat", "Xodim"]}>
              {moves.data.items.map((m) => (
                <tr key={m.id}>
                  <td className="whitespace-nowrap text-ink-500">{fmtDate(m.created_at, true)}</td>
                  <td>
                    <StatusBadge status={m.type} />
                  </td>
                  <td className="font-medium text-ink-900">{m.product_name}</td>
                  <td className="text-ink-600">
                    {m.warehouse_name}
                    {m.to_warehouse_name && <span className="text-ink-400"> → {m.to_warehouse_name}</span>}
                  </td>
                  <td className={`font-bold tabular-nums ${m.type === "out" || m.quantity < 0 ? "text-amber-700" : "text-brand-700"}`}>
                    {m.type === "out" ? "−" : m.quantity > 0 ? "+" : ""}
                    {fmtNum(m.quantity)}
                  </td>
                  <td className="text-ink-500">{m.reference ?? m.note ?? "—"}</td>
                  <td className="text-ink-500">{m.user_name ?? "—"}</td>
                </tr>
              ))}
            </Table>
            <Pagination page={moves.page} limit={moves.data.limit} total={moves.data.total} onChange={moves.setPage} />
          </>
        )}
      </div>

      <Modal open={move !== null} onClose={() => setMove(null)} title={move === "in" ? "Kirim qilish" : move === "out" ? "Chiqim qilish" : "Omborlararo ko'chirish"}>
        {move && (
          <MoveForm
            type={move}
            warehouses={warehouses.data?.items ?? []}
            onDone={() => {
              setMove(null);
              stock.reload();
              moves.reload();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function MoveForm({ type, warehouses, onDone }: { type: MoveType; warehouses: { id: number; name: string }[]; onDone: () => void }) {
  const products = useApi<Page<{ id: number; name: string; sku: string }>>("/products?limit=200");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [key] = useState(() => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setSaving(true);
    try {
      await api("/stock/movements", { method: "POST", json: { ...f, type, idempotency_key: key, note: f.note || undefined } });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className={`grid gap-4 ${type === "transfer" ? "sm:grid-cols-2" : ""}`}>
        <Field label={type === "transfer" ? "Qaysi ombordan" : "Ombor"}>
          <Select name="warehouse_id" required defaultValue="">
            <option value="">Tanlang…</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </Select>
        </Field>
        {type === "transfer" && (
          <Field label="Qaysi omborga">
            <Select name="to_warehouse_id" required defaultValue="">
              <option value="">Tanlang…</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>
      <Field label="Tovar">
        <Select name="product_id" required defaultValue="">
          <option value="">Tanlang…</option>
          {products.data?.items.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Miqdor">
        <Input name="quantity" type="number" min={1} required />
      </Field>
      <Field label="Izoh">
        <Textarea name="note" placeholder={type === "in" ? "Yetkazib beruvchi, nakladnoy raqami…" : ""} />
      </Field>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" className="w-full" disabled={saving}>
        Tasdiqlash
      </Button>
    </form>
  );
}
