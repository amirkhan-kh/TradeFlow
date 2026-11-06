"use client";

import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import type { MsgKey } from "@/shared/i18n/messages";
import { api } from "@/shared/lib/api";
import { currency, fmtMoney } from "@/shared/lib/format";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Select, Textarea } from "@/shared/ui/Field";
import { SearchSelect } from "@/shared/ui/SearchSelect";
import { Alert } from "@/shared/ui/States";

const MANUAL: Record<string, MsgKey> = { cash: "Naqd", card: "Karta", transfer: "Bank o'tkazmasi" };
/** Payme and Click arrive only via provider callbacks, never from the manual form. */
export const METHODS: Record<string, MsgKey> = { ...MANUAL, payme: "Payme", click: "Click" };

export function PaymentForm({ clientId, onDone }: { clientId?: number; onDone: () => void }) {
  const t = useT();
  const [client, setClient] = useState<{ id: number; name: string; balance: number } | null>(null);
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
        <Field label={t("Mijoz")}>
          <SearchSelect
            path="/clients"
            params={{ status: "debt" }}
            name="client_id"
            required
            value={client}
            onChange={setClient}
            display={(c) => c.name}
            hint={(c) => t("Qarz {sum}", { sum: fmtMoney(c.balance) })}
          />
        </Field>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("Summa, {cur}", { cur: currency() })}>
          <Input name="amount" type="number" min={1} required />
        </Field>
        <Field label={t("To'lov turi")}>
          <Select name="method" defaultValue="cash">
            {Object.entries(MANUAL).map(([k, v]) => (
              <option key={k} value={k}>
                {t(v)}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label={t("Izoh")}>
        <Textarea name="note" />
      </Field>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" className="w-full" disabled={saving}>
        {t("To'lovni qabul qilish")}
      </Button>
    </form>
  );
}
