"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { api } from "@/shared/lib/api";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Select } from "@/shared/ui/Field";
import { Alert } from "@/shared/ui/States";
import { ProviderLogo } from "./ProviderLogo";
import type { Integration, ProviderInfo } from "./types";

export function IntegrationForm({
  provider,
  eventLabels,
  initial,
  onDone,
}: {
  provider: ProviderInfo;
  eventLabels: Record<string, string>;
  initial?: Integration;
  onDone: () => void;
}) {
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const config = Object.fromEntries(provider.fields.map((f) => [f.key, String(form.get(f.key) ?? "")]));
    const body = {
      name: String(form.get("name")),
      config,
      events: form.getAll("events").map(String),
      active: form.get("active") === "on",
    };
    setSaving(true);
    setError(undefined);
    try {
      await api(initial ? `/integrations/${initial.id}` : "/integrations", {
        method: initial ? "PUT" : "POST",
        json: initial ? body : { ...body, provider: provider.key },
      });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="flex gap-4 rounded-2xl bg-ink-50 p-4 ring-1 ring-ink-200/70">
        <ProviderLogo provider={provider.key} name={provider.name} size="lg" />
        <div className="min-w-0 text-sm">
          {provider.vendors && <p className="text-xs font-semibold text-ink-500">{provider.vendors}</p>}
          <p className="mt-0.5 leading-relaxed text-ink-700">{provider.description}</p>
          {provider.docs && (
            <a href={provider.docs} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
              Qo&apos;llanma <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>
      <Field label="Nomi">
        <Input name="name" required minLength={2} maxLength={80} defaultValue={initial?.name ?? provider.name} />
      </Field>
      {provider.fields.map((f) => (
        <Field key={f.key} label={f.required ? `${f.label} *` : f.label}>
          {f.type === "select" ? (
            <Select name={f.key} defaultValue={initial?.config[f.key] ?? f.options?.[0]?.value}>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              name={f.key}
              type={f.type === "password" ? "password" : f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
              required={f.required && !(f.type === "password" && initial?.config[f.key])}
              defaultValue={f.type === "password" ? "" : (initial?.config[f.key] ?? "")}
              placeholder={f.type === "password" && initial?.config[f.key] ? "O'zgartirmaslik uchun bo'sh qoldiring" : f.placeholder}
              autoComplete={f.type === "password" ? "new-password" : "off"}
              min={f.type === "number" ? 1 : undefined}
            />
          )}
          {f.help && <span className="mt-1 block text-xs text-ink-500">{f.help}</span>}
        </Field>
      ))}
      {provider.events.length > 0 && (
        <fieldset>
          <legend className="label">Qaysi hodisalar yuborilsin</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {provider.events.map((ev) => (
              <label key={ev} className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  name="events"
                  value={ev}
                  defaultChecked={initial ? initial.events.includes(ev) : true}
                  className="size-4 accent-brand-600"
                />
                {eventLabels[ev] ?? ev}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
        <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} className="size-4 accent-brand-600" /> Faol
      </label>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" disabled={saving}>
        {initial ? "Saqlash" : "Ulash"}
      </Button>
    </form>
  );
}
