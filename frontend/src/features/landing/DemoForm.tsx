"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { api } from "@/shared/lib/api";
import { Button } from "@/shared/ui/Button";
import { Field, Input, Textarea } from "@/shared/ui/Field";
import { EASE, m } from "@/shared/ui/motion";
import { Alert } from "@/shared/ui/States";

export function DemoForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    setError(undefined);
    try {
      await api("/public/leads", { method: "POST", json: data });
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="flex flex-col items-center gap-3 py-10 text-center">
        <m.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}>
          <CircleCheck className="size-14 text-brand-600" />
        </m.span>
        <p className="text-lg font-bold text-ink-900">Rahmat! So&apos;rovingiz qabul qilindi.</p>
        <p className="text-sm text-ink-600">Mutaxassisimiz 1 ish soati ichida siz bilan bog&apos;lanadi.</p>
      </m.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ismingiz">
          <Input name="name" required minLength={2} autoComplete="name" placeholder="Ism Familiya" />
        </Field>
        <Field label="Telefon">
          <Input name="phone" required minLength={7} type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" />
        </Field>
      </div>
      <Field label="Kompaniya">
        <Input name="company" autoComplete="organization" placeholder="Kompaniya nomi" />
      </Field>
      <Field label="Izoh">
        <Textarea name="message" placeholder="Agentlar soni, omborlar soni, qiziqtirgan modullar…" />
      </Field>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" size="lg" className="w-full" disabled={state === "sending"}>
        {state === "sending" ? "Yuborilmoqda…" : "Demoga yozilish"}
      </Button>
      <p className="text-center text-xs text-ink-500">Formani to&apos;ldirib, shaxsiy ma&apos;lumotlarni qayta ishlashga rozilik bildirasiz.</p>
    </form>
  );
}
