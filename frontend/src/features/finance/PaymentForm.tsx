"use client";

import { useState } from "react";
import { api, type Page } from "@/shared/lib/api";
import { fmtMoney } from "@/shared/lib/format";
import { useApi } from "@/shared/lib/useApi";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Select, Textarea } from "@/shared/ui/Field";
import { Alert } from "@/shared/ui/States";

export const METHODS: Record<string, string> = { cash: "Naqd", card: "Karta", transfer: "Bank o'tkazmasi" };

export function PaymentForm({ clientId, onDone }: { clientId?: number; onDone: () => void }) {
  const clients = useApi<Page<{ id: number; name: string; balance: number }>>(clientId ? null : "/clients?limit=200&status=debt");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setSaving(true);
    try {
      await api("/payments", { method: "POST", json: { ...f, client_id: clientId ?? f.client_id, note: f.note || undefined } });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!clientId && (
        <Field label="Mijoz">
          <Select name="client_id" required defaultValue="">
            <option value="">Tanlang…</option>
            {clients.data?.items.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — qarz {fmtMoney(c.balance)}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Summa, so'm">
          <Input name="amount" type="number" min={1} required />
        </Field>
        <Field label="To'lov turi">
          <Select name="method" defaultValue="cash">
            {Object.entries(METHODS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Izoh">
        <Textarea name="note" />
      </Field>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" className="w-full" disabled={saving}>
        To&apos;lovni qabul qilish
      </Button>
    </form>
  );
}
